// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithCustomToken } from "firebase/auth";
import { doc, setDoc, getFirestore, collection, query, where, getDoc, getDocs, updateDoc, arrayUnion, documentId, deleteDoc, arrayRemove } from "firebase/firestore";
import { User, userConverter } from "../models/User";
import { projectTaskConverter } from "../models/ProjectTask";
import { projectConverter } from "../models/Project";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);

// Firebase firestore
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// Handling with sign in process
export const googleSignIn = async () => {
  const userResult = await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      if (window.opener) {
        window.opener.postMessage({ user: result.user }, "*");
        window.close();
      }
      
      // The signed-in user info.
      return result.user;

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, credential)
    });

  const user = new User(userResult.displayName, userResult.email, []);
  await createUserDocument(userResult.uid, user);
}

export const customSignIn = async (token) => {
  const userResult = await signInWithCustomToken(auth, token)
    .then(async (result) => {
      const user = result.user;

      return user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
    });

  const user = new User(userResult.displayName, userResult.email, []);
  await createUserDocument(userResult.uid, user);
}

// Handling with firestore
/**
 * creating the user document in firestore after we sign in.
 * @param {*} uid uid of the user
 * @param {*} user user object containing user identification such as email, displayName
 */
const createUserDocument = async(uid, user) => {
  // check if we already have the user or not
  // if we don't then create a new one
  const ref = doc(db, "users", uid).withConverter(userConverter);
  const snap = await getDoc(ref);

  if (!snap.exists()){
    await setDoc(ref, user);
  }
}

/**
 * Update the current user authenticated project list
 * @param {*} uid uid of the signed in user
 * @param {*} pid the id of the project
 */
export const updateUserProject = async(uid, pid) => {
  const ref = doc(db, "users", uid);
  const projectRef = doc(db, "projects", pid);
  await updateDoc(ref, {
    projects: arrayUnion(projectRef)
  });

  return ref;
}

/**
 * Get all the project ids that the authenticated user has
 */
export const getUserProjectIds = async(uid) => {
  const ref = doc(db, "users", uid).withConverter(userConverter);
  const snap = await getDoc(ref);

  if (snap.exists()){
    return snap.data().projects;
  } else {
    return null;
  }
}

/**
 * creating the new project in the firestore
 * @param {*} project project object containing project values
 */
export const createNewProjectDocument = async(project) => {
  // auto-generate the random id 
  const ref = doc(collection(db, "projects")).withConverter(projectConverter);
  const contributors = project.contributors;
  const emptyContributorsProject = project;
  emptyContributorsProject.contributors = []
  await setDoc(ref, emptyContributorsProject);

  // Update the project that the creator user has
  await updateUserProject(auth.currentUser.uid, ref.id);

  // Update the contributor of the project
  await updateProjectContributors(ref.id, auth.currentUser.uid)

  // Update the added contributors' project list.
  const userRef = collection(db, "users");
  contributors.forEach(async contributor => {
    const q = query(userRef, where("email", "==", contributor.email))

    const querySnapshot = await getDocs(q);
    const user = []

    querySnapshot.forEach((doc) => {
      user.push({id: doc.id})
    })

    const contributorUserId = user[0].id
    await updateUserProject(contributorUserId, ref.id)
    await updateProjectContributors(ref.id, contributorUserId)
  })
}

/**
 * update the project contributors
 * @param {*} pid project id
 * @param {*} uid user id
 */
export const updateProjectContributors = async(pid, uid) => {
  const pRef = doc(db, "projects", pid);
  const uRef = doc(db, "users", uid);

  await updateDoc(pRef, {
    contributors: arrayUnion(uRef)
  })
}

export const removeUserProjectList = async (pid, deletedUser) => {
  const pRef = doc(db, 'projects', pid);
  const userCollection = collection(db, "users");

  const contributorsRef = []
 
  await Promise.all(
    deletedUser.map(async (userDetail) => {
      const q = query(userCollection, where("email", "==", userDetail.email))

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((res) => {
        const uRef = doc(db, "users", res.id)
        contributorsRef.push(uRef)
      })
    })
  );

  contributorsRef.map(async (eachRef) => {
    await updateDoc(eachRef,{
      projects: arrayRemove(pRef)
    })
  })
}

export const updateProject = async (pid, newUpdateProject) => {
  const pRef = doc(db, 'projects', pid);
  const userCollection = collection(db, "users");

  const contributorsRef = []
 
  await Promise.all(
    newUpdateProject.contributors.map(async (eachEmail) => {
      const q = query(userCollection, where("email", "==", eachEmail))

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((res) => {
        const uRef = doc(db, "users", res.id)
        contributorsRef.push(uRef)
      })
    })
  );

  // this one, the contributors are the ref, not the email anymore
  const finalUpdatedProject = { ...newUpdateProject, contributors: [] }

  await updateDoc(pRef, finalUpdatedProject);
  
  //manually update the contributors again
  contributorsRef.forEach(async ref => {
    await updateDoc(pRef, {
      contributors: arrayUnion(ref)
    })

    // update the user's project list
    await updateDoc(ref, {
      projects: arrayUnion(pRef)
    })
  })

  // need to update the user's project list as well if we remove them

}

export const checkUsersExists = async(userEmail) => {
  const ref = collection(db, "users");
  const q = query(ref, where("email", "==", userEmail))

  const querySnapshot = await getDocs(q);
  const user = []

  querySnapshot.forEach((doc) => {
    user.push({...doc.data()})
  })
  return user;
}

/**
 * Get the project based on the project ID that the authenticated user has
 * @param {*} userProjectIds list of project that the user owns
 */
export const getProjects = async(userProjectIds) => {
  if (!userProjectIds) return [];
  if (userProjectIds.length == 0) return [];

  const ref = collection(db, "projects");
  const q = query(ref, where(documentId(), "in", userProjectIds));

  const querySnapshot = await getDocs(q);
  const projectList = []

  querySnapshot.forEach((doc) => {
    projectList.push({id:doc.id, ...doc.data()});
  })
  return projectList
}

/**
 * Get all the contributors of a particular project
 * @param {*} projectId is the project id
 * @returns list of contributors
 */
export const getContributors = async(projectId) => {
  const ref = doc(db, "projects", projectId);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const contributors = []
    const c = snapshot.data().contributors;
    await Promise.all(c.map(async (userRef) => {
      const userSnap = await getDoc(userRef)
      const userData = userSnap.data();
      contributors.push(userData);
    }));
    return contributors;
  } 
  else { return []; }
}

/**
 * Get the user details based on the userRef
 * @param {*} userRef is the user reference (we have that inside the Task.owners and Project.contributors)
 * @returns user details otherwise it's null
 */
export const getUser = async(userRef) => {
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data();
  } 
  return null
}

export const removeProjectWithAllTasks = async (projectId) => {
  const ref = doc(db, "projects", projectId);
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    const projectDetails = docSnap.data();
    const tasksRefs = projectDetails.tasks;

    tasksRefs?.forEach(async taskRef => await deleteDoc(taskRef))
    await deleteDoc(ref);

    // need to update the user project list as well

  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
  }
}

export const removeParticularTask = async (taskId, chosenProjectId) => {
  const ref = doc(db, "projectTasks", taskId);
  await deleteDoc(ref)

  const pRef = doc(db, 'projects', chosenProjectId);
  await updateDoc(pRef, {
    tasks: arrayRemove(ref)
  })
}

export const createNewProjectTaskDocument = async(projectTask, projectId) => {
  const ref = doc(collection(db, "projectTasks")).withConverter(projectTaskConverter);
  await setDoc(ref, projectTask);

  // find the user, so inside the ProjectTask, it will have the owners as a reference, instead of the email
  const userCollectionRef = collection(db, "users");
  const q = query(userCollectionRef, where("email", "==", projectTask.owners))

  // get the user uid for the ref
  const userUid = []
  const userQuerySnapshot = await getDocs(q);
  userQuerySnapshot.forEach((doc) => {
    userUid.push({id: doc.id, name:doc.data().name, email: doc.data().email})
  })

  const user = userUid[0]
  // get the user reference
  const userRef = doc(db, "users", user.id)

  // Update the owner of the projectTask so that it would link to the particular user
  await updateDoc(ref, {
    owners: [{ref: userRef, name: user.name, email: user.email}]
  })

  // update the project data to link to the task that the project has
  const pRef = doc(db, "projects", projectId);
  await updateDoc(pRef, {
    tasks: arrayUnion(ref)
  })
}

export const getTaskDocuments = async(projectId) => {
  const ref = doc(db, "projects", projectId);

  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    const tasks = []
    const c = snapshot.data().tasks;
    if (c) {
      await Promise.all(c.map(async (taskRef) => {
        const taskSnap = await getDoc(taskRef)
        const taskData = taskSnap.data();

        // retrieve the owners details as well
        if (taskData)
          tasks.push({id:taskSnap.id, ...taskData});
      }));
      return tasks;
    }
  } 
  return []; 
}

export const updateTask = async(taskId, editedTask) => {
  const taskRef = doc(db, "projectTasks", taskId);

  // update the owner so that we will have the docRef, instead of email only
  const userCollectionRef = collection(db, "users");
  const q = query(userCollectionRef, where("email", "==", editedTask.owners))

  // get the user uid for the ref
  const userUids = []
  const userQuerySnapshot = await getDocs(q);
  userQuerySnapshot.forEach((doc) => {
    userUids.push({id: doc.id, data: doc.data()})
  })

  // get the user reference
  const userDetails = userUids[0];
  const userRef = doc(db, "users", userDetails.id)

  // // Update the owner of the projectTask so that it would link to the particular user
  await updateDoc(taskRef, {
    ...editedTask,
    owners: [{name: userDetails.data.name, email: userDetails.data.email, ref: userRef}]
  })
}
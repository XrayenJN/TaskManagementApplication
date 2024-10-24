import { doc, collection, setDoc, query, where, getDocs, updateDoc, arrayUnion, arrayRemove, documentId, getDoc, deleteDoc } from "firebase/firestore";
import { projectConverter } from "../models/Project";
import { db, auth } from "./firebase";
import { updateUserProject } from "./user";

/**
 * creating the new project in the firestore
 * @param {*} project project object containing project values
 */

export const createNewProjectDocument = async (project) => {
  // auto-generate the random id 
  const ref = doc(collection(db, "projects")).withConverter(projectConverter);
  const contributors = project.contributors;
  const emptyContributorsProject = project;
  emptyContributorsProject.contributors = [];
  await setDoc(ref, emptyContributorsProject);

  // Update the project that the creator user has
  await updateUserProject(auth.currentUser.uid, ref.id);

  // Update the contributor of the project
  await updateProjectContributors(ref.id, auth.currentUser.uid);

  // Update the added contributors' project list.
  const userRef = collection(db, "users");
  contributors.forEach(async (contributor) => {
    const q = query(userRef, where("email", "==", contributor.email));

    const querySnapshot = await getDocs(q);
    const user = [];

    querySnapshot.forEach((doc) => {
      user.push({ id: doc.id });
    });

    const contributorUserId = user[0].id;
    await updateUserProject(contributorUserId, ref.id);
    await updateProjectContributors(ref.id, contributorUserId);
  });
};
/**
 * update the project contributors
 * @param {*} pid project id
 * @param {*} uid user id
 */

export const updateProjectContributors = async (pid, uid) => {
  const pRef = doc(db, "projects", pid);
  const uRef = doc(db, "users", uid);

  await updateDoc(pRef, {
    contributors: arrayUnion(uRef)
  });
};

export const removeUserProjectList = async (pid, deletedUser) => {
  const pRef = doc(db, 'projects', pid);
  const userCollection = collection(db, "users");

  const contributorsRef = [];

  await Promise.all(
    deletedUser.map(async (userDetail) => {
      const q = query(userCollection, where("email", "==", userDetail.email));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((res) => {
        const uRef = doc(db, "users", res.id);
        contributorsRef.push(uRef);
      });
    })
  );

  contributorsRef.map(async (eachRef) => {
    await updateDoc(eachRef, {
      projects: arrayRemove(pRef)
    });
  });
};

export const updateProject = async (pid, newUpdateProject) => {
  const pRef = doc(db, 'projects', pid);
  const userCollection = collection(db, "users");

  const contributorsRef = [];

  await Promise.all(
    newUpdateProject.contributors.map(async (eachEmail) => {
      const q = query(userCollection, where("email", "==", eachEmail));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((res) => {
        const uRef = doc(db, "users", res.id);
        contributorsRef.push(uRef);
      });
    })
  );

  // this one, the contributors are the ref, not the email anymore
  const finalUpdatedProject = { ...newUpdateProject, contributors: [] };

  await updateDoc(pRef, finalUpdatedProject);

  //manually update the contributors again
  contributorsRef.forEach(async (ref) => {
    await updateDoc(pRef, {
      contributors: arrayUnion(ref)
    });

    // update the user's project list
    await updateDoc(ref, {
      projects: arrayUnion(pRef)
    });
  });

  // need to update the user's project list as well if we remove them
};/**
 * Get the project based on the project ID that the authenticated user has
 * @param {*} userProjectIds list of project that the user owns
 */

export const getProjects = async (userProjectIds) => {
  if (!userProjectIds) return [];
  if (userProjectIds.length == 0) return [];

  const ref = collection(db, "projects");
  const q = query(ref, where(documentId(), "in", userProjectIds));

  const querySnapshot = await getDocs(q);
  const projectList = [];

  querySnapshot.forEach((doc) => {
    projectList.push({ id: doc.id, ...doc.data() });
  });
  return projectList;
};
/**
 * Get all the contributors of a particular project
 * @param {*} projectId is the project id
 * @returns list of contributors
 */

export const getContributors = async (projectId) => {
  const ref = doc(db, "projects", projectId);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const contributors = [];
    const c = snapshot.data().contributors;
    await Promise.all(c.map(async (userRef) => {
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      contributors.push(userData);
    }));
    return contributors;
  }
  else { return []; }
};
export const removeProjectWithAllTasks = async (projectId) => {
  const ref = doc(db, "projects", projectId);
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    const projectDetails = docSnap.data();
    const tasksRefs = projectDetails.tasks;

    tasksRefs?.forEach(async (taskRef) => await deleteDoc(taskRef));
    await deleteDoc(ref);

    // need to update the user project list as well
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
  }
};


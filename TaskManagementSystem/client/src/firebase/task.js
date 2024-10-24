import { doc, deleteDoc, updateDoc, arrayRemove, collection, setDoc, query, where, getDocs, arrayUnion, getDoc } from "firebase/firestore";
import { projectTaskConverter } from "../models/ProjectTask";
import { db } from "./firebase";


export const removeParticularTask = async (taskId, chosenProjectId) => {
  const ref = doc(db, "projectTasks", taskId);
  await deleteDoc(ref);

  const pRef = doc(db, 'projects', chosenProjectId);
  await updateDoc(pRef, {
    tasks: arrayRemove(ref)
  });
};

export const createNewProjectTaskDocument = async (projectTask, projectId) => {
  const ref = doc(collection(db, "projectTasks")).withConverter(projectTaskConverter);
  await setDoc(ref, projectTask);

  // find the user, so inside the ProjectTask, it will have the owners as a reference, instead of the email
  const userCollectionRef = collection(db, "users");
  const q = query(userCollectionRef, where("email", "==", projectTask.owners));

  // get the user uid for the ref
  const userUid = [];
  const userQuerySnapshot = await getDocs(q);
  userQuerySnapshot.forEach((doc) => {
    userUid.push({ id: doc.id, name: doc.data().name, email: doc.data().email });
  });

  const user = userUid[0];
  // get the user reference
  const userRef = doc(db, "users", user.id);

  // Update the owner of the projectTask so that it would link to the particular user
  await updateDoc(ref, {
    owners: [{ ref: userRef, name: user.name, email: user.email }]
  });

  // update the project data to link to the task that the project has
  const pRef = doc(db, "projects", projectId);
  await updateDoc(pRef, {
    tasks: arrayUnion(ref)
  });
};

export const getTaskDocuments = async (projectId) => {
  const ref = doc(db, "projects", projectId);

  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    const tasks = [];
    const c = snapshot.data().tasks;
    if (c) {
      await Promise.all(c.map(async (taskRef) => {
        const taskSnap = await getDoc(taskRef);
        const taskData = taskSnap.data();

        // retrieve the owners details as well
        if (taskData)
          tasks.push({ id: taskSnap.id, ...taskData });
      }));
      return tasks;
    }
  }
  return [];
};

export const updateTask = async (taskId, editedTask) => {
  const taskRef = doc(db, "projectTasks", taskId);

  // update the owner so that we will have the docRef, instead of email only
  const userCollectionRef = collection(db, "users");
  const q = query(userCollectionRef, where("email", "==", editedTask.owners));

  // get the user uid for the ref
  const userUids = [];
  const userQuerySnapshot = await getDocs(q);
  userQuerySnapshot.forEach((doc) => {
    userUids.push({ id: doc.id, data: doc.data() });
  });

  // get the user reference
  const userDetails = userUids[0];
  const userRef = doc(db, "users", userDetails.id);

  // // Update the owner of the projectTask so that it would link to the particular user
  await updateDoc(taskRef, {
    ...editedTask,
    owners: [{ name: userDetails.data.name, email: userDetails.data.email, ref: userRef }]
  });
};

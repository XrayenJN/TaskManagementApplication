import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs, query, where } from "firebase/firestore";
import { userConverter } from "../models/User";
import { db } from "./firebase";

/**
 * creating the user document in firestore after we sign in.
 * @param {*} uid uid of the user
 * @param {*} user user object containing user identification such as email, displayName
 */

export const createUserDocument = async (uid, user) => {
  // check if we already have the user or not
  // if we don't then create a new one
  const ref = doc(db, "users", uid).withConverter(userConverter);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, user);
  }
};
/**
 * Update the current user authenticated project list
 * @param {*} uid uid of the signed in user
 * @param {*} pid the id of the project
 */

export const updateUserProject = async (uid, pid) => {
  const ref = doc(db, "users", uid);
  const projectRef = doc(db, "projects", pid);
  await updateDoc(ref, {
    projects: arrayUnion(projectRef)
  });

  return ref;
};
/**
 * Get all the project ids that the authenticated user has
 */

export const getUserProjectIds = async (uid) => {
  const ref = doc(db, "users", uid).withConverter(userConverter);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data().projects;
  } else {
    return null;
  }
};/**
 * Get the user details based on the userRef
 * @param {*} userRef is the user reference (we have that inside the Task.owners and Project.contributors)
 * @returns user details otherwise it's null
 */

export const getUser = async (userRef) => {
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
};
export const checkUsersExists = async (userEmail) => {
  const ref = collection(db, "users");
  const q = query(ref, where("email", "==", userEmail));

  const querySnapshot = await getDocs(q);
  const user = [];

  querySnapshot.forEach((doc) => {
    user.push({ ...doc.data() });
  });
  return user;
};


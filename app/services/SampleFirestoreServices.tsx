import { db } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";


async function createUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef; 
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}


async function createUserWithId() {
  try {
    await setDoc(doc(db, "users", "john123"), {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });
    console.log("Document created with custom ID");
  } catch (error) {
    console.error("Error: ", error);
  }
}


async function getUser(userId: any) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
}


async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}


async function updateUser(userId: any) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      age: 31,
      updatedAt: new Date(),
    });
    console.log("Document updated");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}


async function deleteUser(userId: any) {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log("Document deleted");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}




async function createUserPost(userId: any, postData: any) {
  try {
    const postsRef = collection(db, "users", userId, "posts");
    const docRef = await addDoc(postsRef, {
      title: postData.title,
      content: postData.content,
      createdAt: new Date(),
      likes: 0,
    });
    console.log("Post created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating post: ", error);
  }
}


async function getUserPosts(userId: any) {
  try {
    const postsRef = collection(db, "users", userId, "posts");
    const querySnapshot = await getDocs(postsRef);

    const posts: any[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("User posts:", posts);
    return posts;
  } catch (error) {
    console.error("Error getting posts: ", error);
  }
}


async function updateUserPost(userId: any, postId: any, updates: any) {
  try {
    const postRef = doc(db, "users", userId, "posts", postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: new Date(),
    });
    console.log("Post updated");
  } catch (error) {
    console.error("Error updating post: ", error);
  }
}


async function addCommentToPost(userId: any, postId: any, commentData: any) {
  try {
    const commentsRef = collection(
      db,
      "users",
      userId,
      "posts",
      postId,
      "comments"
    );
    const docRef = await addDoc(commentsRef, {
      author: commentData.author,
      text: commentData.text,
      createdAt: new Date(),
    });
    console.log("Comment added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
}



async function getActiveUsers() {
  try {
    const q = query(
      collection(db, "users"),
      where("age", ">=", 18),
      where("status", "==", "active"),
      orderBy("age"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error querying: ", error);
  }
}


async function getRecentPosts(userId: any) {
  try {
    const q = query(
      collection(db, "users", userId, "posts"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    const posts :any[]= [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return posts;
  } catch (error) {
    console.error("Error getting recent posts: ", error);
  }
}


async function searchUsersByUsername(searchText: string) {
  if (!searchText) {
    return [];
  }

  try {
    const usersRef = collection(db, "users");
    
    
    const q = query(
      usersRef,
      where("username", ">=", searchText),
      where("username", "<=", searchText + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error searching users: ", error);
  }
}




function listenToUser(userId: any, callback: any) {
  const userRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });

  
  return unsubscribe;
}


function listenToUserPosts(userId: any, callback: any) {
  const postsRef = collection(db, "users", userId, "posts");

  const unsubscribe = onSnapshot(postsRef, (snapshot) => {
    const posts :any[]= [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    callback(posts);
  });

  return unsubscribe;
}




async function batchOperations() {
  const batch = writeBatch(db);

  
  const newUserRef = doc(collection(db, "users"));
  batch.set(newUserRef, { name: "Alice", email: "alice@example.com" });

  
  const existingUserRef = doc(db, "users", "john123");
  batch.update(existingUserRef, { lastActive: new Date() });

  
  const deleteUserRef = doc(db, "users", "oldUser123");
  batch.delete(deleteUserRef);

  try {
    await batch.commit();
    console.log("Batch operation completed");
  } catch (error) {
    console.error("Batch operation failed: ", error);
  }
}




async function exampleBlogOperations() {
  
  await setDoc(doc(db, "users", "user123"), {
    name: "Jane Smith",
    email: "jane@example.com",
    bio: "Tech blogger",
  });

  
  const postId = await createUserPost("user123", {
    title: "My First Post",
    content: "This is my first blog post!",
  });

  
  await addCommentToPost("user123", postId, {
    author: "Reader1",
    text: "Great post!",
  });

  
  const unsubscribe = listenToUserPosts("user123", (posts: any) => {
    console.log("Updated posts:", posts);
  });

  
  
}


export {
  addCommentToPost,
  batchOperations,
  createUser,
  createUserPost,
  createUserWithId,
  deleteUser,
  exampleBlogOperations,
  getActiveUsers,
  getAllUsers,
  getRecentPosts,
  getUser,
  getUserPosts,
  listenToUser,
  listenToUserPosts,
  updateUser,
  searchUsersByUsername,
  updateUserPost,
};

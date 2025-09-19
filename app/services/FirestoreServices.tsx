import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export async function CreateUserDetails(
  username: string,
  email: string,
  profileUrl: string
) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      username: username,
      email: email,
      profileUrl: profileUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export async function searchUsersByUsername(searchText: string) {
  if (!searchText) {
    return [];
  }

  try {
    const usersRef = collection(db, "users");
    // Create a query to find usernames that start with the searchText
    // The '\uf8ff' character is a high-value Unicode character that acts as a "limit" for the search.
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

export async function getUser(userId: string) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user document: ", error);
  }
}

export async function CreateChatPage(
  startUserId: string,
  recepientUserId: string
) {
  try {
    // Check if a chat already exists between these two users
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      or(
        where("participants", "==", [startUserId, recepientUserId]),
        where("participants", "==", [recepientUserId, startUserId])
      )
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Chat already exists, return its ID
      const existingChat = querySnapshot.docs[0];
      return existingChat.id;
    }

    // If no chat exists, create a new one
    const docRef = await addDoc(collection(db, "chats"), {
      participants: [startUserId, recepientUserId],
      lastMessage: "",
      lastMessageTimestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}

export function listenToUserChats(callback: (chats: any[]) => void) {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) return () => {};

  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "array-contains", currentUserId),
    orderBy("lastMessageTimestamp", "desc")
  );

  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const chatsPromises = querySnapshot.docs.map(async (doc) => {
      const chatData = doc.data();
      const recepientId = chatData.participants.find(
        (id: string) => id !== currentUserId
      );

      if (recepientId) {
        const userDoc = await getUser(recepientId);
        return {
          id: doc.id,
          ...chatData,
          recepient: userDoc, // Add recipient's user data
        };
      }
      return null;
    });
    const chats = (await Promise.all(chatsPromises)).filter(Boolean);
    callback(chats as any[]);
  });

  return unsubscribe;
}

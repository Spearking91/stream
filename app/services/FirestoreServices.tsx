import AsyncStorage from "@react-native-async-storage/async-storage";
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
  runTransaction,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

type UserDetails = {
  username: string;
  email: string;
  profileUrl: string;
};

export async function CreateUserDetails(userId: string, details: UserDetails) {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      ...details,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
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
      unreadCount: { [startUserId]: 0, [recepientUserId]: 0 },
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

  const cacheKey = `user_chats_${currentUserId}`;

  // Immediately try to load from cache
  AsyncStorage.getItem(cacheKey).then((cachedData) => {
    if (cachedData) {
      callback(JSON.parse(cachedData));
    }
  });

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
    // Update cache with fresh data
    AsyncStorage.setItem(cacheKey, JSON.stringify(chats)).catch((error) =>
      console.error("Failed to cache chats:", error)
    );

    callback(chats as any[]);
  });

  return unsubscribe;
}

export async function sendMessageToChat(
  chatId: string,
  senderId: string,
  content: string
) {
  try {
    // Add the message to the messages subcollection
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId: senderId,
      content: content,
      isRead: false,
      createdAt: Timestamp.now(),
    });

    // Update the last message on the parent chat document
    const chatRef = doc(db, "chats", chatId);
    await setDoc(
      chatRef,
      {
        lastMessage: content,
        lastMessageTimestamp: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    // Increment unread count for the recipient
    await runTransaction(db, async (transaction) => {
      const chatDoc = await transaction.get(chatRef);
      if (!chatDoc.exists()) {
        throw "Document does not exist!";
      }
      const chatData = chatDoc.data();
      const recipientId = chatData.participants.find(
        (id: string) => id !== senderId
      );
      if (recipientId) {
        const newCount = (chatData.unreadCount?.[recipientId] || 0) + 1;
        transaction.update(chatRef, {
          [`unreadCount.${recipientId}`]: newCount,
        });
      }
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export function listenToMessages(
  chatId: string,
  callback: (messages: any[]) => void
) {
  const cacheKey = `chat_messages_${chatId}`;

  // Immediately try to load from cache
  AsyncStorage.getItem(cacheKey).then((cachedData) => {
    if (cachedData) {
      callback(JSON.parse(cachedData));
    }
  });

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update cache with fresh data
    AsyncStorage.setItem(cacheKey, JSON.stringify(messages)).catch((error) =>
      console.error("Failed to cache messages:", error)
    );
    callback(messages);
  });
}

export async function markMessagesAsRead(
  chatId: string,
  currentUserId: string
) {
  if (!chatId || !currentUserId) return;

  try {
    // Reset the unread count for the current user for this chat.
    const chatRef = doc(db, "chats", chatId);
    await setDoc(
      chatRef,
      {
        unreadCount: {
          [currentUserId]: 0,
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error marking messages as read: ", error);
  }
}

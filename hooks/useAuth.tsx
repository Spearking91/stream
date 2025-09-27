import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getUser } from "../app/services/FirestoreServices";
import { auth } from "../firebaseConfig";

type UserWithDetails = User & {
  details?: any;
};

export function useAuth() {
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get details from Firestore
        const userDetails = await getUser(firebaseUser.uid);
        setUser({
          ...firebaseUser,
          details: userDetails,
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
}

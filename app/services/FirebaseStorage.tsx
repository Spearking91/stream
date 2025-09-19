import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebaseConfig";

async function uploadFile(file: any, path: any) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    console.log("File uploaded successfully!", snapshot);

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function uploadProfilePicture(userId: any, file: any) {
  const path = `users/${userId}/profile.jpg`;
  try {
    const downloadURL = await uploadFile(file, path);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
}

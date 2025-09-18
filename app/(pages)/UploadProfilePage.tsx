import { uploadProfilePicture } from "../services/FirebaseStorage";
import { CreateUserDetails } from "../services/FirestoreServices";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function UploadProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      if (!username || !email || !image) {
        setError("Please fill all fields and select an image.");
        setUploading(false);
        return;
      }
      // Convert image to blob
      const response = await fetch(image.uri );
      const blob = await response.blob();
      // Upload image to storage
      const profileUrl = await uploadProfilePicture(username, blob);
      // Save user details to Firestore
      await CreateUserDetails(username, email, profileUrl);
      setSuccess("Profile uploaded successfully!");
      setUsername("");
      setEmail("");
      setImage(null);
    } catch (err: any) {
      setError("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Pick Profile Picture" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      {uploading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Upload" onPress={handleUpload} />
      )}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 10,
  },
  success: {
    color: "green",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

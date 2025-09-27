// Create this as a new component: CompleteProfile.tsx
import { router } from "expo-router";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { CustomText } from "../../components/CustomText";
import { auth } from "../../firebaseConfig";
import { uploadProfilePicture } from "../services/FirebaseStorage";
import { CreateUserDetails } from "../services/FirestoreServices";

interface CompleteProfileProps {
  tempUserData: {
    email: string;
    password: string;
    username: string;
    profileImage: any;
  };
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ tempUserData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const completeSetup = async () => {
    setIsLoading(true);
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        tempUserData.email,
        tempUserData.password
      );

      const user = userCredential.user;
      await user.reload();

      if (!user.emailVerified) {
        Alert.alert("Email Not Verified", "Please verify your email first.");
        return;
      }

      let profileUrl = "";
      
      if (tempUserData.profileImage?.uri) {
        try {
          const response = await fetch(tempUserData.profileImage.uri);
          const blob = await response.blob();
          const downloadURL = await uploadProfilePicture(user.uid, blob);
          if (downloadURL) {
            profileUrl = downloadURL;
          }
        } catch (uploadError) {
          console.error("Profile picture upload failed:", uploadError);
        }
      }

      await updateProfile(user, {
        photoURL: profileUrl,
        displayName: tempUserData.username,
      });

      await CreateUserDetails(user.uid, {
        username: tempUserData.username,
        email: user.email || "",
        profileUrl: profileUrl,
      });

      router.replace("/(tabs)/Chats");
    } catch (error: any) {
      console.error("Profile setup failed: ", error);
      Alert.alert("Setup Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomText style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          Complete Your Profile
        </CustomText>
        <CustomText style={{ textAlign: "center", marginTop: 10, marginBottom: 30 }}>
          Your email has been verified! Let's finish setting up your profile.
        </CustomText>
        <CustomButton
          onPress={completeSetup}
          text="Complete Setup"
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default CompleteProfile;
import { Entypo, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile as updateAuthProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoSvG from "../../assets/svg/logo.svg";
import Avatar from "../../components/Avatar";
import CustomButton from "../../components/CustomButton";
import { CustomText } from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { auth } from "../../firebaseConfig";
import { useDeColors } from "../../hooks/useDeColors";
import { uploadProfilePicture } from "../services/FirebaseStorage";
import { CreateUserDetails } from "../services/FirestoreServices";

const TOTAL_PAGES = 5; // Set this to your actual number of pages

const SignUp = () => {
  const params = useLocalSearchParams<{ page?: string }>();
  const [isCheck, setIsCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [initialPage, setInitialPage] = useState(
    params.page ? parseInt(params.page, 10) : 0
  );
  const { textColor, tintColor } = useDeColors();
  const [correct, setCorrect] = useState(false);
  const [newImage, setNewImage] = useState<any>(null);
  const parameters = [
    { tip: "At least 8 characters" },
    { tip: "Both fields must be identical" },
    { tip: "Must contain at least a symbol or a number" },
    { tip: "Must contain at least a capital letter" },
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setNewImage(result.assets[0]);
    }
  };

  function getPasswordChecks(password: string) {
    return [
      password.length >= 8,
      password === confirmpassword && password !== "",
      /[!@#$%^&*0-9]/.test(password),
      /[A-Z]/.test(password),
    ];
  }

  const [passwordChecks, setPasswordChecks] = useState([
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    setPasswordChecks(getPasswordChecks(password));
  }, [password, confirmpassword]);

  useEffect(() => {
    const onBackPress = () => {
      if (initialPage !== 0) {
        setInitialPage((prev) => prev - 1);
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => subscription.remove();
  }, [initialPage]);

  const signup = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        await sendVerificationAndRedirect(userCredential.user);
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        // This email is already registered. Let's try to sign them in.
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          if (!user.emailVerified) {
            // The account exists but is not verified. Resend email.
            Alert.alert(
              "Account Not Verified",
              "This account already exists but has not been verified. We are sending another verification email."
            );
            await sendVerificationAndRedirect(user);
          } else {
            // The account is already verified, so just log them in.
            router.replace("/(tabs)/Chats");
          }
        } catch (signInError: any) {
          Alert.alert("Login Failed", "The password you entered is incorrect.");
        }
      } else {
        console.error("Signup failed: ", error);
        Alert.alert("Signup Failed", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationAndRedirect = async (user: any) => {
    await sendEmailVerification(user, {
      url: `https://stream-chat-app-mobile.firebaseapp.com/verify-email.html`,
    });
    router.replace({
      pathname: "/(auth)/PleaseVerifyEmail",
      params: { email: email },
    });
  };

  const updateProfile = async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);

    try {
      let profileUrl = "";
      // 1. If a new image is selected, upload it to Firebase Storage
      if (newImage?.uri) {
        const response = await fetch(newImage.uri);
        const blob = await response.blob();
        const downloadURL = await uploadProfilePicture(
          auth.currentUser.uid,
          blob
        );
        if (downloadURL) {
          profileUrl = downloadURL;
        }
      }

      // Update Firebase Auth profile
      await updateAuthProfile(auth.currentUser, {
        photoURL: profileUrl,
        displayName: username,
      });

      // 2. Create the user document in Firestore with the profile URL
      await CreateUserDetails(auth.currentUser.uid, {
        username: username,
        email: auth.currentUser.email || "",
        profileUrl: profileUrl,
      });

      // 3. Navigate to the main app
      router.replace("/(tabs)/Chats");
    } catch (error) {
      console.error("Profile update failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = () => {
    setInitialPage((prev) => (prev < TOTAL_PAGES - 1 ? prev + 1 : prev));
  };

  return (
    <PagerView
      scrollEnabled={false}
      style={{ flex: 1 }}
      initialPage={initialPage}
      key={initialPage}
    >
      <SafeAreaView key={1} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 20,
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LogoSvG width={150} height={150} />
          </View>
          <Text style={{ textAlign: "center", color: textColor }}>
            By Creating an account , you agree to all our{" "}
            <Link style={{ fontWeight: "700", color: tintColor }} href={"/"}>
              Terms and Conditions
            </Link>
          </Text>
          <CustomButton onPress={nextPage} text={"Continue"} />
        </View>
      </SafeAreaView>
      <SafeAreaView key={2} style={{ flex: 1, padding: 10 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <View style={{ width: "80%", gap: 5 }}>
            <CustomText
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "medium",
              }}
            >
              Create your account
            </CustomText>
            <CustomText
              style={{ textAlign: "center", fontWeight: "condensed" }}
              children={
                "Choose between signing up email or with google account"
              }
            />
          </View>
          <CustomTextInput
            design={{}}
            style={{ width: "100%" }}
            placeholder={"Enter your email address"}
            text={"Email"}
            value={email}
            setValue={(text: string) => {
              setEmail(text);
            }}
          />
          <CustomText style={{ fontWeight: "light" }} children={"Or"} />
          <CustomButton
            titleColor={"black"}
            isGoogle={true}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderWidth: 1,
            }}
            onPress={undefined}
            text={"Google"}
          />
        </View>

        <CustomButton
          onPress={nextPage}
          text={"Continue"}
          isLoading={isLoading}
        />
      </SafeAreaView>
      {/* Page 3 (OTP) is now removed. Page 4 becomes Page 3 */}
      <SafeAreaView key={3} style={{ flex: 1, padding: 10 }}>
        <View style={{ flex: 1, justifyContent: "center", gap: 20 }}>
          <View style={{ width: "80%", alignSelf: "center", gap: 5 }}>
            <CustomText
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "medium",
              }}
            >
              Create your account password
            </CustomText>
            <CustomText
              style={{ textAlign: "center", fontWeight: "condensed" }}
              children={"Your passwords must be identical and be strong enough"}
            />
          </View>
          <CustomTextInput
            placeholder={"Enter password"}
            text={"Password"}
            value={password}
            setValue={(text: string) => {
              setPassword(text);
            }}
          />
          <CustomTextInput
            placeholder={"Confirm password"}
            text={"Confirm Password"}
            value={confirmpassword}
            setValue={(text: string) => {
              setConfirmPassword(text);
            }}
          />
          <FlatList
            data={parameters}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather
                  name="check-circle"
                  size={18}
                  color={passwordChecks[index] ? "green" : "red"}
                />
                <CustomText
                  style={{
                    marginLeft: 10,
                    color: passwordChecks[index] ? "green" : "red",
                  }}
                  children={item.tip}
                />
              </View>
            )}
          />
        </View>
        <CustomButton
          onPress={signup}
          text={"Continue"}
          isLoading={isLoading}
        />
      </SafeAreaView>
      <SafeAreaView // This was key={5}, now it's key={4}
        key={4}
        style={{
          flex: 1,
          gap: 20,
          padding: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{
              flexShrink: 1,
            }}
          >
            <Avatar
              source={
                newImage && newImage.uri ? { uri: newImage.uri } : undefined
              }
              radius={200}
            />
            <View
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                backgroundColor: "white",
                borderRadius: 20,
                padding: 5,
              }}
            >
              <Entypo name="edit" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <CustomTextInput
            style={{ width: "100%" }}
            placeholder={"Enter your Username"}
            text={"Username"}
            value={username}
            setValue={(text: string) => {
              setUsername(text);
            }}
          />
        </View>
        <CustomButton
          isLoading={isLoading}
          onPress={updateProfile}
          text={"Create Account"}
        />
      </SafeAreaView>
    </PagerView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});

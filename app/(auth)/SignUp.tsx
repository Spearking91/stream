import { Entypo, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
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

const TOTAL_PAGES = 5; // Set this to your actual number of pages

const SignUp = () => {
  const [isCheck, setIsCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [initialPage, setInitialPage] = useState(0);
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
  }, [password]);

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
        // Set the user's display name
        await updateProfile(userCredential.user, {
          displayName: username,
        });

        // Send the verification email with the deep link
        await sendEmailVerification(userCredential.user, {
          // This is a standard web link. The OS will open the app if it's
          // configured for Universal Links / App Links.
          url: `https://stream-chat-app-mobile.firebaseapp.com/verify-email`,
        });

        // Redirect to a page telling the user to check their email
        router.replace({
          pathname: "/(auth)/PleaseVerifyEmail",
          params: { email: email },
        });
      }
    } catch (error: any) {
      console.error("Signup failed: ", error);
      // Consider replacing this with a user-friendly toast/snackbar
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

        <CustomButton onPress={nextPage} text={"Continue"} />
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
        <CustomButton onPress={nextPage} text={"Continue"} />
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
            // onPress={pickImage}
            style={{
              flexShrink: 1,
            }}
          >
            <Avatar
              // source={newImage && newImage.uri ? { uri: newImage.uri } : undefined}
              radius={200}
              source={undefined}
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
          onPress={signup}
          text={"Create Account"}
        />
      </SafeAreaView>
    </PagerView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});

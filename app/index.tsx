import { Redirect } from "expo-router";
import SplashScreen from "./SplashScreen";

export default function Index() {
  return <Redirect href={"/SplashScreen"} />;
}

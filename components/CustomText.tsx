import { useThemeColor } from "@/app-example/hooks/useThemeColor";
import { StyleSheet, Text, type TextProps } from "react-native";

export type CustomTextProps = TextProps;

export function CustomText({ style, ...rest }: CustomTextProps) {
  const textColor = useThemeColor({}, "text");
  return <Text style={[{ color: textColor }, style]} {...rest} />;
}

const styles = StyleSheet.create({});

import { StyleSheet, Text, type TextProps } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

export type CustomTextProps = TextProps;

export function CustomText({ style, ...rest }: CustomTextProps) {
  const textColor = useThemeColor({}, "text");
  return <Text style={[{ color: textColor }, style]} {...rest} />;
}

const styles = StyleSheet.create({});

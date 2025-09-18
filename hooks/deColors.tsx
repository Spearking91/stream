import { useThemeColor } from "@/app-example/hooks/useThemeColor";

/**
 * Custom hook to get all theme colors.
 */
export function useDeColors() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");
  const tabIconDefaultColor = useThemeColor({}, "tabIconDefault");
  const tabIconSelectedColor = useThemeColor({}, "tabIconSelected");

  return {
    backgroundColor,
    textColor,
    tintColor,
    iconColor,
    tabIconDefaultColor,
    tabIconSelectedColor,
  };
}

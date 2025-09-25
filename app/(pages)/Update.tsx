import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

// --- Configuration ---
// Replace with your GitHub username and repository name
const GITHUB_OWNER = "Spearking91";
const GITHUB_REPO = "stream";
// ---

const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

// --- Type Definitions for GitHub API Response ---
interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubAsset[];
}
// ---

const Update = () => {
  const [status, setStatus] = useState("Checking for updates...");
  const [isLoading, setIsLoading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(
    null
  );

  const currentVersion = Constants.expoConfig?.version ?? "0.0.0";

  const checkForUpdates = async () => {
    if (Platform.OS !== "android") {
      setStatus("Updates are only supported on Android for this app.");
      return;
    }

    setIsLoading(true);
    setStatus("Checking for updates...");

    try {
      const response = await fetch(GITHUB_API_URL);
      const release = await response.json();

      if (release.tag_name) {
        const latestVersion = release.tag_name.replace("v", "");

        if (latestVersion > currentVersion) {
          setUpdateAvailable(true);
          setLatestRelease(release);
          setStatus(`New version available: ${latestVersion}`);
        } else {
          setUpdateAvailable(false);
          setStatus("You have the latest version.");
        }
      } else {
        setStatus("Could not find any releases.");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      setStatus("Failed to check for updates.");
      Alert.alert("Error", "Could not connect to GitHub to check for updates.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAndInstallUpdate = async () => {
    if (!latestRelease || !latestRelease.assets) return;

    const apkAsset = latestRelease.assets.find((asset) =>
      asset.name.endsWith(".apk")
    );

    if (!apkAsset) {
      setStatus("No APK file found in the latest release.");
      return;
    }

    setIsLoading(true);
    setStatus("Downloading update...");

    const fileUri = FileSystem.documentDirectory + apkAsset.name;

    try {
      const downloadResult = await FileSystem.downloadAsync(
        apkAsset.browser_download_url,
        fileUri
      );

      setStatus("Download complete. Starting installation...");

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on your device.");
        return;
      }
      await Sharing.shareAsync(downloadResult.uri);
    } catch (error) {
      console.error("Error downloading or installing update:", error);
      setStatus("Failed to install update.");
      Alert.alert("Error", "Could not download or install the update.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Updater</Text>
      <Text style={styles.versionText}>Current Version: {currentVersion}</Text>
      <Text style={styles.statusText}>{status}</Text>
      {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
      {!isLoading && (
        <Button
          title={updateAvailable ? "Download & Install" : "Check for Updates"}
          onPress={updateAvailable ? downloadAndInstallUpdate : checkForUpdates}
          disabled={isLoading}
        />
      )}
    </View>
  );
};

export default Update;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  versionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
});

// import React, { useState } from "react";
// import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
// import {
//   createUser,
//   createUserWithId,
//   deleteUser,
//   getAllUsers,
//   getUser,
//   updateUser,
// } from "../services/SampleFirestoreServices";

// const SettingsPage = () => {
//   const [message, setMessage] = useState("");
//   const [readMessage, setReadMessage] = useState("");
//   const [userData, setUserData] = useState<any>(null);
//   const [allUsers, setAllUsers] = useState<any[]>([]);
//   const [updateMsg, setUpdateMsg] = useState("");
//   const [deleteMsg, setDeleteMsg] = useState("");
//   const [autoId, setAutoId] = useState<string | null>(null);

//   // Create user with custom ID
//   const handleCreate = async () => {
//     try {
//       await createUserWithId();
//       setMessage("User created with custom ID!");
//     } catch (e) {
//       setMessage("Error creating user.");
//     }
//   };

//   // Create user with auto ID
//   const handleCreateAutoId = async () => {
//     try {
//       const docRef = await createUser(); // Modify createUser to return docRef.id
//       setAutoId(docRef.id);
//       setMessage("User created with auto ID!");
//     } catch (e) {
//       setMessage("Error creating user.");
//     }
//   };

//   // Read user
//   const handleRead = async () => {
//     try {
//       const data = await getUser("john123");
//       setUserData(data);
//       setReadMessage("");
//     } catch (e) {
//       setReadMessage("Error reading user.");
//       setUserData(null);
//     }
//   };

//   // Read auto ID user
//   const handleReadAutoId = async () => {
//     if (!autoId) {
//       setReadMessage("No auto ID available.");
//       return;
//     }
//     try {
//       const data = await getUser(autoId);
//       setUserData(data);
//       setReadMessage("");
//     } catch (e) {
//       setReadMessage("Error reading user.");
//       setUserData(null);
//     }
//   };

//   // Read all users
//   const handleReadAll = async () => {
//     try {
//       const users: any[] = [];
//       // getAllUsers only logs, so let's fetch manually
//       const result = await getAllUsers();
//       if (result && Array.isArray(result)) {
//         setAllUsers(result);
//       } else {
//         setAllUsers([]);
//       }
//     } catch (e) {
//       setAllUsers([]);
//     }
//   };

//   // Update user
//   const handleUpdate = async () => {
//     try {
//       await updateUser("john123");
//       setUpdateMsg("User updated!");
//     } catch (e) {
//       setUpdateMsg("Error updating user.");
//     }
//   };

//   // Delete user
//   const handleDelete = async () => {
//     try {
//       await deleteUser("john123");
//       setDeleteMsg("User deleted!");
//     } catch (e) {
//       setDeleteMsg("Error deleting user.");
//     }
//   };

//   return (
//     <ScrollView>
//       <View style={{ padding: 16 }}>
//         <Text style={styles.header}>SettingsPage</Text>
//         <Button title="Create (Custom ID)" onPress={handleCreate} />
//         <View style={styles.spacer} />
//         <Button title="Create (Auto ID)" onPress={handleCreateAutoId} />
//         <View style={styles.spacer} />
//         <Button title="Read User" onPress={handleRead} />
//         <View style={styles.spacer} />
//         <Button title="Read Auto ID User" onPress={handleReadAutoId} />
//         <View style={styles.spacer} />
//         <Button title="Read All Users" onPress={handleReadAll} />
//         <View style={styles.spacer} />
//         <Button title="Update User" onPress={handleUpdate} />
//         <View style={styles.spacer} />
//         <Button title="Delete User" onPress={handleDelete} />
//         <View style={styles.spacer} />

//         {message ? <Text style={styles.result}>{message}</Text> : null}
//         {readMessage ? <Text style={styles.result}>{readMessage}</Text> : null}
//         {updateMsg ? <Text style={styles.result}>{updateMsg}</Text> : null}
//         {deleteMsg ? <Text style={styles.result}>{deleteMsg}</Text> : null}

//         {userData ? (
//           <Text style={styles.result}>
//             Name: {userData.name}
//             {"\n"}
//             Email: {userData.email}
//             {"\n"}
//             Age: {userData.age}
//           </Text>
//         ) : null}

//         {allUsers.length > 0 ? (
//           <View>
//             <Text style={styles.result}>All Users:</Text>
//             {allUsers.map((user, idx) => (
//               <Text key={idx} style={styles.result}>
//                 {JSON.stringify(user)}
//               </Text>
//             ))}
//           </View>
//         ) : null}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   header: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
//   spacer: { height: 10 },
//   result: { marginVertical: 4, fontSize: 16 },
// });

// export default SettingsPage;

import { router } from "expo-router";
import React from "react";
import { Button } from "react-native";
import PagerView from "react-native-pager-view";

const SettingsPage = () => {
  return (
    <PagerView style={{ flex: 1 }} initialPage={0}>
      <Button
        title="Settings Page"
        onPress={() => {
          router.push("/UploadProfilePage");
        }}
      />
    </PagerView>
  );
};

export default SettingsPage;

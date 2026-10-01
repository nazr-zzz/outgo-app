import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import file screen yang sudah ada di folder src/screens/
import HomeScreen from "./src/screens/home";
import AddScreen from "./src/screens/add";
import DetailScreen from "./src/screens/detail";
import EditScreen from "./src/screens/edit";
//import Profile from "./screens/profile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          //options={{ title: "OUTGO" }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          //options={{ title: "Tambah Pengeluaran" }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="detail"
          component={DetailScreen}
          //options={{ title: "Detail Pengeluaran" }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="edit"
          component={EditScreen}
          //options={{ title: "Ubah Pengeluaran" }}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

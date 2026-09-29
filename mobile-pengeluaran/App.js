import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import file screen yang sudah ada di folder src/screens/
import HomeScreen from "./src/screens/home";
import AddScreen from "./src/screens/add";
import DetailScreen from "./src/screens/detail";
import EditScreen from "./src/screens/edit";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "OUTGO" }}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ title: "Tambah Pengeluaran" }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: "Detail Pengeluaran" }}
        />
        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{ title: "Ubah Pengeluaran" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

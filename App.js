import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar as RNStatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import OpeningScreen from "./screens/OpeningScreen";
import LoginScreen from "./screens/LoginScreen";
import RegistryScreen from "./screens/RegistryScreen";
import MainTabs from "./components/layout/MainTabs";

import "./global.css";
import AppNavigator from "./components/layout/AppNavigator";

const Stack = createStackNavigator();

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <RNStatusBar backgroundColor="#14213D" barStyle="light-content" translucent={false} />
            <SafeAreaProvider>
                <StatusBar style="light" backgroundColor="#14213D" />
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Opening">
                        <Stack.Screen name="Opening" component={OpeningScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Registry" component={RegistryScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Home" component={AppNavigator} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
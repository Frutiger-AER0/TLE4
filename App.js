// App.js

import "react-native-gesture-handler";
import React from "react";
import { StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import OpeningScreen from "./screens/OpeningScreen";
import LoginScreen from "./screens/LoginScreen";
import RegistryScreen from "./screens/RegistryScreen";
import AppNavigator from "./components/layout/AppNavigator";

import "./global.css";

const Stack = createStackNavigator();

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <RNStatusBar backgroundColor="#14213D" barStyle="light-content" />
                <StatusBar style="light" backgroundColor="#14213D" />

                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Opening"
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        <Stack.Screen
                            name="Opening"
                            component={OpeningScreen}
                        />

                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        />

                        <Stack.Screen
                            name="Registry"
                            component={RegistryScreen}
                        />

                        <Stack.Screen
                            name="Home"
                            component={AppNavigator}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import AppHeader from "./AppHeader";
import HomeScreen from "../../screens/HomeScreen";
import MapScreen from "../../screens/MapScreen";
import ActionScreen from "../../screens/ActionScreen";
import DonationScreen from "../../screens/DonationScreen";
import AdminScreen from "../../screens/AdminScreen";

const Tab = createBottomTabNavigator();
const ActionStack = createStackNavigator();

function ActionStackScreen() {
    return (
        <ActionStack.Navigator screenOptions={{ headerShown: false }}>
            <ActionStack.Screen name="ActionScreen" component={ActionScreen} />
            <ActionStack.Screen name="DonationScreen" component={DonationScreen} />
        </ActionStack.Navigator>
    );
}

export default function MainTabs({ route }) {
    const isAdmin = route?.params?.isAdmin === true;

    return (
        <View className="flex-1 bg-offWhite">
            <AppHeader />
            <View className="flex-1">
                <Tab.Navigator
                    initialRouteName="search"
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarActiveTintColor: "#F4C430",
                        tabBarInactiveTintColor: "#F8F9FA",
                        tabBarStyle: {
                            backgroundColor: "#14213D",
                            height: 90,
                            paddingTop: 14,
                            paddingBottom: 8,
                        },
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === "search") {
                                iconName = focused ? "search" : "search-outline";
                            } else if (route.name === "map") {
                                iconName = focused ? "map" : "map-outline";
                            } else if (route.name === "calendar") {
                                iconName = focused ? "calendar" : "calendar-outline";
                            } else if (route.name === "person") {
                                iconName = focused ? "person" : "person-outline";
                            } else if (route.name === "admin") {
                                iconName = focused ? "shield-checkmark" : "shield-checkmark-outline";
                            }

                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                    })}
                >
                    <Tab.Screen
                        name="search"
                        component={ActionStackScreen}
                        options={{ title: "Home" }}
                    />
                    <Tab.Screen
                        name="map"
                        component={MapScreen}
                        options={{ title: "Kaart" }}
                    />
                    <Tab.Screen
                        name="calendar"
                        component={HomeScreen}
                        options={{ title: "Agenda" }}
                    />
                    <Tab.Screen
                        name="person"
                        component={HomeScreen}
                        options={{ title: "Profiel" }}
                    />
                    {isAdmin && (
                        <Tab.Screen
                            name="admin"
                            component={AdminScreen}
                            options={{ title: "Admin" }}
                        />
                    )}
                </Tab.Navigator>
            </View>
        </View>
    );
}
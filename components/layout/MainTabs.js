import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import AppHeader from "./AppHeader";
import HomeStack from "./HomeStack";
import MapScreen from "../../screens/MapScreen";
import HomeScreen from "../../screens/HomeScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
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
                            }

                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                    })}
                >
                    <Tab.Screen
                        name="search"
                        component={HomeStack}
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
                </Tab.Navigator>
            </View>
        </View>
    );
}

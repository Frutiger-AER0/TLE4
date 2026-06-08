// components/layout/AppNavigator.js

import React from "react";
import { View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import Ontdek from "../../Home";
import ActionScreen from "../../screens/ActionScreen";
import HomeScreen from "../../screens/HomeScreen";
import DetailScreen from "../../screens/DetailScreen";
import DonationScreen from "../../screens/DonationScreen";
import AgendaScreen from "../../screens/AgendaScreen";

const Tab = createBottomTabNavigator();
const ActionStack = createStackNavigator();
const AgendaStack = createStackNavigator();

function ActionStackScreen() {
    return (
        <ActionStack.Navigator
            initialRouteName="ActionScreen"
            screenOptions={{
                headerShown: false,
            }}
        >
            <ActionStack.Screen
                name="ActionScreen"
                component={ActionScreen}
            />

            <ActionStack.Screen
                name="HomeScreen"
                component={HomeScreen}
            />

            <ActionStack.Screen
                name="Detail"
                component={DetailScreen}
            />

            <ActionStack.Screen
                name="DonationScreen"
                component={DonationScreen}
            />
        </ActionStack.Navigator>
    );
}

function AgendaStackScreen() {
    return (
        <AgendaStack.Navigator
            initialRouteName="AgendaScreen"
            screenOptions={{
                headerShown: false,
            }}
        >
            <AgendaStack.Screen
                name="AgendaScreen"
                component={AgendaScreen}
            />

            <AgendaStack.Screen
                name="AgendaDetail"
                component={DetailScreen}
            />
        </AgendaStack.Navigator>
    );
}

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#F8F9FA",
    },
};

export default function AppNavigator() {
    return (
        <View className="flex-1">
            <NavigationContainer theme={MyTheme}>
                <Tab.Navigator
                    initialRouteName="search"
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarActiveTintColor: "#F8F9FA",
                        tabBarInactiveTintColor: "#F8F9FA",
                        tabBarStyle: {
                            position: "absolute",
                            left: 16,
                            right: 16,
                            bottom: 18,
                            backgroundColor: "#14213D",
                            height: 78,
                            borderRadius: 16,
                            paddingTop: 10,
                            paddingBottom: 8,
                            borderTopWidth: 0,
                        },
                        tabBarLabelStyle: {
                            fontSize: 10,
                            marginTop: 2,
                        },
                        tabBarItemStyle: {
                            borderRadius: 16,
                            marginHorizontal: 6,
                        },
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName = "ellipse-outline";

                            if (route.name === "search") {
                                iconName = focused ? "search" : "search-outline";
                            } else if (route.name === "map") {
                                iconName = focused ? "map" : "map-outline";
                            } else if (route.name === "calendar") {
                                iconName = focused ? "calendar" : "calendar-outline";
                            } else if (route.name === "person") {
                                iconName = focused ? "person" : "person-outline";
                            }

                            return (
                                <View
                                    style={{
                                        backgroundColor: focused ? "#0D4899" : "transparent",
                                        width: 70,
                                        height: 58,
                                        borderRadius: 16,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ionicons
                                        name={iconName}
                                        size={focused ? 30 : size}
                                        color={color}
                                    />
                                </View>
                            );
                        },
                    })}
                >
                    <Tab.Screen
                        name="search"
                        component={ActionStackScreen}
                        options={{ title: "Ontdek" }}
                    />

                    <Tab.Screen
                        name="map"
                        component={Ontdek}
                        options={{ title: "Kaart" }}
                    />

                    <Tab.Screen
                        name="calendar"
                        component={AgendaStackScreen}
                        options={{ title: "Agenda" }}
                    />

                    <Tab.Screen
                        name="person"
                        component={Ontdek}
                        options={{ title: "Profiel" }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
}
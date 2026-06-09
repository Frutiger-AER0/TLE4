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

const Tab = createBottomTabNavigator();
const ActionStack = createStackNavigator();

function ActionStackScreen() {
    return (
        <ActionStack.Navigator
            initialRouteName="ActionScreen"
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* Hoofdpagina met projecten */}
            <ActionStack.Screen
                name="ActionScreen"
                component={ActionScreen}
            />

            {/* Jouw demonstratie-overzichtspagina */}
            <ActionStack.Screen
                name="HomeScreen"
                component={HomeScreen}
            />

            {/* Detailpagina van een demonstratie */}
            <ActionStack.Screen
                name="Detail"
                component={DetailScreen}
            />

            {/* Bestaande donatiepagina */}
            <ActionStack.Screen
                name="DonationScreen"
                component={DonationScreen}
            />
        </ActionStack.Navigator>
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
                        tabBarActiveTintColor: "#F4C430",
                        tabBarInactiveTintColor: "#F8F9FA",
                        tabBarStyle: {
                            backgroundColor: "#14213D",
                            height: 90,
                            paddingTop: 14,
                            paddingBottom: 8,
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
                                <Ionicons
                                    name={iconName}
                                    size={size}
                                    color={color}
                                />
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
                        component={Ontdek}
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
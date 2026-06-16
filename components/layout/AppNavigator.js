// components/layout/AppNavigator.js

import React, {useContext} from "react";
import {View, ActivityIndicator} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {Ionicons} from "@expo/vector-icons";

import ActionScreen from "../../screens/ActionScreen";
import DonationScreen from "../../screens/DonationScreen";
import HomeScreen from "../../screens/HomeScreen";
import MapScreen from "../../screens/MapScreen";
import AdminScreen from "../../screens/AdminScreen";
import AppHeader from "./AppHeader";
import DetailScreen from "../../screens/DetailScreen";
import AgendaScreen from "../../screens/AgendaScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import {AuthContext} from "../../context/AuthContext";

const Tab = createBottomTabNavigator();
const ActionStack = createStackNavigator();
const AgendaStack = createStackNavigator();

function ActionStackScreen() {
    return (
        <ActionStack.Navigator
            initialRouteName="ActionScreen"
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: "#F8F9FA",
                },
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
                cardStyle: {
                    backgroundColor: "#F8F9FA",
                },
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

export default function AppNavigator({route}) {
    const {user, isLoading} = useContext(AuthContext);

    /*
        Admin kan later via user.role of route param.
        Voor nu blijft route param mogelijk.
    */
    const isAdmin =
        route?.params?.isAdmin === true ||
        user?.isAdmin === true ||
        user?.role === "admin";

    if (isLoading) {
        return (
            <View className="flex-1 bg-offWhite items-center justify-center">
                <ActivityIndicator size="large" color="#14213D"/>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-offWhite">
            <Tab.Navigator
                initialRouteName="search"
                screenOptions={({route}) => ({
                    headerShown: true,
                    header: () => <AppHeader/>,
                    headerStyle: {
                        backgroundColor: "#14213D",
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    sceneContainerStyle: {
                        backgroundColor: "#F8F9FA",
                    },
                    tabBarActiveTintColor: "#F4C430",
                    tabBarInactiveTintColor: "#F8F9FA",
                    tabBarStyle: {
                        backgroundColor: "#14213D",
                        height: 90,
                        paddingTop: 14,
                        paddingBottom: 8,
                        borderTopWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                    },
                    tabBarAccessibilityLabel: (() => {
                        if (route.name === "search") return "Ontdek acties en protesten";
                        if (route.name === "calendar") return "Agenda met geplande evenementen";
                        if (route.name === "person") return "Jouw persoonlijke profiel";
                        if (route.name === "admin") return "Admin dashboard voor organisatoren";
                        return undefined;
                    })(),
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName = "ellipse-outline";

                        if (route.name === "search") {
                            iconName = focused ? "search" : "search-outline";
                        } else if (route.name === "calendar") {
                            iconName = focused ? "calendar" : "calendar-outline";
                        } else if (route.name === "person") {
                            iconName = focused ? "person" : "person-outline";
                        } else if (route.name === "admin") {
                            iconName = focused
                                ? "shield-checkmark"
                                : "shield-checkmark-outline";
                        }

                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                                accessible={false}
                            />
                        );
                    },
                })}
            >
                <Tab.Screen
                    name="search"
                    component={ActionStackScreen}
                    options={{title: "Ontdek"}}
                />

                <Tab.Screen
                    name="calendar"
                    component={AgendaStackScreen}
                    options={{title: "Agenda"}}
                />

                <Tab.Screen
                    name="person"
                    component={ProfileScreen}
                    options={{title: "Profiel"}}
                />

                {isAdmin && (
                    <Tab.Screen
                        name="admin"
                        component={AdminScreen}
                        options={{title: "Admin"}}
                    />
                )}
            </Tab.Navigator>
        </View>
    );
}
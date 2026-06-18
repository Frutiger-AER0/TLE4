// components/layout/AppNavigator.js

import React, { useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import ActionScreen from "../../screens/ActionScreen";
import DonationScreen from "../../screens/DonationScreen";
import HomeScreen from "../../screens/HomeScreen";
import MapScreen from "../../screens/MapScreen";
import AdminScreen from "../../screens/AdminScreen";
import AppHeader from "./AppHeader";
import DetailScreen from "../../screens/DetailScreen";
import AgendaScreen from "../../screens/AgendaScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { AuthContext } from "../../context/AuthContext";

const Tab = createBottomTabNavigator();
const ActionStack = createStackNavigator();
const AgendaStack = createStackNavigator();

function getTabIconName(routeName, focused) {
    if (routeName === "search") {
        return focused ? "search" : "search-outline";
    }

    if (routeName === "calendar") {
        return focused ? "calendar" : "calendar-outline";
    }

    if (routeName === "person") {
        return focused ? "person" : "person-outline";
    }

    if (routeName === "admin") {
        return focused ? "shield-checkmark" : "shield-checkmark-outline";
    }

    return "ellipse-outline";
}

function getTabAccessibilityLabel(routeName) {
    if (routeName === "search") {
        return "Ontdek acties en protesten";
    }

    if (routeName === "calendar") {
        return "Agenda met geplande evenementen";
    }

    if (routeName === "person") {
        return "Jouw persoonlijke profiel";
    }

    if (routeName === "admin") {
        return "Admin dashboard voor organisatoren";
    }

    return undefined;
}

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

            <ActionStack.Screen
                name="map"
                component={MapScreen}
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

            <AgendaStack.Screen
                name="map"
                component={MapScreen}
            />
        </AgendaStack.Navigator>
    );
}

export default function AppNavigator({ route }) {
    const { user, isLoading } = useContext(AuthContext);

    const isAdmin =
        route?.params?.isAdmin === true ||
        user?.isAdmin === true ||
        user?.is_admin === true ||
        user?.is_admin === 1 ||
        user?.role === "admin";

    if (isLoading) {
        return (
            <View
                className="flex-1 bg-offWhite items-center justify-center"
                accessible={true}
                accessibilityRole="progressbar"
                accessibilityLabel="De app wordt geladen"
            >
                <ActivityIndicator
                    size="large"
                    color="#14213D"
                    accessible={false}
                    importantForAccessibility="no"
                />

                <Text className="text-darkBlue mt-3 font-semibold">
                    App laden...
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-offWhite">
            <Tab.Navigator
                initialRouteName="search"
                screenOptions={({ route }) => ({
                    headerShown: true,
                    header: () => <AppHeader />,
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
                    tabBarAccessibilityLabel: getTabAccessibilityLabel(route.name),
                    tabBarHideOnKeyboard: true,
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
                    tabBarIcon: ({ focused, color, size }) => {
                        const iconName = getTabIconName(route.name, focused);

                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                                accessible={false}
                                importantForAccessibility="no"
                            />
                        );
                    },
                })}
            >
                <Tab.Screen
                    name="search"
                    component={ActionStackScreen}
                    options={{
                        title: "Ontdek",
                    }}
                />

                <Tab.Screen
                    name="calendar"
                    component={AgendaStackScreen}
                    options={{
                        title: "Agenda",
                    }}
                />

                <Tab.Screen
                    name="person"
                    options={{
                        title: "Profiel",
                    }}
                >
                    {(props) => (
                        <ProfileScreen
                            {...props}
                            userId={user?.id || user?.user_id || user?.user?.id}
                        />
                    )}
                </Tab.Screen>

                {isAdmin && (
                    <Tab.Screen
                        name="admin"
                        component={AdminScreen}
                        options={{
                            title: "Admin",
                        }}
                    />
                )}
            </Tab.Navigator>
        </View>
    );
}
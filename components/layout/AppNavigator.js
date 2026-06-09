import React from 'react';
import {View} from 'react-native';
import {DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack'; // Import createStackNavigator
import {Ionicons} from '@expo/vector-icons';

import ActionScreen from "../../screens/ActionScreen";
import HomeScreen from "../../screens/HomeScreen";
import MapScreen from "../../screens/MapScreen";
import AdminScreen from "../../screens/AdminScreen";
import AppHeader from "./AppHeader";
import HomeStack from "./HomeStack";
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
                cardStyle: {
                    backgroundColor: "#F8F9FA",
                },
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

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#F8F9FA",
    },
};

export default function AppNavigator({route}) {
    const isAdmin = route?.params?.isAdmin === true;

    return (
        <View className="flex-1">
            <Tab.Navigator
                theme={MyTheme}
                initialRouteName="search"
                screenOptions={({route}) => ({
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
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        marginTop: 2,
                    },
                    tabBarItemStyle: {
                        borderRadius: 16,
                        marginHorizontal: 6,
                    },
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;

                        if (route.name === 'search') {
                            iconName = focused ? 'search' : 'search-outline';
                        } else if (route.name === 'map') {
                            iconName = focused ? 'map' : 'map-outline';
                        } else if (route.name === 'calendar') {
                            iconName = focused ? 'calendar' : 'calendar-outline';
                        } else if (route.name === 'person') {
                            iconName = focused ? 'person' : 'person-outline';
                        } else if (route.name === "admin") {
                            iconName = focused ? "shield-checkmark" : "shield-checkmark-outline";
                        }

                        return <Ionicons name={iconName} size={size} color={color}/>;
                    },
                })}
            >
                {/*Bij component moeten de pagina's worden gezet*/}
                <Tab.Screen
                    name="search"
                    component={ActionStackScreen} // Use the Stack Navigator here
                    options={{title: 'Ontdek'}}
                />
                <Tab.Screen
                    name="map"
                    component={MapScreen}
                    options={{title: 'Kaart'}}
                />
                <Tab.Screen
                    name="calendar"
                    component={AgendaStackScreen}
                    options={{title: 'Agenda'}}
                />
                <Tab.Screen
                    name="person"
                    component={HomeStack}
                    options={{title: 'Profiel'}}
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
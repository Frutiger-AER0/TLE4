import React, { useContext } from 'react'; // Import useContext
import {View, ActivityIndicator} from 'react-native'; // Import ActivityIndicator
import {DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';

import ActionScreen from "../../screens/ActionScreen";
import DonationScreen from "../../screens/DonationScreen";
import HomeScreen from "../../screens/HomeScreen";
import MapScreen from "../../screens/MapScreen";
import AdminScreen from "../../screens/AdminScreen";
import AppHeader from "./AppHeader";
import DetailScreen from "../../screens/DetailScreen";
import AgendaScreen from "../../screens/AgendaScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

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

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F8F9FA',
    },
};

export default function AppNavigator({route}) {
    const { user, isLoading } = useContext(AuthContext); // Get user and isLoading from AuthContext
    const isAdmin = route?.params?.isAdmin === true; // Keep isAdmin from route params if needed

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <Tab.Navigator
                theme={MyTheme}
                initialRouteName="search"
                screenOptions={({route}) => ({
                    headerShown: true,
                    header: () => <AppHeader/>,
                    headerStyle: {
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    tabBarActiveTintColor: '#F4C430',
                    tabBarInactiveTintColor: '#F8F9FA',
                    tabBarStyle: {
                        backgroundColor: '#14213D',
                        height: 90,
                        paddingTop: 14,
                        paddingBottom: 8,
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
                <Tab.Screen
                    name="search"
                    component={ActionStackScreen}
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
                    options={{title: 'Profiel'}}
                >
                    {(props) => (
                        <ProfileScreen
                            {...props}
                            userId={user?.id} // Pass the logged-in user's ID from AuthContext
                        />
                    )}
                </Tab.Screen>
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
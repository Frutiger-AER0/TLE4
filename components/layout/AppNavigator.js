import React from 'react';
import {View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack'; // Import createStackNavigator
import {Ionicons} from '@expo/vector-icons';
import ActionScreen from "../../screens/ActionScreen";
import DonationScreen from "../../screens/DonationScreen"; // Import DonationScreen
import { DefaultTheme } from "@react-navigation/native";

import HomeScreen from "../../screens/HomeScreen";
import MapScreen from "../../screens/MapScreen";

const Tab = createBottomTabNavigator();
const ActionStack = createStackNavigator(); // Create a Stack Navigator for the Action flow

function ActionStackScreen() {
    return (
        <ActionStack.Navigator screenOptions={{headerShown: false}}>
            <ActionStack.Screen name="ActionScreen" component={ActionScreen}/>
            <ActionStack.Screen name="DonationScreen" component={DonationScreen}/>
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
                    screenOptions={({route}) => ({
                        headerShown: false,
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
                        component={HomeScreen}
                        options={{title: 'Agenda'}}
                    />
                    <Tab.Screen
                        name="person"
                        component={HomeScreen}
                        options={{title: 'Profiel'}}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
}
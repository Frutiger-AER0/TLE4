import React from 'react';
import {View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import Ontdek from "../../Home";
import ActionScreen from "../../screens/ActionScreen";

const Tab = createBottomTabNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F8F9FA',
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
                        component={ActionScreen}
                        options={{title: 'Ontdek'}}
                    />
                    <Tab.Screen
                        name="map"
                        component={Ontdek}
                        options={{title: 'Kaart'}}
                    />
                    <Tab.Screen
                        name="calendar"
                        component={Ontdek}
                        options={{title: 'Agenda'}}
                    />
                    <Tab.Screen
                        name="person"
                        component={Ontdek}
                        options={{title: 'Profiel'}}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
}
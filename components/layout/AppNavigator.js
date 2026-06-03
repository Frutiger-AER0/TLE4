import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import Ontdek from "../../Home";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <View style={styles.container}>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="search"
                    screenOptions={({route}) => ({
                        headerShown: false,
                        tabBarActiveTintColor: '#F8F9FA',
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
                    {/*Verander de component naam naar de pagina waar je heen wilt*/}
                    <Tab.Screen
                        name="search"
                        component={Ontdek}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
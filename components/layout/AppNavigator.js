import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {backgroundColor: '#6200ee'},
                    headerTintColor: '#fff',
                    headerTitleStyle: {fontWeight: 'bold'},
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{title: 'Home'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DonationScreen from "./screens/DonationScreen";
import "./global.css";
import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './components/layout/AppNavigator';
import AppHeader from "./components/layout/AppHeader";

import "./global.css"

export default function App() {
    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <StatusBar style="light" backgroundColor="#14213D"/>
                <AppHeader/>
                <View style={styles.content}>
                    <AppNavigator/>
                </View>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});
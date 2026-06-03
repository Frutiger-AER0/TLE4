import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './components/layout/AppNavigator';
import AppHeader from "./components/layout/AppHeader";

import "./global.css"

export default function App() {
    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-darkBlue">
                <StatusBar style="light" backgroundColor="#14213D"/>
                <AppHeader/>
                <View className="flex-1">
                    <AppNavigator/>
                </View>
            </View>
        </SafeAreaProvider>
    );
}
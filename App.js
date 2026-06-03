import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppNavigator from './components/layout/AppNavigator';
import AppHeader from "./components/layout/AppHeader";

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor="#14213D"/>
            {/*<AppNavigator/>*/}
            <AppHeader/>
            <View style={styles.content}>
                <Text>Open up App.js to start working on your app!</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

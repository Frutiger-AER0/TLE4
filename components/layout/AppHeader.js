import React from 'react';
import {StyleSheet, Text, View, StatusBar, Dimensions, Image} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

const {width} = Dimensions.get('window');

export default function AppHeader() {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor="#14213D"/>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.headerContainer}>
                    {/*<Image></Image>*/}
                    <Text style={styles.headerTitle}>SupporT</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#14213D",
        width: width,
        alignSelf: 'center',
    },
    headerContainer: {
        backgroundColor: "#14213D",
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
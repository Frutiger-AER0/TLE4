import React from 'react';
import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

const {width} = Dimensions.get('window');

export default function AppHeader() {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.headerContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.headerLogo}
                />
                <Text style={styles.headerTitle}>SupporT</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#14213D",
        width: width,
    },
    headerContainer: {
        backgroundColor: "#14213D",
        height: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'left',
        paddingStart: 20,
        alignItems: 'center',
        gap: 10,
    },
    headerLogo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
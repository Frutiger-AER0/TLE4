import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
// a fallback UI for browsers.

export default function MapScreen() {
    return (
        <View style={[styles.container, { backgroundColor: '#ffffff' }]}>
            <Text style={{ color: '#000000', marginBottom: 8 }}>
                Kaartweergave is niet beschikbaar in de webversie.
            </Text>
            <Text style={{ color: '#666666' }}>
                Open de app op een iOS of Android-apparaat om de kaart te bekijken.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
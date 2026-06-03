import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function HomeScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <Text>Dit is de Ontdek page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

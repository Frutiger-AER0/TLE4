import React from 'react';
import {Text, View, Image} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

export default function AppHeader() {
    return (
        <SafeAreaView className="bg-darkBlue w-full" edges={['top']}>
            <View className="bg-darkBlue h-20 w-full flex-row justify-start pl-5 items-center gap-2.5">
                <Image
                    source={require('../../assets/logo.png')}
                    className="w-9 h-9"
                    resizeMode="contain"
                />
                <Text className="text-white text-2xl font-bold">
                    SupporT
                </Text>
            </View>
        </SafeAreaView>
    );
}
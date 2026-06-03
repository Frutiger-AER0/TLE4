import {Text, View} from "react-native";
import React from "react";

export default function OpeningScreen({ navigation }) {
    return (
        <View className="flex-1 items-center justify-center px-6 bg-white">
            {/*header*/}
            <Text className="text-3xl font-bold mb-8">Welkom bij SupporT!</Text>
        </View>
    );
}
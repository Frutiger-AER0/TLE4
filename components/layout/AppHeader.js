// components/layout/AppHeader.js

import React from "react";
import { View, Text, Image } from "react-native";

export default function AppHeader() {
    return (
        <View className="w-full bg-darkBlue">
            <View className="h-20 flex-row items-center px-4 gap-3">
                <Image
                    source={require("../../assets/logo.png")}
                    style={{
                        width: 42,
                        height: 42,
                    }}
                    resizeMode="contain"
                />

                <Text className="text-white text-2xl font-bold">
                    SupporT
                </Text>
            </View>
        </View>
    );
}
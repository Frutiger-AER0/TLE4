// components/layout/AppHeader.js

import React from "react";
import { View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="w-full bg-darkBlue"
            style={{
                paddingTop: insets.top,
                backgroundColor: "#14213D",
            }}
        >
            <View
                className="bg-darkBlue w-full flex-row justify-start pl-5 items-center gap-2.5"
                style={{
                    height: 72,
                    backgroundColor: "#14213D",
                }}
            >
                <Image
                    source={require("../../assets/logo.png")}
                    style={{
                        width: 36,
                        height: 36,
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
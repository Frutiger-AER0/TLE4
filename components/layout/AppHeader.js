import React from "react";
import {View, Text, Image} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function AppHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="w-full bg-darkBlue"
            style={{
                paddingTop: insets.top
            }}
        >
            <View className="bg-darkBlue h-20 w-full flex-row justify-start pl-5 items-center gap-2.5">
                <Image
                    source={require("../../assets/logo.png")}
                    className="w-9 h-9"
                    resizeMode="contain"
                />

                <Text className="text-white text-2xl font-bold">
                    SupporT
                </Text>
            </View>
        </View>
    );
}
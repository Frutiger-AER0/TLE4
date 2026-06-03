import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppHeader() {
    const insets = useSafeAreaInsets();
    const headerHeight = 56;
    const totalHeight = headerHeight + insets.top;

    return (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, elevation: 6 }}>
            <SafeAreaView edges={["top"]} className="w-full bg-darkBlue" style={{ height: totalHeight }}>
                <View className="w-full h-14 flex-row items-center pl-4 gap-2">
                    <Image source={require("../../assets/logo.png")} className="w-9 h-9" resizeMode="contain" />
                    <Text className="text-white text-2xl font-bold">SupporT</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}
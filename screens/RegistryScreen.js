import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import RegistryForm from "../components/RegistryForm";

export default function RegistryScreen({ navigation }) {
    return (
        <SafeAreaView className="flex-1 bg-offWhite">
            <View className="flex-1 items-center justify-center pt-6">
                {/*header*/}
                <RegistryForm onSuccess={() => navigation.navigate("Login")} />
            </View>
        </SafeAreaView>
    );
}
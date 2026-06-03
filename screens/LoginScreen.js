import React from "react";
import { View } from "react-native";
import AppHeader from "../components/layout/AppHeader";
import LoginForm from "../components/LoginForm";
import {SafeAreaView} from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {
    return (
        <SafeAreaView className="flex-1 bg-offWhite">
            <AppHeader/>
            <View className="flex-1 items-center justify-center pt-6">
                <LoginForm onSuccess={() => navigation.navigate("Home")} />
            </View>
        </SafeAreaView>
    );
}
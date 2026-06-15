import React from "react";
import {View} from "react-native";
import AppHeader from "../components/layout/AppHeader";
import LoginForm from "../components/forms/LoginForm";

export default function LoginScreen({navigation}) {
    return (
        <View className="flex-1 bg-offWhite">
            <AppHeader/>
            <View className="flex-1 items-center justify-center pt-6">
                <LoginForm onSuccess={(token, data) => {
                    const isAdmin = data?.is_admin === 1 || data?.is_admin === true || data?.user?.is_admin === 1 || data?.user?.is_admin === true || data?.data?.is_admin === 1 || data?.data?.is_admin === true;
                    navigation.navigate("Home", {isAdmin, token, userData: data});
                }}/>
            </View>
        </View>
    );
}
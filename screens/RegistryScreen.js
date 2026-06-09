import {View} from "react-native";
import React from "react";
import RegistryForm from "../components/forms/RegistryForm";
import AppHeader from "../components/layout/AppHeader";

export default function RegistryScreen({navigation}) {
    return (
        <View className="flex-1 bg-offWhite">
            <AppHeader/>
            <View className="flex-1 items-center justify-center pt-6">
                <RegistryForm onSuccess={() => navigation.navigate("Login")}/>
            </View>
        </View>
    );
}
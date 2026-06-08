import React from "react";
import { View } from "react-native";
import ProtestForm from "../components/forms/ProtestForm";
import AppHeader from "../components/layout/AppHeader";

export default function AdminScreen() {
    return (
        <View className="flex-1 bg-offWhite">
            <AppHeader />
            <ProtestForm />
        </View>
    );
}
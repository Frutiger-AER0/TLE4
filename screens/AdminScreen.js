import React from "react";
import { View } from "react-native";
import ProtestForm from "../components/forms/ProtestForm";

export default function AdminScreen() {
    return (
        <View className="flex-1 bg-offWhite">
            <ProtestForm />
        </View>
    );
}
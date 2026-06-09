import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import RegistryForm from "../components/forms/RegistryForm";
import AppHeader from "../components/layout/AppHeader";

export default function RegistryScreen({navigation}) {
    return (
        <View className="flex-1 bg-offWhite">
            <AppHeader/>
            <View className="flex-1 items-center justify-center pt-6 px-6">

                <RegistryForm onSuccess={() => navigation.navigate("Login")}/>

                <TouchableOpacity
                    className="mt-6 py-2"
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text className="text-darkBlue text-base font-medium text-center">
                        Heb je al een account? <Text className="text-purple font-bold underline">Log in</Text>
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
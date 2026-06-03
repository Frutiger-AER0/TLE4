import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import AppHeader from "../components/layout/AppHeader";

export default function OpeningScreen({navigation}) {
    return (
        <View className="flex-1 items-center justify-center px-6 bg-offWhite">
            <AppHeader/>
            <Text className="text-3xl font-bold mb-8 text-darkBlue">Welkom bij SupporT!</Text>

            <TouchableOpacity className="w-full max-w-md bg-blue py-3 rounded-lg items-center mb-4"
                              onPress={() => navigation.navigate("Login")}
                              accessibilityLabel="Ga naar Loginpagina">
                <Text className="text-offWhite text-lg font-semibold">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-full max-w-md bg-purple py-3 rounded-lg items-center"
                              onPress={() => navigation.navigate("Registry")}
                              accessibilityLabel="Ga naar Registratiepagina">
                <Text className="text-offWhite text-lg font-semibold">Registreer</Text>
            </TouchableOpacity>
        </View>
    );
};
// screens/DonationScreen.js

import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import DonationForm from "../components/forms/DonationForm";

export default function DonationScreen() {
    const navigation = useNavigation();

    function goBack() {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }

        navigation.navigate("ActionScreen");
    }

    return (
        <View className="flex-1 bg-offWhite">
            <TouchableOpacity
                onPress={goBack}
                activeOpacity={0.8}
                className="flex-row items-center px-5 pt-5 pb-3"
            >
                <Ionicons name="arrow-back" size={30} color="#14213D" />

                <Text className="text-darkBlue text-2xl font-bold ml-3">
                    Terug
                </Text>
            </TouchableOpacity>

            <ScrollView
                className="flex-1 bg-offWhite"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 120,
                }}
            >
                <View
                    style={{
                        width: "100%",
                        maxWidth: 430,
                    }}
                >
                    <DonationForm />
                </View>
            </ScrollView>
        </View>
    );
}
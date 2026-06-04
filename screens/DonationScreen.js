import React from "react";
import {Text, View, TouchableOpacity} from "react-native";
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import DonationForm from "../components/forms/DonationForm";

export default function DonationScreen() {
    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-offWhite">
            {/* Header with back button and title */}
            <View className="pt-10 pb-4 px-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-200"
                >
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-darkBlue ml-4">Terug</Text>
            </View>

            {/* Form */}
            <View className="flex-1 justify-center items-center">
                <DonationForm/>
            </View>
        </View>
    );
}
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { saveUserProject } from "../services/ProtestApi";

// Functie om het protest op te slaan in de in-app agenda
async function handleAddToAgenda(protest) {
    if (!protest?.protestProjectId) {
        Alert.alert("Fout", "Kan dit project niet toevoegen, project ID ontbreekt.");
        return;
    }

    try {
        const MOCK_USER_ID = 1;
        await saveUserProject(protest.protestProjectId, MOCK_USER_ID);
        Alert.alert("Opgeslagen", `${protest.title} is toegevoegd aan 'Mijn Agenda'.`);
    } catch (error) {
        console.error("Error saving to agenda:", error);
        Alert.alert("Fout", "Kon het protest niet toevoegen aan de agenda.");
    }
}

export default function EventDetailsCard({ protest }) {
    const navigation = useNavigation();
    if (!protest) return null;

    return (
        <View className="bg-lightPurple p-5 w-full">
            <View>
                <Text className="text-darkBlue text-2xl font-bold">
                    Waar demonstreren we?
                </Text>
            </View>

            <View className="flex-row justify-between mt-8">
                <View className="flex-1 bg-darkBlue rounded-2xl p-3 mr-2 justify-between">
                    <View>
                        <Ionicons name="calendar-outline" size={24} color="white" />
                        <Text className="text-white font-bold text-base mt-2">{protest.date || '1 januari 2025'}</Text>
                        <Text className="text-white text-sm mt-1 italic">Aanvang: {protest.timeStart || '12:00'}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleAddToAgenda(protest)}
                        className="mt-2 flex-row items-center"
                    >
                        <Text className="text-white text-sm underline font-semibold mr-1">
                            Agenda toevoegen
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 bg-darkBlue rounded-2xl p-3 ml-2 justify-between">
                    <View>
                        <Ionicons name="location-outline" size={24} color="white" />
                        <Text className="text-white font-bold text-base mt-2">{protest.location || 'Centraal Station'}</Text>
                        <Text className="text-white text-sm mt-1">{protest.city || 'Amsterdam'}</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("map", { item: protest })}
                        className="mt-2 flex-row items-center"
                    >
                        <Text className="text-white text-sm underline font-semibold mr-1">
                            Kaart bekijken
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="bg-darkBlue rounded-2xl p-3 mt-4">
                <View>
                    <Ionicons name="information-circle-outline" size={24} color="white" />
                    <Text className="text-white font-bold text-base mt-2">Details</Text>
                    <Text className="text-white text-sm mt-1">{protest.description || 'Dit is een algemene demonstratie om aandacht te vragen voor belangrijke maatschappelijke thema\'s. Iedereen is welkom om mee te doen en een statement te maken.'}</Text>
                    <Text className="text-white text-sm mt-1">Aantal designs: {protest.amountNeeded ?? '100'}</Text>
                </View>
            </View>
        </View>
    );
}

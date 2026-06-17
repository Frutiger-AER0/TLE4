import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { saveUserProject } from "../services/ProtestApi";

// Functie om de datum en tijd te formatteren
const formatDateTime = (isoString) => {
    // FIX: Als er geen datum/tijd uit de database komt, gebruik een standaard fallback.
    if (!isoString) {
        return { formattedDate: '15 Mei 2026', formattedTime: '18:30' };
    }
    
    const date = new Date(isoString);
    // Extra check voor ongeldige datum
    if (isNaN(date.getTime())) {
        return { formattedDate: '15 Mei 2026', formattedTime: '18:30' };
    }

    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    
    const formattedDate = date.toLocaleDateString('nl-NL', dateOptions);
    const formattedTime = date.toLocaleTimeString('nl-NL', timeOptions);
    
    return { formattedDate, formattedTime };
};

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

    const { formattedDate, formattedTime } = formatDateTime(protest.start_time || protest.startTimeRaw);

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
                        <Text className="text-white font-bold text-base mt-2">{formattedDate}</Text>
                        <Text className="text-white text-sm mt-1 italic">Aanvang: {formattedTime}</Text>
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
                        <Text className="text-white font-bold text-base mt-2">{protest.location}</Text>
                        <Text className="text-white text-sm mt-1">{protest.city || 'Stad onbekend'}</Text>
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
        </View>
    );
}

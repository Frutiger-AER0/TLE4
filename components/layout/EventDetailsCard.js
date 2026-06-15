import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Functie om de datum en tijd te formatteren
const formatDateTime = (isoString) => {
    if (!isoString) return { date: '', time: '' };
    const date = new Date(isoString);
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    
    const formattedDate = date.toLocaleDateString('nl-NL', dateOptions);
    const formattedTime = date.toLocaleTimeString('nl-NL', timeOptions);
    
    return { formattedDate, formattedTime };
};

export default function EventDetailsCard({ protest }) {
    const navigation = useNavigation();
    if (!protest) return null;

    const { formattedDate, formattedTime } = formatDateTime(protest.start_time);

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
                    <TouchableOpacity className="mt-2 flex-row items-center">
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
                        <Text className="text-white text-sm mt-1">{protest.city}</Text>
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

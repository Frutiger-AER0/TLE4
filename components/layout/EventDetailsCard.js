import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
// import MapScreen from "../../screens/MapScreen";
import {useNavigation} from "@react-navigation/native";

export default function EventDetailsCard({locationId = "rotterdam-schouwburgplein"}) {
    const navigation = useNavigation();
    return (
        <View className="p-5 w-full">
            {/* Bovenste gedeelte: Titel en nieuwe link */}
            <View>
                <Text className="text-darkBlue text-2xl font-bold">
                    Waarom demonstreren we?
                </Text>
                <TouchableOpacity className="mt-2 flex-row items-center">
                    <Text className="text-blue underline font-semibold text-base mr-1">
                        Informatie over de demonstratie
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#0047AB"/>
                </TouchableOpacity>
            </View>

            {/* Onderste gedeelte: 2 Rechthoeken naast elkaar (met meer ruimte bovenaan) */}
            <View className="flex-row justify-between mt-8">

                {/* Kaart 1: Tijd & Agenda */}
                <View className="flex-1 bg-darkBlue rounded-2xl p-3 mr-2 justify-between">
                    <View>
                        {/* Icoon staat nu boven de tekst */}
                        <Ionicons name="calendar-outline" size={24} color="white"/>
                        <Text className="text-white font-bold text-base mt-2">15 Mei 2026</Text>
                        <Text className="text-white text-sm mt-1 italic">Aanvang: 18:30</Text>
                        <Text className="text-white text-sm mt-1 italic">Start Mars: 19:00</Text>
                    </View>
                    <TouchableOpacity className="mt-2 flex-row items-center">
                        <Text className="text-white text-sm underline font-semibold mr-1">
                            Agenda toevoegen
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="white"/>
                    </TouchableOpacity>
                </View>

                {/* Kaart 2: Locatie & Kaart */}
                <View className="flex-1 bg-darkBlue rounded-2xl p-3 ml-2 justify-between">
                    <View>
                        {/* Icoon staat nu boven de tekst */}
                        <Ionicons name="location-outline" size={24} color="white"/>
                        <Text className="text-white font-bold text-base mt-2">Schouwburgplein</Text>
                        <Text className="text-white text-sm mt-1">Rotterdam</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("map", {id: locationId})}
                        className="mt-2 flex-row items-center"
                    ><Text className="text-white text-sm underline font-semibold mr-1">
                        Kaart bekijken
                    </Text>
                        <Ionicons name="arrow-forward" size={16} color="white"/>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

import React, { useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import EventDetailsCard from "../components/layout/EventDetailsCard";
import ActionCard from "../components/layout/ActionCard";
import SubmitForum from "../components/layout/SubmitForum";
import HelpFromHomeCard from "../components/layout/HelpFromHomeCard";

const { height } = Dimensions.get("window");

// Hardcoded data object for demonstration purposes
const protest = {
    id: 1,
    name: "Nakba 1948 - 2026",
    subtitle: "Mars & herdenking",
    description: "Samen herdenken en opkomen voor gerechtigheid.",
    location: "Schouwburgplein",
    city: "Rotterdam",
    predicted_members: "1.000+",
    card_img: require('../assets/Palestinedemostration.webp'),
    topic: "Palestina",
    start_time: "2026-05-15T18:30:00Z",
    link: "https://example.com/info",
    actionTitle: "Waarom demonstreren we?",
    actionDescription: "Demonstraties in Rotterdam rondom de Nakba (Arabisch voor 'de catastrofe') worden georganiseerd om de massale verdrijving en het verlies van het thuisland van honderdduizenden Palestijnen in 1948 te herdenken. Demonstranten komen in de stad bijeen om aandacht te vragen voor het aanhoudende historische leed, mensenrechten en het recht op terugkeer voor vluchtelingen. Daarnaast dient de protestbijeenkomst in Rotterdam als een platform om solidariteit te tonen met de huidige situatie van Palestijnen en om op te roepen tot vrede en rechtvaardigheid.",
};

export default function DetailScreen() {
    const navigation = useNavigation();
    const [isSaved, setIsSaved] = useState(false);

    return (
        <View className="flex-1 bg-offWhite">
            <ScrollView bounces={false}>
                {/* Afbeelding is iets kleiner gemaakt (gecropt) */}
                <View style={{ height: height * 0.35 }} className="w-full relative">
                    <Image
                        source={protest.card_img}
                        className="h-full w-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/30" />
                    
                    {/* Knoppenbalk is nu correct gepositioneerd */}
                    <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-blue px-4 py-2.5 rounded-full">
                            <Ionicons name="arrow-back" size={24} color="#F8F9FA" />
                        </TouchableOpacity>
                        <View className="flex-row">
                            <TouchableOpacity onPress={() => setIsSaved(!isSaved)} className="bg-blue px-4 py-2.5 rounded-full">
                                <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color="#F8F9FA" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Share')} className="bg-blue px-4 py-2.5 rounded-full ml-3">
                                <Ionicons name="share-social-outline" size={24} color="#F8F9FA" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="absolute bottom-4 left-4 right-4 flex-row justify-between items-end">
                        <View>
                            <Text className="text-offWhite text-2xl font-bold">{protest.name}</Text>
                            <Text className="text-offWhite text-lg italic mt-1">{protest.subtitle}</Text>
                        </View>
                        <View className="bg-yellow px-6 py-2 rounded-full">
                            <Text className="text-darkBlue font-bold">{protest.topic}</Text>
                        </View>
                    </View>
                </View>

                {/* Container voor de volgende secties */}
                <View className="bg-offWhite">
                    <HelpFromHomeCard protest={protest} />
                    <EventDetailsCard protest={protest} />
                </View>

                <ActionCard protest={protest} />
                <SubmitForum protest={protest} />
            </ScrollView>
        </View>
    );
}

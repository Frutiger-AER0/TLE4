import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import tw from "twrnc";

export default function DetailScreen({ route }) {
    const { protest } = route.params;

    return (
        <ScrollView style={tw`flex-1 bg-white`}>
            <Image source={protest.image} style={tw`w-full h-56`} resizeMode="cover" />
            <View style={tw`p-5`}>
                <Text style={tw`text-2xl font-bold text-[#0A1A3A]`}>{protest.title}</Text>
                <Text style={tw`italic text-gray-700 mt-1`}>{protest.subtitle}</Text>

                {/* Waarom */}
                <View style={tw`mt-4`}>
                    <Text style={tw`text-lg font-semibold`}>Waarom demonstreren we?</Text>
                    <TouchableOpacity style={tw`mt-2`}>
                        <Text style={tw`text-[#0057FF]`}>Informatie over de demonstratie →</Text>
                    </TouchableOpacity>
                </View>

                {/* Datum / Tijd */}
                <View style={tw`mt-4 bg-[#F8F8F8] p-4 rounded-lg`}>
                    <Text style={tw`font-semibold`}>{protest.date}</Text>
                    <Text style={tw`text-gray-700 mt-1`}>Aanvang: {protest.timeStart}</Text>
                </View>

                {/* Locatie */}
                <View style={tw`mt-4 bg-[#F8F8F8] p-4 rounded-lg`}>
                    <Text style={tw`font-semibold`}>{protest.location}</Text>
                    <TouchableOpacity style={tw`mt-2`}>
                        <Text style={tw`text-[#0057FF]`}>Kaart bekijken →</Text>
                    </TouchableOpacity>
                </View>

                {/* Call to action / Form */}
                <View style={tw`mt-6`}>
                    <Text style={tw`text-lg font-semibold`}>Kom in actie voor de Mars!</Text>
                    <Text style={tw`text-gray-700 mt-2`}>Een krachtig protest valt of staat met de boodschap. Wij zorgen voor de straat, zorg jij voor het beeld?</Text>

                    <View style={tw`mt-4`}>
                        <TextInput placeholder="Voeg toe" style={tw`border border-gray-300 rounded-lg p-3`} />
                        <View style={tw`flex-row items-center mt-3`}>
                            <TouchableOpacity style={tw`bg-[#0A1A3A] px-4 py-2 rounded-lg`}>
                                <Text style={tw`text-white`}>Verzenden</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Footer note */}
                <View style={tw`mt-6`}>
                    <Text style={tw`text-sm text-gray-500`}>DIRECT HIGH - IMPACT</Text>
                </View>
            </View>
        </ScrollView>
    );
}

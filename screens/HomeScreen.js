import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import PreviewModal from "../components/PreviewModal";

export default function HomeScreen() {
    const [search, setSearch] = useState("");
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedProtest, setSelectedProtest] = useState(null);

    const protests = [
        {
            id: 1,
            title: "Nakba 1948 - 2026",
            subtitle: "Mars & Herdenking",
            location: "Schouwburgplein",
            participants: "1.000+",
            type: "Spandoek",
            date: "15 Mei 2026",
            timeStart: "18:30",
            image: require("../assets/demo1.jpeg"),
            description: "Samen herdenken en opkomen voor gerechtigheid.",
            why: "Waarom demonstreren we? Informatie over de demonstratie.",
        },
        // meer items...
    ];

    function openPreview(item) {
        setSelectedProtest(item);
        setPreviewVisible(true);
    }

    function closePreview() {
        setPreviewVisible(false);
        setSelectedProtest(null);
    }

    return (
        <>
            <ScrollView style={tw`flex-1 bg-white`}>
                {/* Topbar */}
                <View style={tw`bg-[#0A1A3A] flex-row items-center px-5 py-5`}>
                    <Text style={tw`text-white text-xl font-bold`}>SupporT</Text>
                </View>

                {/* Search */}
                <View style={tw`px-5 mt-5 flex-row items-center`}>
                    <TextInput
                        placeholder="zoeken..."
                        value={search}
                        onChangeText={setSearch}
                        style={tw`flex-1 bg-[#E6D8F5] rounded-xl px-4 py-3 text-gray-700`}
                    />
                    <TouchableOpacity style={tw`ml-2 bg-[#0057FF] p-3 rounded-xl`}>
                        <Ionicons name="filter" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* List: alleen title + korte beschrijving + preview knop */}
                <View style={tw`px-5 mt-6 mb-10`}>
                    <Text style={tw`text-xl font-bold mb-3 text-[#0A1A3A]`}>Demonstraties</Text>
                    <FlatList
                        data={protests}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={tw`mb-5 bg-[#E6D8F5] rounded-xl overflow-hidden shadow-sm`}>
                                <Image source={item.image} style={tw`w-full h-44`} resizeMode="cover" />
                                <View style={tw`p-4`}>
                                    <Text style={tw`text-lg font-semibold text-[#0A1A3A]`}>{item.title}</Text>
                                    <Text numberOfLines={2} style={tw`text-gray-700 mt-1`}>{item.description}</Text>

                                    <View style={tw`flex-row mt-3 justify-end`}>
                                        <TouchableOpacity
                                            onPress={() => openPreview(item)}
                                            style={tw`bg-[#0057FF] px-4 py-2 rounded-lg`}
                                        >
                                            <Text style={tw`text-white font-semibold`}>Preview</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>

            <PreviewModal visible={previewVisible} onClose={closePreview} protest={selectedProtest} />
        </>
    );
}

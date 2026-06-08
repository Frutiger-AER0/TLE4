import React, { useEffect, useRef } from "react";
import { View, Text, Modal, Image, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function PreviewModal({ visible, onClose, protest }) {
    const navigation = useNavigation();
    const translateY = useRef(new Animated.Value(-height)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: -height,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!protest) return null;

    function goToDetail() {
        onClose();
        navigation.navigate("Detail", { protest });
    }

    function toggleBookmark() {
        // placeholder: voeg je bookmark‑logic toe (state, API, async storage)
        console.log("Bookmark toggled for", protest.id);
    }

    return (
        <Modal visible={visible} transparent animationType="none">
            {/* semi-transparante overlay */}
            <View style={tw`flex-1 bg-black/40`}>

                {/* Animated container die van boven naar beneden schuift */}
                <Animated.View style={[tw`bg-[#E6D8F5] rounded-b-2xl p-5`, { transform: [{ translateY }] }]}>
                    <Image source={protest.image} style={tw`w-full h-44 rounded-xl mb-3`} resizeMode="cover" />
                    <Text style={tw`text-xl font-bold text-[#0A1A3A]`}>{protest.title}</Text>
                    <Text style={tw`italic text-gray-700 mt-1`}>{protest.subtitle}</Text>

                    {/* Details only in preview */}
                    <View style={tw`mt-3`}>
                        <Text style={tw`text-sm text-gray-600`}>Datum: <Text style={tw`text-[#0A1A3A]`}>{protest.date} • {protest.timeStart}</Text></Text>
                        <Text style={tw`text-sm text-gray-600 mt-1`}>Locatie: <Text style={tw`text-[#0A1A3A]`}>{protest.location}</Text></Text>
                        <Text style={tw`text-sm text-gray-600 mt-1`}>Deelnemers: <Text style={tw`text-[#0A1A3A]`}>{protest.participants}</Text></Text>
                    </View>

                    <Text style={tw`text-gray-700 mt-3`}>{protest.why}</Text>

                    {/* Acties: bookmark + details + sluiten */}
                    <View style={tw`flex-row mt-5 items-center justify-between`}>
                        <TouchableOpacity onPress={toggleBookmark} style={tw`flex-row items-center bg-white px-4 py-2 rounded-lg`}>
                            <Ionicons name="bookmark-outline" size={18} color="#0A1A3A" />
                            <Text style={tw`ml-2 text-[#0A1A3A]`}>Opslaan</Text>
                        </TouchableOpacity>

                        <View style={tw`flex-row`}>
                            <TouchableOpacity onPress={goToDetail} style={tw`bg-[#0057FF] px-4 py-2 rounded-lg mr-2`}>
                                <Text style={tw`text-white font-semibold`}>Details</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={onClose} style={tw`bg-[#0A1A3A] px-4 py-2 rounded-lg`}>
                                <Text style={tw`text-white font-semibold`}>Sluiten</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

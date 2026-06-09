// components/PreviewModal.js

import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    Animated,
    Dimensions,
    Pressable,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

import { saveUserProject } from "../components/services/ProtestApi";

const { height } = Dimensions.get("window");

export default function PreviewModal({ visible, onClose, protest }) {
    const navigation = useNavigation();
    const translateY = useRef(new Animated.Value(-height)).current;
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            translateY.setValue(-height);
        }
    }, [visible, translateY]);

    if (!protest) return null;

    function goToDetail() {
        onClose();

        const state = navigation.getState();
        const currentRoutes = state?.routeNames || [];

        if (currentRoutes.includes("Detail")) {
            navigation.navigate("Detail", { protest });
            return;
        }

        if (currentRoutes.includes("AgendaDetail")) {
            navigation.navigate("AgendaDetail", { protest });
        }
    }

    async function saveProtest() {
        try {
            if (!protest.protestProjectId) {
                Alert.alert("Niet mogelijk", "Geen protest_project id gevonden.");
                return;
            }

            setSaving(true);
            await saveUserProject(protest.protestProjectId);

            Alert.alert("Opgeslagen", "Deze demonstratie is toegevoegd aan je agenda.");
        } catch (error) {
            Alert.alert("Fout", "Deze demonstratie kon niet worden opgeslagen.");
            console.log("saveUserProject error:", error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={tw`flex-1 bg-black/35`}>
                <Pressable style={tw`absolute inset-0`} onPress={onClose} />

                <Animated.View
                    style={[
                        tw`bg-[#DCC7EA] rounded-b-3xl overflow-hidden border-b-2 border-[#0A1A3A]`,
                        {
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    <View style={tw`items-center pt-3 pb-2`}>
                        <View style={tw`w-12 h-1 bg-[#0A1A3A]/30 rounded-full`} />
                    </View>

                    <View>
                        <Image
                            source={protest.image}
                            style={tw`w-full h-52`}
                            resizeMode="cover"
                        />

                        <TouchableOpacity
                            onPress={saveProtest}
                            disabled={saving}
                            style={tw`absolute top-3 right-3 bg-[#0057B8] rounded-lg p-2`}
                        >
                            <Ionicons name="bookmark-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`p-5`}>
                        <Text style={tw`text-[#0A1A3A] text-2xl font-semibold`}>
                            {protest.title}
                        </Text>

                        <Text style={tw`text-[#0A1A3A] italic text-base mt-2`}>
                            {protest.subtitle}
                        </Text>

                        <View style={tw`flex-row mt-7`}>
                            <TouchableOpacity
                                onPress={goToDetail}
                                style={tw`flex-1 bg-[#8B2BD6] rounded-xl py-4 items-center mr-3`}
                            >
                                <Text style={tw`text-white font-bold text-base`}>
                                    Details
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onClose}
                                style={tw`flex-1 bg-[#0A1A3A] rounded-xl py-4 items-center ml-3`}
                            >
                                <Text style={tw`text-white font-bold text-base`}>
                                    Verwijderen
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={tw`flex-row items-center mt-6 flex-wrap`}>
                            <View style={tw`flex-row items-center mr-5 mb-2`}>
                                <Ionicons name="location" size={19} color="#7B2DD2" />
                                <Text style={tw`text-[#0A1A3A] text-sm ml-2`}>
                                    {protest.location}
                                </Text>
                            </View>

                            <View style={tw`flex-row items-center mr-5 mb-2`}>
                                <Ionicons name="person-outline" size={19} color="#7B2DD2" />
                                <Text style={tw`text-[#0A1A3A] text-sm ml-2`}>
                                    {protest.participants}
                                </Text>
                            </View>

                            <View style={tw`flex-row items-center mb-2`}>
                                <Ionicons name="pricetag-outline" size={19} color="#7B2DD2" />
                                <Text style={tw`text-[#0A1A3A] text-sm ml-2`}>
                                    {protest.type}
                                </Text>
                            </View>
                        </View>

                        {saving && (
                            <Text style={tw`text-[#0A1A3A] text-sm mt-3`}>
                                Opslaan...
                            </Text>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
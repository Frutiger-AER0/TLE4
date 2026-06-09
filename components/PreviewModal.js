// components/PreviewModal.js

import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    Animated,
    Dimensions,
    Pressable,
} from "react-native";
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
            translateY.setValue(-height);
        }
    }, [visible, translateY]);

    if (!protest) return null;

    function goToDetail() {
        onClose();
        navigation.navigate("Detail", { protest });
    }

    function removePreview() {
        /*
            PSEUDOCODE VOOR LATER:

            Als gebruiker demonstratie uit lijst wil verwijderen/verbergen:
            await fetch(`/api/user-protests/${protest.id}`, {
                method: "DELETE",
            });

            Daarna:
            - modal sluiten
            - lijst opnieuw ophalen
            - of lokaal uit state filteren
        */

        onClose();
    }

    function toggleBookmark() {
        /*
            PSEUDOCODE VOOR LATER:

            await fetch(`/api/bookmarks`, {
                method: "POST",
                body: JSON.stringify({
                    user_id: currentUser.id,
                    protest_id: protest.id,
                }),
            });

            Daarna bookmark icon actief maken.
        */

        console.log("Bookmark toggled:", protest.id);
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
                    <View>
                        <Image
                            source={protest.image}
                            style={tw`w-full h-48`}
                            resizeMode="cover"
                        />

                        <TouchableOpacity
                            onPress={toggleBookmark}
                            style={tw`absolute top-3 right-3 bg-[#0057B8] rounded-lg p-2`}
                        >
                            <Ionicons name="bookmark-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`p-4`}>
                        <Text style={tw`text-[#0A1A3A] text-lg font-semibold`}>
                            {protest.title}
                        </Text>

                        <Text style={tw`text-[#0A1A3A] italic text-sm mt-1`}>
                            {protest.subtitle}
                        </Text>

                        <View style={tw`flex-row mt-5`}>
                            <TouchableOpacity
                                onPress={goToDetail}
                                style={tw`flex-1 bg-[#8B2BD6] rounded-xl py-3 items-center mr-3`}
                            >
                                <Text style={tw`text-white font-semibold`}>Details</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={removePreview}
                                style={tw`flex-1 bg-[#0A1A3A] rounded-xl py-3 items-center ml-3`}
                            >
                                <Text style={tw`text-white font-semibold`}>Verwijderen</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={tw`flex-row items-center mt-5`}>
                            <View style={tw`flex-row items-center mr-5`}>
                                <Ionicons name="location" size={16} color="#7B2DD2" />
                                <Text style={tw`text-[#0A1A3A] text-xs ml-1`}>
                                    {protest.location}
                                </Text>
                            </View>

                            <View style={tw`flex-row items-center mr-5`}>
                                <Ionicons name="person-outline" size={16} color="#7B2DD2" />
                                <Text style={tw`text-[#0A1A3A] text-xs ml-1`}>
                                    {protest.participants}
                                </Text>
                            </View>

                            <View style={tw`flex-row items-center`}>
                                <Ionicons name="pricetag-outline" size={16} color="#7B2DD2" />
                                <Text style={tw`text-[#0A1A3A] text-xs ml-1`}>
                                    {protest.type}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={tw`items-center -mb-1`}>
                        <View
                            style={tw`bg-[#DCC7EA] border-l-2 border-r-2 border-b-2 border-[#0A1A3A] w-24 h-8 rounded-b-xl items-center justify-center`}
                        >
                            <Ionicons name="chevron-up" size={30} color="#0A1A3A" />
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
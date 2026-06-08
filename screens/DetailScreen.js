// screens/DetailScreen.js

import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

export default function DetailScreen({ route }) {
    const navigation = useNavigation();
    const { protest } = route.params;

    const [inputValue, setInputValue] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    function submitProject() {
        /*
            PSEUDOCODE VOOR LATER:

            await fetch("/api/user-projects", {
                method: "POST",
                body: JSON.stringify({
                    user_id: currentUser.id,
                    protest_project_id: protest.project_id,
                    input: inputValue,
                    accepted_terms: acceptedTerms,
                }),
            });

            Daarna:
            - succesmelding tonen
            - formulier leegmaken
            - gebruiker eventueel naar profiel/projecten sturen
        */

        if (!acceptedTerms) {
            Alert.alert("Voorwaarden", "Je moet akkoord gaan met de voorwaarden.");
            return;
        }

        Alert.alert("Verzonden", "Je inzending is tijdelijk opgeslagen als demo.");
        setInputValue("");
    }

    function toggleBookmark() {
        /*
            PSEUDOCODE VOOR LATER:

            await fetch("/api/bookmarks", {
                method: "POST",
                body: JSON.stringify({
                    user_id: currentUser.id,
                    protest_id: protest.id,
                }),
            });
        */

        console.log("Bookmark toggled:", protest.id);
    }

    function shareProtest() {
        /*
            PSEUDOCODE VOOR LATER:

            Share.share({
                message: `${protest.title} - ${protest.location}`,
            });
        */

        console.log("Share protest:", protest.id);
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Geen SupporT header meer hier, want AppHeader staat al globaal in App.js */}

                <View>
                    <Image
                        source={protest.image}
                        style={tw`w-full h-72`}
                        resizeMode="cover"
                    />

                    <View style={tw`absolute inset-0 bg-black/25`} />

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={tw`absolute top-5 left-3 bg-[#0057B8] w-10 h-10 rounded-lg items-center justify-center`}
                    >
                        <Ionicons name="arrow-back" size={25} color="white" />
                    </TouchableOpacity>

                    <View style={tw`absolute top-5 right-3 flex-row`}>
                        <TouchableOpacity
                            onPress={toggleBookmark}
                            style={tw`bg-[#0057B8] w-10 h-10 rounded-lg items-center justify-center mr-2`}
                        >
                            <Ionicons name="bookmark-outline" size={25} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={shareProtest}
                            style={tw`bg-[#0057B8] w-10 h-10 rounded-lg items-center justify-center`}
                        >
                            <Ionicons
                                name="share-social-outline"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`absolute bottom-4 left-3 right-3`}>
                        <Text style={tw`text-white text-2xl font-bold`}>
                            {protest.title}
                        </Text>

                        <View style={tw`flex-row justify-between items-end mt-1`}>
                            <Text style={tw`text-white italic text-sm`}>
                                {protest.subtitle}
                            </Text>

                            <View style={tw`bg-[#FFD21E] px-4 py-1 rounded-full`}>
                                <Text style={tw`text-[#0A1A3A] text-xs font-bold`}>
                                    {protest.topic}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={tw`bg-[#E6D8F5] px-3 py-6`}>
                    <Text style={tw`text-[#0A1A3A] text-xl font-semibold mb-2`}>
                        Waarom Demonstreren we?
                    </Text>

                    <TouchableOpacity>
                        <Text style={tw`text-[#0057B8] text-sm font-medium`}>
                            Informatie over de demonstratie →
                        </Text>
                    </TouchableOpacity>

                    <View style={tw`flex-row mt-5`}>
                        <View style={tw`flex-1 bg-[#0A1A3A] rounded-xl p-4 mr-3 min-h-36`}>
                            <Ionicons name="time-outline" size={34} color="white" />

                            <Text style={tw`text-white font-bold mt-5`}>
                                {protest.date}
                            </Text>

                            <Text style={tw`text-white italic mt-2`}>
                                Aanvang: {protest.timeStart}
                            </Text>

                            <Text style={tw`text-white italic`}>
                                Start Mars: {protest.timeEnd}
                            </Text>

                            <TouchableOpacity style={tw`mt-4`}>
                                <Text style={tw`text-white underline`}>
                                    Agenda toevoegen →
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={tw`flex-1 bg-[#0A1A3A] rounded-xl p-4 ml-3 min-h-36`}>
                            <Ionicons name="location-outline" size={34} color="white" />

                            <Text style={tw`text-white font-bold mt-5 text-base`}>
                                {protest.location},
                            </Text>

                            <Text style={tw`text-white font-bold text-base`}>
                                {protest.city}
                            </Text>

                            <TouchableOpacity style={tw`mt-8`}>
                                <Text style={tw`text-white underline`}>
                                    Kaart bekijken →
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={tw`px-5 py-16 items-center bg-white`}>
                    <Text style={tw`text-[#0A1A3A] text-2xl font-bold text-center`}>
                        {protest.actionTitle}
                    </Text>

                    <Text style={tw`text-[#0A1A3A] text-base text-center mt-3 leading-5`}>
                        {protest.actionDescription}
                    </Text>
                </View>

                <View style={tw`bg-gray-300 px-5 pt-14 pb-20`}>
                    <Text style={tw`text-black text-2xl font-black italic text-right`}>
                        DIRECT
                    </Text>

                    <Text style={tw`text-black text-xl font-black text-right mb-8`}>
                        HIGH - IMPACT
                    </Text>

                    <View style={tw`bg-white rounded-lg p-5`}>
                        <Text style={tw`text-[#0A1A3A] text-lg font-semibold`}>
                            High Impact{" "}
                            <Text style={tw`italic font-normal`}>
                                - Low effort
                            </Text>
                        </Text>

                        <View style={tw`flex-row items-center border border-gray-300 rounded-lg mt-3 px-3`}>
                            <TextInput
                                placeholder="Voeg toe"
                                placeholderTextColor="#B8B8B8"
                                value={inputValue}
                                onChangeText={setInputValue}
                                style={tw`flex-1 py-3 text-[#0A1A3A]`}
                            />

                            <Ionicons name="image-outline" size={27} color="#333333" />
                        </View>

                        <TouchableOpacity
                            onPress={() => setAcceptedTerms(!acceptedTerms)}
                            style={tw`flex-row mt-6`}
                            activeOpacity={0.8}
                        >
                            <View
                                style={[
                                    tw`w-5 h-5 rounded items-center justify-center mr-3 mt-1`,
                                    acceptedTerms
                                        ? tw`bg-[#333333]`
                                        : tw`border border-gray-400`,
                                ]}
                            >
                                {acceptedTerms && (
                                    <Ionicons name="checkmark" size={16} color="white" />
                                )}
                            </View>

                            <View style={tw`flex-1`}>
                                <Text style={tw`text-[#0A1A3A] text-xs font-semibold leading-4`}>
                                    Ik ga akkoord met de voorwaarden.
                                </Text>

                                <Text style={tw`text-[#0A1A3A] text-xs font-semibold leading-4`}>
                                    Het schenden van de regels betekent uitsluiting van de actie.
                                </Text>

                                <TouchableOpacity>
                                    <Text style={tw`text-[#0057B8] text-base mt-1`}>
                                        Algemene voorwaarden →
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={submitProject}
                            style={tw`bg-[#0A1A3A] rounded-lg py-4 mt-8 items-center`}
                        >
                            <Text style={tw`text-white text-base`}>
                                Verzenden
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
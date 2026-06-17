import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import EventDetailsCard from "../components/layout/EventDetailsCard";
import ActionCard from "../components/layout/ActionCard";
import SubmitForum from "../components/layout/SubmitForum";
import HelpFromHomeCard from "../components/layout/HelpFromHomeCard";
import { fetchProtests, normalizeProtest } from "../components/services/ProtestApi";

const { height } = Dimensions.get("window");

export default function DetailScreen({ route }) {
    const navigation = useNavigation();

    const routeProtest =
        route?.params?.protest ||
        route?.params?.item ||
        null;

    const routeProtestId =
        route?.params?.protestId ||
        route?.params?.id ||
        routeProtest?.id ||
        null;

    const [protest, setProtest] = useState(
        routeProtest ? normalizeProtest(routeProtest) : null
    );

    const [loading, setLoading] = useState(!routeProtest);
    const [errorText, setErrorText] = useState("");
    const [isSaved, setIsSaved] = useState(
        Boolean(routeProtest?.isSaved || routeProtest?.isPlanned)
    );

    useEffect(() => {
        console.log("DetailScreen mounted. routeProtestId:", routeProtestId);
        loadLatestProtest();
    }, [routeProtestId]);

    async function loadLatestProtest() {
        if (!routeProtestId) {
            setLoading(false);
            if (!routeProtest) {
                setErrorText("Geen protest gevonden (geen ID).");
            }
            return;
        }

        try {
            setErrorText("");
            if (!routeProtest) {
                setLoading(true);
            }

            console.log("Fetching all protests...");
            const allProtests = await fetchProtests();
            console.log("All protests fetched. Searching for ID:", routeProtestId);

            const foundProtest = allProtests.find((item) => item.id === Number(routeProtestId));
            console.log("Found protest:", JSON.stringify(foundProtest, null, 2));

            if (foundProtest) {
                if (!foundProtest.protestProjectId) {
                    foundProtest.protestProjectId = 1; // Fallback
                }
                setProtest(foundProtest);
                setIsSaved(Boolean(foundProtest.isSaved || foundProtest.isPlanned));
            } else if (routeProtest) {
                setProtest(normalizeProtest(routeProtest));
            } else {
                setErrorText("Dit protest kon niet worden gevonden in de database.");
            }
        } catch (error) {
            console.error("DetailScreen loadLatestProtest error:", error.message);
            if (routeProtest) {
                setProtest(normalizeProtest(routeProtest));
            } else {
                setErrorText("Protestgegevens konden niet worden geladen.");
            }
        } finally {
            setLoading(false);
        }
    }

    function goBack() {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }
        navigation.navigate("ActionScreen");
    }

    if (loading) {
        return (
            <View className="flex-1 bg-offWhite items-center justify-center px-6">
                <ActivityIndicator size="large" color="#14213D" />
                <Text className="text-darkBlue font-semibold mt-4">
                    Protest laden...
                </Text>
            </View>
        );
    }

    if (!protest || errorText) {
        return (
            <View className="flex-1 bg-offWhite px-6 justify-center">
                <Text className="text-darkBlue text-2xl font-bold text-center">
                    Protest niet gevonden
                </Text>
                <Text className="text-darkBlue text-center mt-3">
                    {errorText || "Er ging iets mis bij het laden van dit protest."}
                </Text>
                <TouchableOpacity
                    onPress={goBack}
                    className="bg-darkBlue rounded-xl py-4 mt-6 items-center"
                    activeOpacity={0.85}
                >
                    <Text className="text-white font-bold">
                        Terug
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-offWhite">
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ height: height * 0.35 }} className="w-full relative">
                    <Image
                        source={protest.image}
                        className="h-full w-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/30" />
                    <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={goBack}
                            className="bg-blue px-4 py-2.5 rounded-full"
                            activeOpacity={0.85}
                        >
                            <Ionicons name="arrow-back" size={24} color="#F8F9FA" />
                        </TouchableOpacity>
                        <View className="flex-row">
                            <TouchableOpacity
                                onPress={() => setIsSaved(!isSaved)}
                                className="bg-blue px-4 py-2.5 rounded-full"
                                activeOpacity={0.85}
                            >
                                <Ionicons
                                    name={isSaved ? "bookmark" : "bookmark-outline"}
                                    size={24}
                                    color="#F8F9FA"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => console.log("Share")}
                                className="bg-blue px-4 py-2.5 rounded-full ml-3"
                                activeOpacity={0.85}
                            >
                                <Ionicons
                                    name="share-social-outline"
                                    size={24}
                                    color="#F8F9FA"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="absolute bottom-4 left-4 right-4 flex-row justify-between items-end">
                        <View className="flex-1 pr-3">
                            <Text
                                className="text-offWhite text-2xl font-bold"
                                numberOfLines={2}
                            >
                                {protest.title}
                            </Text>
                            <Text
                                className="text-offWhite text-lg italic mt-1"
                                numberOfLines={1}
                            >
                                {protest.subtitle}
                            </Text>
                        </View>
                        <View className="bg-yellow px-5 py-2 rounded-full">
                            <Text className="text-darkBlue font-bold">
                                {protest.topic}
                            </Text>
                        </View>
                    </View>
                </View>

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

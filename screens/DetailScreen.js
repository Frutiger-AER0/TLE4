import React, {useState} from "react";
import {View, Text, Dimensions, TouchableOpacity, Image, ScrollView} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import AppHeader from "../components/layout/AppHeader";
import EventDetailsCard from "../components/layout/EventDetailsCard";
import ActionCard from "../components/layout/ActionCard";
import SubmitForum from "../components/layout/SubmitForum";

const {height} = Dimensions.get("window");

export default function DetailScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // State voor het opslaan-icoontje
    const [isSaved, setIsSaved] = useState(false);

    // De hoogte van de AppHeader is 56 + de veilige marge bovenaan
    const headerHeight = 56 + insets.top;

    return (
        <View className="flex-1 bg-offWhite">

            <ScrollView bounces={false}>
                {/* De Afbeelding Container (40% van het scherm) */}
                <View style={{height: height * 0.30}} className="w-full relative">
                    <Image
                        source={require('../assets/Palestinedemostration.webp')}
                        className="h-full w-full"
                        resizeMode="cover"
                    />

                    {/* De donkere overlay voor de tekst */}
                    <View className="absolute inset-0 bg-black/30"/>

                    {/* Knoppenbalk: absoluut gepositioneerd ONDER de header, maar OP de afbeelding */}
                    <View
                        className="absolute left-4 right-4 flex-row justify-between items-center"
                        style={{top: headerHeight - 85}}
                    >
                        {/* Links: Terug knop */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="bg-blue px-4 py-2.5 rounded-full"
                        >
                            <Ionicons name="arrow-back" size={24} color="#F8F9FA"/>
                        </TouchableOpacity>

                        {/* Rechts: Bookmark en Share knoppen */}
                        <View className="flex-row">
                            <TouchableOpacity
                                onPress={() => setIsSaved(!isSaved)}
                                className="bg-blue px-4 py-2.5 rounded-full"
                            >
                                <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color="#F8F9FA"/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => console.log('Share')}
                                className="bg-blue px-4 py-2.5 rounded-full ml-3"
                            >
                                <Ionicons name="share-social-outline" size={24} color="#F8F9FA"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Elementen onderaan op de afbeelding (Tekst links, Label rechts) */}
                    <View className="absolute bottom-4 left-4 right-4 flex-row justify-between items-end">
                        {/* Tekst links */}
                        <View>
                            <Text className="text-offWhite text-2xl font-bold">Nakba 1948 - 2026</Text>
                            <Text className="text-offWhite text-lg italic mt-1">Mars & herdenking</Text>
                        </View>

                        {/* Geel ovaal label rechts */}
                        <View className="bg-yellow px-6 py-2 rounded-full">
                            <Text className="text-darkBlue font-bold">Palestina</Text>
                        </View>
                    </View>
                </View>

                {/* Paarse container */}
                <View className="bg-lightPurple pb-5">
                    <View className="mt-5">
                        <EventDetailsCard/>
                    </View>
                </View>

                {/* "Kom in actie" kaart */}
                <ActionCard/>

                {/* Nieuw "Submit Forum" component */}
                <SubmitForum/>

            </ScrollView>
        </View>
    );
}

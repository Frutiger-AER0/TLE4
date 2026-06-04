import React from "react";
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from '@react-navigation/native';
import ActionCard from "../components/actions/ActionCard"; // Import useNavigation

export default function ActionScreen() {
    const navigation = useNavigation(); // Initialize navigation

    const handleCardPress = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <ScrollView
            contentContainerStyle={{flexGrow: 1, alignItems: 'center', paddingTop: 40, paddingBottom: 20}}
            className="flex-1">
            <View className="flex-1 bg-offWhite px-4">
                <Text className="text-xl font-bold text-darkBlue mb-5"
                      style={{marginBottom: 20}}>
                    Maak impact op jouw manier
                </Text>
                <View className="flex flex-col">
                    {/* Stickers */}
                    <ActionCard
                        image={require("../assets/tle4-stickers.jpg")}
                        title="Stickers ontwerpen"
                        description="Jouw ontwerp, onze productie. Verspreid de boodschap met stickers."
                        buttonText="Doneer"
                        onPress={() => handleCardPress("DonationScreen")}
                    />

                    {/* Banners */}
                    <ActionCard
                        image={require("../assets/tle4-spandoek.avif")}
                        title="Spandoeken ontwerpen"
                        description="Help mee met een spandoek. Lever een ontwerp aan. Wij regelen de rest."
                        buttonText="Doneer"
                        onPress={() => handleCardPress("DonationScreen")}
                    />

                    {/* Donations */}
                    <ActionCard
                        image={require("../assets/tle4-doneren.jpg")}
                        title="Donaties"
                        description="Draag bij aan de beweging. Jouw donatie komt 100% terecht waar die het meeste impact maakt, bij jou doel."
                        buttonText="Doneer"
                        onPress={() => handleCardPress("DonationScreen")}
                    />
                </View>
            </View>

        </ScrollView>
    );

}

// screens/ActionScreen.js

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ActionCard from "../components/actions/ActionCard";

export default function ActionScreen() {
    const navigation = useNavigation();

    function goToProject(projectType) {
        navigation.navigate("HomeScreen", {
            projectType: projectType,
        });
    }

    function goToDonation() {
        navigation.navigate("DonationScreen");
    }

    return (
        <ScrollView
            className="flex-1 bg-offWhite"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingTop: 20,
                paddingBottom: 120,
            }}
        >
            <View
                className="bg-offWhite"
                style={{
                    paddingHorizontal: 16,
                }}
            >
                <Text
                    className="text-darkBlue"
                    style={{
                        fontSize: 22,
                        fontWeight: "700",
                        marginBottom: 20,
                    }}
                >
                    Maak impact op jouw manier
                </Text>

                <ActionCard
                    image={require("../assets/tle4-stickers.jpg")}
                    title="Stickers ontwerpen"
                    description="Jouw ontwerp, onze productie. Verspreid de boodschap met stickers."
                    buttonText="Bekijk projecten"
                    onPress={() => goToProject("stickers")}
                />

                <ActionCard
                    image={require("../assets/tle4-spandoek.avif")}
                    title="Spandoeken ontwerpen"
                    description="Help mee met een spandoek. Lever een ontwerp aan. Wij regelen de rest."
                    buttonText="Bekijk projecten"
                    onPress={() => goToProject("spandoeken")}
                />

                <ActionCard
                    image={require("../assets/tle4-doneren.jpg")}
                    title="Donaties"
                    description="Draag bij aan de beweging. Jouw donatie komt 100% terecht waar die het meeste impact maakt, bij jouw doel."
                    buttonText="Doneer"
                    onPress={goToDonation}
                />
            </View>
        </ScrollView>
    );
}
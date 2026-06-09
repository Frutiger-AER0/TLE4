import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ActionCard from "../components/actions/ActionCard";

export default function ActionScreen() {
    const navigation = useNavigation();

    function goToProject(projectType) {
        /*
            TIJDELIJKE FLOW

            Nu sturen we elke projectkaart naar HomeScreen.
            HomeScreen toont daarna de demonstraties die bij UserStory-2 horen.

            PSEUDOCODE VOOR LATER MET BACKEND:

            navigation.navigate("HomeScreen", {
                projectType: projectType,
            });

            In HomeScreen.js kun je later route.params.projectType gebruiken
            om alleen demonstraties te tonen die bij dit projecttype horen.

            Bijvoorbeeld:
            - "stickers"
            - "spandoeken"
            - "donaties"
        */

        navigation.navigate("HomeScreen", {
            projectType: projectType,
        });
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                alignItems: "center",
                paddingTop: 40,
                paddingBottom: 20,
            }}
            className="flex-1"
        >
            <View className="flex-1 bg-offWhite px-4">
                <Text
                    className="text-xl font-bold text-darkBlue mb-5"
                    style={{ marginBottom: 20 }}
                >
                    Maak impact op jouw manier
                </Text>

                <View className="flex flex-col">
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
                        onPress={() => navigation.navigate("DonationScreen")}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
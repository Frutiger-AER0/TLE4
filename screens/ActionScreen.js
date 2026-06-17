// screens/ActionScreen.js

import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ActionCard from "../components/actions/ActionCard";
import ActionModal from "../components/actions/ActionModal";

const ACTION_DETAILS = {
    stickers: {
        title: "Stickers ontwerpen",
        details: [
            {
                header: "Wat is het?",
                text: "Ontwerp stickers die de boodschap van de demonstratie versterken.",
            },
            {
                header: "Digitaal",
                text: "Lever een ontwerp aan. Wij drukken de stickers en nemen ze mee naar de demonstratie.",
            },
            {
                header: "Zelf maken",
                text: "Heb je zelf stickers gemaakt? Stuur ze naar ons op. Wij zorgen dat het tijdens de demonstratie wordt verspreid.",
            },
        ],
    },

    spandoeken: {
        title: "Spandoeken ontwerpen",
        details: [
            {
                header: "Wat is het?",
                text: "Ontwerp of maak een spandoek en help de demonstratie zichtbaar te maken.",
            },
            {
                header: "Productie",
                text: "Lever je ontwerp aan. Wij drukken het en nemen het mee naar de demonstratie.",
            },
            {
                header: "Zelf meenemen",
                text: "Maak zelf een spandoek en stuur het op. Wij zorgen dat het op de juiste plek terechtkomt.",
            },
        ],
    },
};

export default function ActionScreen() {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);

    function goToProject(projectType) {
        navigation.navigate("HomeScreen", {
            type: projectType,
            projectType: projectType,
            filterSource: "ActionScreen",
            filterAppliedAt: Date.now(),
        });
    }

    function goToDonation() {
        navigation.navigate("DonationScreen");
    }

    function openInfoModal(actionKey) {
        setSelectedAction(ACTION_DETAILS[actionKey]);
        setModalVisible(true);
    }

    function closeInfoModal() {
        setModalVisible(false);
        setSelectedAction(null);
    }

    return (
        <View
            className="flex-1 bg-offWhite"
            accessible={false}
        >
            <ScrollView
                className="flex-1 bg-offWhite"
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                accessibilityLabel="Actiepagina"
                accessibilityHint="Op deze pagina kies je hoe je impact wilt maken."
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
                        accessibilityRole="header"
                        style={{
                            fontSize: 22,
                            fontWeight: "700",
                            marginBottom: 20,
                        }}
                    >
                        Maak impact op jouw manier
                    </Text>

                    <View
                        className="flex flex-col"
                        accessibilityLabel="Lijst met manieren om bij te dragen"
                    >
                        <ActionCard
                            image={require("../assets/tle4-stickers.jpg")}
                            title="Stickers ontwerpen"
                            description="Jouw ontwerp, onze productie. Verspreid de boodschap met stickers."
                            buttonText="Bekijk projecten"
                            accessibilityLabel="Stickers ontwerpen"
                            accessibilityHint="Bekijk demonstraties waarbij je stickers kunt ontwerpen."
                            infoAccessibilityLabel="Meer informatie over stickers ontwerpen"
                            infoAccessibilityHint="Opent uitleg over hoe stickers ontwerpen werkt."
                            onPress={() => goToProject("Stickers")}
                            onPressInfo={() => openInfoModal("stickers")}
                        />

                        <ActionCard
                            image={require("../assets/tle4-spandoek.avif")}
                            title="Spandoeken ontwerpen"
                            description="Help mee met een spandoek. Lever een ontwerp aan. Wij regelen de rest."
                            buttonText="Bekijk projecten"
                            accessibilityLabel="Spandoeken ontwerpen"
                            accessibilityHint="Bekijk demonstraties waarbij je spandoeken kunt ontwerpen."
                            infoAccessibilityLabel="Meer informatie over spandoeken ontwerpen"
                            infoAccessibilityHint="Opent uitleg over hoe spandoeken ontwerpen werkt."
                            onPress={() => goToProject("Spandoek")}
                            onPressInfo={() => openInfoModal("spandoeken")}
                        />

                        <ActionCard
                            image={require("../assets/tle4-doneren.jpg")}
                            title="Donaties"
                            description="Draag bij aan de beweging. Jouw donatie komt 100% terecht waar die het meeste impact maakt, bij jouw doel."
                            buttonText="Doneer"
                            accessibilityLabel="Donaties"
                            accessibilityHint="Ga naar de donatiepagina."
                            onPress={goToDonation}
                        />
                    </View>
                </View>
            </ScrollView>

            <ActionModal
                visible={modalVisible}
                onClose={closeInfoModal}
                actionData={selectedAction}
            />
        </View>
    );
}
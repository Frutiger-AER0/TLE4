import React from "react";
import { View, Text } from "react-native";

export default function ActionCard() {
    return (
        <View className="bg-offWhite p-5 w-full mt-2">
            {/* Tekst (rechts uitgelijnd, groter en iets naar beneden) */}
            <View className="mt-4">
                <Text className="text-darkBlue text-2xl font-extrabold mb-3 text-right">
                    Kom in actie voor de Mars!
                </Text>
                <Text className="text-darkBlue text-sm leading-5 text-right">
                    Een krachtig protest valt of staat met de boodschap. Wij zorgen voor de straat, zorg jij voor het beeld? Jouw creativiteit is precies wat we nu nodig hebben.
                </Text>
            </View>
        </View>
    );
}

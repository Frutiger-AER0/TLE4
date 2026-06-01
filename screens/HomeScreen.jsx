// ------------------------------------------------------------
// PSEUDOCODE: BEGIN HomeScreen
// ------------------------------------------------------------
// 1. Maak een lijst met dummy protesten (tijdelijke data)
// 2. Toon een scrollbare pagina
// 3. Laat voor elk protest een kaartje zien
// 4. Wanneer je op een kaartje klikt, ga naar DetailScreen
// ------------------------------------------------------------

import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {

    // ------------------------------------------------------------
    // PSEUDOCODE:
    // DEFINE dummy protests list
    // ------------------------------------------------------------
    const protests = [
        {
            id: "1",
            title: "Klimaatmars",
            date: "2026-06-01",
            location: "Rotterdam",
            description: "Een grote mars voor een beter klimaatbeleid."
        },
        {
            id: "2",
            title: "Woonprotest",
            date: "2026-06-05",
            location: "Amsterdam",
            description: "Protest tegen de stijgende huurprijzen."
        }
    ];

    return (
        <ScrollView className="flex-1 bg-white px-4 pt-10">

            {/* ------------------------------------------------------------
          PSEUDOCODE:
          SHOW main title + subtitle
         ------------------------------------------------------------ */}
            <Text className="text-3xl font-bold mb-2">Home</Text>
            <Text className="text-gray-600 mb-6">Overzicht van protesten</Text>

            {/* ------------------------------------------------------------
          PSEUDOCODE:
          FOR EACH protest:
              SHOW clickable card
         ------------------------------------------------------------ */}
            {protests.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate("Details", { protest: item })}
                >
                    <View className="bg-gray-100 p-4 mb-3 rounded-xl">
                        <Text className="text-lg font-semibold">{item.title}</Text>
                        <Text className="text-gray-600">
                            {item.date} • {item.location}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}

        </ScrollView>
    );
}

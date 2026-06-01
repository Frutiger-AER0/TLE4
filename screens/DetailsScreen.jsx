// ------------------------------------------------------------
// PSEUDOCODE: BEGIN DetailScreen
// ------------------------------------------------------------
// 1. Ontvang protest via route.params
// 2. Toon titel, datum, locatie en beschrijving
// 3. Alles in een ScrollView zodat het netjes scrollt
// ------------------------------------------------------------

import { View, Text, ScrollView } from "react-native";

export default function DetailScreen({ route }) {

    // ------------------------------------------------------------
    // PSEUDOCODE:
    // GET protest FROM navigation parameters
    // ------------------------------------------------------------
    const { protest } = route.params;

    return (
        <ScrollView className="flex-1 bg-white px-4 pt-10">

            {/* ------------------------------------------------------------
          PSEUDOCODE:
          SHOW protest title
         ------------------------------------------------------------ */}
            <Text className="text-3xl font-bold mb-2">
                {protest.title}
            </Text>

            {/* ------------------------------------------------------------
          PSEUDOCODE:
          SHOW date + location
         ------------------------------------------------------------ */}
            <Text className="text-gray-700 text-base mb-1">
                Datum: {protest.date}
            </Text>

            <Text className="text-gray-700 text-base mb-1">
                Locatie: {protest.location}
            </Text>

            {/* ------------------------------------------------------------
          PSEUDOCODE:
          SHOW description IF EXISTS
         ------------------------------------------------------------ */}
            {protest.description && (
                <Text className="text-gray-600 text-base mt-4 leading-6">
                    {protest.description}
                </Text>
            )}

        </ScrollView>
    );
}

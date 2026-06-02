import { View, Text, ScrollView } from "react-native";

export default function DetailScreen({ route }) {
    const { protest } = route.params;

    return (
        <ScrollView className="flex-1 bg-white px-4 pt-10">
            <Text className="text-3xl font-bold mb-2">{protest.title}</Text>

            <Text className="text-gray-700 text-base mb-1">
                Datum: {protest.date}
            </Text>

            <Text className="text-gray-700 text-base mb-1">
                Locatie: {protest.location}
            </Text>

            {protest.theme && (
                <Text className="text-gray-700 text-base mb-1">
                    Thema: {protest.theme}
                </Text>
            )}

            {protest.description && (
                <Text className="text-gray-600 text-base mt-4 leading-6">
                    {protest.description}
                </Text>
            )}
        </ScrollView>
    );
}

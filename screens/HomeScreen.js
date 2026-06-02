import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const navigation = useNavigation();
    const [protests, setProtests] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/protests")
            .then((res) => res.json())
            .then((data) => setProtests(data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <View className="flex-1 bg-white px-4 pt-10">
            <Text className="text-3xl font-bold mb-4">Actuele Protesten</Text>

            <FlatList
                data={protests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="p-4 mb-3 bg-gray-100 rounded-lg"
                        onPress={() => navigation.navigate("Detail", { protest: item })}
                    >
                        <Text className="text-xl font-semibold">{item.title}</Text>
                        <Text className="text-gray-600">{item.date}</Text>
                        <Text className="text-gray-600">{item.location}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View className="flex-1 items-center justify-center bg-offWhite">
            <Text>Dit is de Home page</Text>
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Detail')}
            />
        </View>
    );
}

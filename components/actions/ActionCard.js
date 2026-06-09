import React from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";

export default function ActionCard({
                                       image,
                                       title,
                                       description,
                                       buttonText,
                                       onPress,
                                   }) {
    return (
        <View className="bg-lightPurple rounded-xl overflow-hidden w-full p-5 mb-5">
            <Image
                source={image}
                className="w-full h-[150px]"
                resizeMode="cover"
            />

            <View className="p-4">
                <Text className="text-xl font-semibold text-darkBlue">
                    {title}
                </Text>

                <Text className="mt-1 text-sm text-darkBlue">
                    {description}
                </Text>

                <TouchableOpacity
                    className="self-end mt-4 bg-purple-600 px-6 py-2 rounded-xl"
                    onPress={onPress}
                >
                    <Text className="text-white">{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
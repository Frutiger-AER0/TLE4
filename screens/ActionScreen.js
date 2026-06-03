import React from "react";
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from '@react-navigation/native'; // Import useNavigation

export default function ActionScreen() {
    const navigation = useNavigation(); // Initialize navigation

    const handleCardPress = () => {
        {/* Navigate to the next screen */
        }
        navigation.navigate('DonationScreen');
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
                    className="flex-1">
            <View className="flex-1 bg-offWhite px-4">
                {/* Stickers */}
                <Text className="text-xl font-bold text-darkBlue mt-5 mb-5">
                    Maak impact op jouw manier
                </Text>
                <View className="flex flex-col gap-y-5">
                    <View className="bg-lightPurple rounded-xl overflow-hidden w-full p-5">
                        <Image
                            source={require('../assets/tle4-stickers.jpg')}
                            className="w-full"
                            style={{height: 150}}
                            resizeMode="cover"
                        />

                        <View className="p-4">
                            <Text className="text-xl font-semibold text-darkBlue">
                                Stickers ontwerpen
                            </Text>

                            <Text className="mt-1 text-sm text-darkBlue">
                                Jouw ontwerp, onze productie. Verspreid de boodschap met stickers.
                            </Text>

                            <TouchableOpacity className="self-end mt-4 bg-purple-600 px-6 py-2 rounded-xl">
                                <Text className="text-white">button</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Banners */}
                    <View className="bg-lightPurple rounded-xl overflow-hidden w-full p-5">
                        <Image
                            source={require('../assets/tle4-spandoek.avif')}
                            className="w-full"
                            style={{height: 150}}
                            resizeMode="cover"
                        />

                        <View className="p-4">
                            <Text className="text-xl font-semibold text-darkBlue">
                                Stickers ontwerpen
                            </Text>

                            <Text className="mt-1 text-sm text-darkBlue">
                                Jouw ontwerp, onze productie. Verspreid de boodschap met stickers.
                            </Text>

                            <TouchableOpacity className="self-end mt-4 bg-purple-600 px-6 py-2 rounded-xl">
                                <Text className="text-white">button</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Donations */}
                    <View className="bg-lightPurple rounded-xl overflow-hidden w-full p-5">
                        <Image
                            source={require('../assets/tle4-doneren.jpg')}
                            className="w-full"
                            style={{height: 150}}
                            resizeMode="cover"
                        />

                        <View className="p-4">
                            <Text className="text-xl font-semibold text-darkBlue">
                                Stickers ontwerpen
                            </Text>

                            <Text className="mt-1 text-sm text-darkBlue">
                                Jouw ontwerp, onze productie. Verspreid de boodschap met stickers.
                            </Text>

                            <TouchableOpacity className="self-end mt-4 bg-purple-600 px-6 py-2 rounded-xl">
                                <Text className="text-white">button</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
import React from "react";
import {View, Text, TouchableOpacity, Image} from "react-native";

export default function OnboardingRoleCard({
                                               icon,
                                               title,
                                               description,
                                               isSelected,
                                               onPress,
                                           }) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            className={`w-full p-5 mb-4 rounded-3xl border-2 bg-offWhite relative flex-row items-start ${
                isSelected ? "border-purple" : "border-transparent"
            }`}
            style={{
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4
            }}
        >
            {/* Links: Het Icoon */}
            {icon && (
                <View className="mr-4 mt-1">
                    <Image
                        source={icon}
                        className="w-10 h-10"
                        resizeMode="contain"
                    />
                </View>
            )}

            {/* Midden: Titel en Beschrijving */}
            <View className="flex-1 pr-8">
                <Text className="text-2xl font-bold text-darkBlue mb-2">
                    {title}
                </Text>
                <Text className="text-base font-medium text-darkBlue leading-5">
                    {description}
                </Text>
            </View>

            {/* Rechtsboven: De Selectie Indicator */}
            <View className="absolute top-5 right-5">
                {isSelected ? (
                    <View
                        className="w-7 h-7 bg-purple/20 rounded-full items-center justify-center border border-purple">
                        <Text className="text-purple font-bold text-xs">✓</Text>
                    </View>
                ) : (
                    // Niet geselecteerd: Dun donkerblauw cirkeltje
                    <View className="w-7 h-7 rounded-full border-2 border-darkBlue"/>
                )}
            </View>
        </TouchableOpacity>
    );
}
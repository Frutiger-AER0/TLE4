// components/actions/ActionCard.js

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function ActionCard({
                                       image,
                                       title,
                                       description,
                                       buttonText,
                                       onPress,
                                   }) {
    return (
        <View
            className="bg-lightPurple rounded-xl overflow-hidden w-full mb-5"
            style={{
                minHeight: 0,
            }}
        >
            <Image
                source={image}
                style={{
                    width: "100%",
                    height: 170,
                    backgroundColor: "#E6D8F5",
                }}
                resizeMode="cover"
            />

            <View
                style={{
                    padding: 16,
                }}
            >
                <Text
                    className="text-darkBlue"
                    style={{
                        fontSize: 20,
                        fontWeight: "700",
                        marginBottom: 8,
                    }}
                >
                    {title}
                </Text>

                <Text
                    className="text-darkBlue"
                    style={{
                        fontSize: 14,
                        lineHeight: 20,
                    }}
                >
                    {description}
                </Text>

                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.85}
                    style={{
                        alignSelf: "flex-end",
                        marginTop: 18,
                        backgroundColor: "#8B2BD6",
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 12,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "700",
                            fontSize: 14,
                        }}
                    >
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
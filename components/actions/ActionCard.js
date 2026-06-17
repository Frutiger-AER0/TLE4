import React from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";

export default function ActionCard({
                                       image,
                                       title,
                                       description,
                                       buttonText,
                                       onPress,
                                       onPressInfo,
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

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        marginTop: 18,
                        gap: 12,
                    }}
                >
                    {onPressInfo && (
                        <TouchableOpacity
                            onPress={onPressInfo}
                            activeOpacity={0.85}
                            accessibilityRole="button"
                            accessibilityLabel={`Meer informatie over ${title}`}
                            style={{
                                backgroundColor: "rgba(139, 43, 214, 0.1)", // Subtiele paarse tint passend bij je app
                                paddingHorizontal: 16,
                                height: 44, // Symmetrisch met de hoofdknop
                                borderRadius: 12,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#8B2BD6",
                                    fontWeight: "700",
                                    fontSize: 14,
                                }}
                            >
                                Meer Info
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        style={{
                            backgroundColor: "#8B2BD6",
                            paddingHorizontal: 24,
                            height: 44,
                            borderRadius: 12,
                            justifyContent: "center",
                            alignItems: "center",
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
        </View>
    );
}
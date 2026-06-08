import React from "react";
import {TouchableOpacity, Text} from "react-native";

export default function FilterChip({
                                       label,
                                       selected,
                                       onPress,
                                   }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-2 rounded-xl border mr-2 mb-3 ${
                selected
                    ? "bg-yellow border-yellow"
                    : "bg-white border-yellow"
            }`}
        >
            <Text
                className={`${
                    selected
                        ? "text-black font-semibold"
                        : "text-darkBlue"
                }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}
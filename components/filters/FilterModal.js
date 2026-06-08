import React, {useState} from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import FilterChip from "./FilterChip";

export default function FilterModal({
                                        visible,
                                        onClose,
                                    }) {
    const [selectedTopic, setSelectedTopic] = useState("Palestina");
    const [selectedTime, setSelectedTime] = useState("Alle");

    const topics = [
        "Klimaat",
        "Mensenrechten",
        "Wonen",
        "Onderwijs",
        "Vrede",
        "LHBTQI+",
        "Arbeid",
        "Dieren",
        "Palestina",
    ];

    const times = [
        "Alle",
        "Vandaag",
        "Deze week",
        "Dit weekend",
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <View className="flex-1 bg-black/40 justify-end">

                <View className="bg-white rounded-t-3xl p-6 h-[80%]">

                    {/* Top Handle */}

                    <View className="self-center w-12 h-1.5 rounded-full bg-gray-300 mb-6"/>

                    {/* Header */}

                    <View className="flex-row justify-between items-center mb-8">

                        <Text className="text-2xl font-bold text-darkBlue">
                            Filters
                        </Text>

                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-3xl text-darkBlue">
                                ✕
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <Text className="font-bold text-darkBlue mb-4">
                        ONDERWERP
                    </Text>

                    <View className="flex-row flex-wrap">

                        {topics.map((topic) => (
                            <FilterChip
                                key={topic}
                                label={topic}
                                selected={selectedTopic === topic}
                                onPress={() =>
                                    setSelectedTopic(topic)
                                }
                            />
                        ))}

                    </View>

                    <Text className="font-bold text-darkBlue mt-6 mb-4">
                        WANNEER
                    </Text>

                    <View className="flex-row flex-wrap">

                        {times.map((time) => (
                            <FilterChip
                                key={time}
                                label={time}
                                selected={selectedTime === time}
                                onPress={() =>
                                    setSelectedTime(time)
                                }
                            />
                        ))}

                    </View>

                    <View className="flex-1"/>

                    <View className="flex-row justify-between">

                        <TouchableOpacity
                            className="bg-purple rounded-xl py-4 flex-1 mr-2"
                            onPress={() => {
                                setSelectedTopic(null);
                                setSelectedTime(null);
                            }}
                        >
                            <Text className="text-white text-center font-bold">
                                Wissen
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-darkBlue rounded-xl py-4 flex-1 ml-2"
                            onPress={onClose}
                        >
                            <Text className="text-white text-center font-bold">
                                Toon resultaten
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>

        </Modal>
    );
}
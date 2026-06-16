import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
} from "react-native";
import FilterChip from "./FilterChip";

export default function FilterModal({
                                        visible,
                                        onClose,
                                        selectedTopic,
                                        setSelectedTopic,
                                        selectedAssignment,
                                        setSelectedAssignment,
                                        selectedMoment,
                                        setSelectedMoment,
                                        topics,
                                        assignments,
                                        moments,
                                        onApplyFilters,
                                        onClearFilters,
                                    }) {

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade" // Changed to fade for consistency with HomeScreen's original modal
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable
                style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end'}}
                onPress={onClose}
            >
                <Pressable style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    padding: 24,
                    maxHeight: '80%'
                }}>
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
                                    setSelectedTopic(selectedTopic === topic ? null : topic)
                                }
                            />
                        ))}
                    </View>

                    <Text className="font-bold text-darkBlue mt-6 mb-4">
                        WANNEER
                    </Text>
                    <View className="flex-row flex-wrap">
                        {moments.map((moment) => (
                            <FilterChip
                                key={moment}
                                label={moment}
                                selected={selectedMoment === moment}
                                onPress={() => setSelectedMoment(moment)}
                            />
                        ))}
                    </View>

                    <View style={{flex: 1}}/>

                    <View className="flex-row justify-between mt-6">
                        <TouchableOpacity
                            className="bg-purple rounded-xl py-4 flex-1 mr-2"
                            onPress={onClearFilters}
                        >
                            <Text className="text-white text-center font-bold">
                                Wissen
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-darkBlue rounded-xl py-4 flex-1 ml-2"
                            onPress={onApplyFilters}
                        >
                            <Text className="text-white text-center font-bold">
                                Toon resultaten
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
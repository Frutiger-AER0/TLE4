import React from "react";
import {Modal, View, Text, TouchableOpacity, Pressable, ScrollView} from "react-native";

export default function ActionModal({visible, onClose, actionData}) {
    if (!actionData) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >

            <Pressable
                style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)'}}
                className="justify-center items-center p-6"
                onPress={onClose}
            >

                <Pressable
                    className="bg-white rounded-3xl p-6 w-full max-h-[80%] shadow-xl"
                    style={{elevation: 10}}
                >
                    <View className="flex-row justify-between items-center pb-4 mb-4 border-b border-lightPurple">
                        <Text
                            accessibilityRole="header"
                            className="text-xl font-bold text-darkBlue flex-1 pr-2"
                        >
                            {actionData.title}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            accessibilityRole="button"
                            accessibilityLabel="Sluit informatievenster"
                            className="bg-darkBlue/10 p-2 rounded-full"
                        >

                            <Text className="text-xl font-bold text-darkBlue leading-none" aria-hidden="true">✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
                        {actionData.details && actionData.details.map((section, idx) => (
                            <View key={idx} className="mb-3">
                                <Text accessibilityRole="header" className="font-bold text-darkBlue text-base mb-1">
                                    {section.header}
                                </Text>
                                <View className="flex-row items-start pl-2">
                                    <Text className="text-darkBlue mr-2 text-sm">•</Text>
                                    <Text className="text-darkBlue text-sm flex-1 italic leading-5">
                                        {section.text}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
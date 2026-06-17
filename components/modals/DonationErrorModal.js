import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';

const DonationErrorModal = ({ isVisible, onClose, message }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Pressable className="flex-1 justify-center items-center bg-black/50" onPress={onClose}>
                <Pressable className="bg-white rounded-lg p-5 w-11/12 max-w-sm items-center">
                    <Text className="text-lg font-bold mb-3 text-red-500">Fout bij doneren</Text>
                    <Text className="text-base text-darkBlue mb-5 text-center">{message}</Text>
                    <TouchableOpacity
                        className="mt-4 bg-purple py-3 px-4 rounded-lg items-center w-full"
                        onPress={onClose}
                    >
                        <Text className="text-offWhite font-semibold text-base">Sluiten</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default DonationErrorModal;
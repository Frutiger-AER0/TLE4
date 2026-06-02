import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PreviewModal({ visible, onClose, protest }) {
    const navigation = useNavigation();

    if (!protest) return null;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white p-6 rounded-t-2xl">

                    <Text className="text-2xl font-bold mb-2">{protest.title}</Text>

                    <Text className="text-gray-700 mb-1">📍 {protest.location}</Text>
                    <Text className="text-gray-700 mb-4">👥 {protest.participants} deelnemers</Text>

                    <TouchableOpacity
                        className="bg-blue-600 py-3 rounded-lg mb-3"
                        onPress={() => {
                            onClose();
                            navigation.navigate("Detail", { protest });
                        }}
                    >
                        <Text className="text-white text-center font-semibold">Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-gray-200 py-3 rounded-lg"
                        onPress={onClose}
                    >
                        <Text className="text-center font-semibold">Sluiten</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

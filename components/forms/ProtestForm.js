import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://145.24.237.86:8000/protests";

export default function ProtestForm() {
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [predictedMembers, setPredictedMembers] = useState("");
    const [link, setLink] = useState("");
    const [startTime, setStartTime] = useState(new Date());

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState("date");

    const [selectedImage, setSelectedImage] = useState(null);

    const [latitude, setLatitude] = useState("51.9225");
    const [longitude, setLongitude] = useState("4.4791");

    const [loading, setLoading] = useState(false);

    function resetForm() {
        setName("");
        setSubtitle("");
        setDescription("");
        setLocation("");
        setPredictedMembers("");
        setLink("");
        setStartTime(new Date());
        setSelectedImage(null);
        setLatitude("51.9225");
        setLongitude("4.4791");
        setShowDatePicker(false);
        setPickerMode("date");
    }

    function getFileName(uri) {
        if (!uri) {
            return `protest_${Date.now()}.jpg`;
        }

        const parts = uri.split("/");
        const fileName = parts[parts.length - 1];

        return fileName || `protest_${Date.now()}.jpg`;
    }

    function getMimeType(asset) {
        if (asset?.mimeType) {
            return asset.mimeType;
        }

        const fileName = asset?.fileName || asset?.uri || "";
        const extension = fileName.split(".").pop()?.toLowerCase();

        if (extension === "png") {
            return "image/png";
        }

        if (extension === "webp") {
            return "image/webp";
        }

        if (extension === "heic") {
            return "image/heic";
        }

        return "image/jpeg";
    }

    function formatDateForDisplay(date) {
        return date.toLocaleString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function formatDateForAPI(date) {
        return date.toISOString();
    }

    function validate() {
        if (!name.trim()) {
            Alert.alert("Validatie", "Naam is verplicht.");
            return false;
        }

        if (!subtitle.trim()) {
            Alert.alert("Validatie", "Subtitel is verplicht.");
            return false;
        }

        if (!location.trim()) {
            Alert.alert("Validatie", "Locatie is verplicht.");
            return false;
        }

        if (!predictedMembers.trim() || Number.isNaN(Number(predictedMembers))) {
            Alert.alert("Validatie", "Verwachte deelnemers moet een getal zijn.");
            return false;
        }

        if (Number(predictedMembers) < 0) {
            Alert.alert("Validatie", "Verwachte deelnemers mag niet negatief zijn.");
            return false;
        }

        if (link.trim() && !link.trim().startsWith("http")) {
            Alert.alert(
                "Validatie",
                "Gebruik een volledige link, bijvoorbeeld https://voorbeeld.nl"
            );
            return false;
        }

        if (!selectedImage) {
            Alert.alert("Validatie", "Foto is verplicht.");
            return false;
        }

        if (Number.isNaN(Number(latitude)) || Number.isNaN(Number(longitude))) {
            Alert.alert("Validatie", "Latitude en longitude moeten getallen zijn.");
            return false;
        }

        return true;
    }

    async function pickImage() {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Geen toegang",
                    "Geef toegang tot je galerij om een foto te kiezen."
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (result.canceled) {
                return;
            }

            const asset = result.assets?.[0];

            if (!asset?.uri) {
                Alert.alert("Fout", "Geen geldige afbeelding gekozen.");
                return;
            }

            setSelectedImage(asset);
        } catch (error) {
            Alert.alert("Fout", error.message || "Afbeelding kiezen mislukt.");
        }
    }

    function handleDateChange(event, selectedDate) {
        if (event?.type === "dismissed") {
            setShowDatePicker(false);
            setPickerMode("date");
            return;
        }

        if (!selectedDate) {
            return;
        }

        setStartTime(selectedDate);

        if (Platform.OS === "android") {
            if (pickerMode === "date") {
                setPickerMode("time");
                setShowDatePicker(true);
                return;
            }

            setShowDatePicker(false);
            setPickerMode("date");
            return;
        }

        if (pickerMode === "date") {
            setPickerMode("time");
            return;
        }

        setShowDatePicker(false);
        setPickerMode("date");
    }

    async function handleSubmit() {
        if (!validate()) return;

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("name", name.trim());
            formData.append("subtitle", subtitle.trim());
            formData.append("description", description.trim());
            formData.append("location", location.trim());
            formData.append(
                "predicted_members",
                String(parseInt(predictedMembers, 10) || 0)
            );
            formData.append("link", link.trim());
            formData.append("start_time", formatDateForAPI(startTime));
            formData.append("latitude", String(Number(latitude)));
            formData.append("longitude", String(Number(longitude)));

            formData.append("card_img", {
                uri: selectedImage.uri,
                name: selectedImage.fileName || getFileName(selectedImage.uri),
                type: getMimeType(selectedImage),
            });

            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            const responseText = await response.text();

            if (!response.ok) {
                Alert.alert(
                    "Aanmaken mislukt",
                    `Status ${response.status}\n${responseText.slice(0, 500)}`
                );
                return;
            }

            Alert.alert("Succes", "Protest is aangemaakt.", [
                {
                    text: "OK",
                    onPress: resetForm,
                },
            ]);
        } catch (error) {
            Alert.alert("Network error", error.message || String(error));
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView
            className="flex-1 bg-offWhite"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 20,
                paddingBottom: 130,
            }}
        >
            <View className="mb-6">
                <Text className="text-2xl font-bold text-darkBlue">
                    Nieuw protest
                </Text>

                <Text className="text-darkBlue text-sm mt-2 leading-5">
                    Maak hier een nieuwe demonstratie aan. Deze informatie wordt
                    zichtbaar op de homepage, detailpagina, agenda en kaart.
                </Text>
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Naam *
                </Text>

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-darkBlue"
                    placeholder="Bijvoorbeeld: Klimaatmars Rotterdam"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Subtitel *
                </Text>

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-darkBlue"
                    placeholder="Bijvoorbeeld: Klimaatmars Rotterdam"
                    placeholderTextColor="#9CA3AF"
                    value={subtitle}
                    onChangeText={setSubtitle}
                    editable={!loading}
                />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Beschrijving *
                </Text>

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-darkBlue"
                    placeholder="Beschrijf kort waar het protest over gaat"
                    placeholderTextColor="#9CA3AF"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    editable={!loading}
                    style={{
                        minHeight: 120,
                    }}
                />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Locatie *
                </Text>

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-darkBlue"
                    placeholder="Bijvoorbeeld: Schouwburgplein, Rotterdam"
                    placeholderTextColor="#9CA3AF"
                    value={location}
                    onChangeText={setLocation}
                    editable={!loading}
                />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Verwachte deelnemers *
                </Text>

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-darkBlue"
                    placeholder="Bijvoorbeeld: 1000"
                    placeholderTextColor="#9CA3AF"
                    value={predictedMembers}
                    onChangeText={setPredictedMembers}
                    keyboardType="number-pad"
                    editable={!loading}
                />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Link
                </Text>

                <TextInput
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-darkBlue"
                    placeholder="https://..."
                    placeholderTextColor="#9CA3AF"
                    value={link}
                    onChangeText={setLink}
                    keyboardType="url"
                    autoCapitalize="none"
                    editable={!loading}
                />
            </View>

            <View className="mb-5">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Starttijd *
                </Text>

                <TouchableOpacity
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white flex-row items-center justify-between"
                    onPress={() => {
                        setPickerMode("date");
                        setShowDatePicker(true);
                    }}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    <View className="flex-row items-center flex-1">
                        <Ionicons name="calendar-outline" size={22} color="#14213D" />

                        <Text className="ml-3 text-darkBlue">
                            {formatDateForDisplay(startTime)}
                        </Text>
                    </View>

                    <Ionicons name="chevron-down" size={22} color="#14213D" />
                </TouchableOpacity>

                {showDatePicker && (
                    <Modal transparent animationType="fade">
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "flex-end",
                                backgroundColor: "rgba(0,0,0,0.45)",
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "#F8F9FA",
                                    padding: 16,
                                    borderTopLeftRadius: 16,
                                    borderTopRightRadius: 16,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "700",
                                        color: "#14213D",
                                        marginBottom: 12,
                                    }}
                                >
                                    {pickerMode === "date" ? "Kies datum" : "Kies tijd"}
                                </Text>

                                <DateTimePicker
                                    value={startTime}
                                    mode={pickerMode}
                                    display={Platform.OS === "ios" ? "spinner" : "default"}
                                    onChange={handleDateChange}
                                />

                                <View
                                    style={{
                                        flexDirection: "row",
                                        marginTop: 16,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            padding: 13,
                                            backgroundColor: "#E6D8F5",
                                            borderRadius: 12,
                                            marginRight: 8,
                                        }}
                                        onPress={() => {
                                            setShowDatePicker(false);
                                            setPickerMode("date");
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                color: "#14213D",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Annuleren
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            padding: 13,
                                            backgroundColor: "#14213D",
                                            borderRadius: 12,
                                        }}
                                        onPress={() => {
                                            if (pickerMode === "date") {
                                                setPickerMode("time");
                                                return;
                                            }

                                            setShowDatePicker(false);
                                            setPickerMode("date");
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                color: "white",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {pickerMode === "date" ? "Volgende" : "Bevestigen"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>

            <View className="mb-5">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Foto *
                </Text>

                <TouchableOpacity
                    className="w-full border-2 border-dashed border-gray-400 rounded-xl p-4 items-center justify-center bg-white"
                    onPress={pickImage}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {selectedImage ? (
                        <View className="w-full">
                            <Image
                                source={{ uri: selectedImage.uri }}
                                style={{
                                    width: "100%",
                                    height: 180,
                                    borderRadius: 12,
                                    backgroundColor: "#E6D8F5",
                                }}
                                resizeMode="cover"
                            />

                            <View className="flex-row items-center justify-center mt-3">
                                <Ionicons name="image-outline" size={20} color="#14213D" />

                                <Text className="text-darkBlue ml-2 text-sm">
                                    Tik om foto te wijzigen
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="items-center py-4">
                            <Ionicons
                                name="cloud-upload-outline"
                                size={48}
                                color="#14213D"
                            />

                            <Text className="text-darkBlue font-semibold mt-2">
                                Foto uploaden
                            </Text>

                            <Text className="text-gray-500 text-xs mt-1">
                                Kies een afbeelding uit je galerij
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View className="mb-6">
                <Text className="text-sm font-semibold text-darkBlue mb-2">
                    Coördinaten
                </Text>

                <Text className="text-gray-600 text-xs mb-3">
                    Deze velden worden gebruikt voor de kaartpagina. Standaard staat
                    de locatie op Rotterdam.
                </Text>

                <View className="flex-row">
                    <View className="flex-1 mr-2">
                        <TextInput
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-darkBlue"
                            placeholder="Latitude"
                            placeholderTextColor="#9CA3AF"
                            value={latitude}
                            onChangeText={setLatitude}
                            keyboardType="numeric"
                            editable={!loading}
                        />
                    </View>

                    <View className="flex-1 ml-2">
                        <TextInput
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-darkBlue"
                            placeholder="Longitude"
                            placeholderTextColor="#9CA3AF"
                            value={longitude}
                            onChangeText={setLongitude}
                            keyboardType="numeric"
                            editable={!loading}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                className="bg-darkBlue rounded-xl py-4 items-center"
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white font-bold text-base">
                        Protest aanmaken
                    </Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}
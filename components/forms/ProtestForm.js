import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://145.24.237.86:8000/protests";

export default function ProtestForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [predictedMembers, setPredictedMembers] = useState("");
    const [link, setLink] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerMode, setPickerMode] = useState("date");
    const [selectedImage, setSelectedImage] = useState(null);
    const [coordinates, setCoordinates] = useState({
        latitude: 51.9225, // Default to Rotterdam
        longitude: 4.4791,
    });
    const [loading, setLoading] = useState(false);

    // --- helper to get a file:// uri that can be uploaded (handles content:// on Android) ---
    async function resolveUploadUri(uri) {
        try {
            console.log("[DEBUG] resolveUploadUri input:", uri);
            if (!uri) return null;

            // Android content URIs need copying to cache
            if (Platform.OS === "android" && uri.startsWith("content://")) {
                const filename = uri.split("/").pop() || `upload_${Date.now()}.jpg`;
                const dest = FileSystem.cacheDirectory + filename;
                console.log("[DEBUG] copying content:// to cache:", dest);
                try {
                    const { uri: copiedUri } = await FileSystem.downloadAsync(uri, dest);
                    console.log("[DEBUG] copied to:", copiedUri);
                    return copiedUri;
                } catch (e) {
                    console.warn("[WARN] downloadAsync failed:", e);
                    try {
                        await FileSystem.copyAsync({ from: uri, to: dest });
                        return dest;
                    } catch (e2) {
                        console.warn("[WARN] copyAsync also failed:", e2);
                        return uri; // last resort
                    }
                }
            }

            // file:// or http(s) URIs just return
            return uri;
        } catch (err) {
            console.error("[ERROR] resolveUploadUri error:", err);
            return uri;
        }
    }

    // --- derive mime type robustly ---
    function deriveMimeType(asset) {
        if (!asset) return "application/octet-stream";
        if (asset.mimeType) return asset.mimeType;
        if (asset.type && asset.type.includes("/")) return asset.type;
        if (asset.type === "image") {
            // infer from filename/uri
        }
        const name = asset.fileName || asset.uri || "";
        const m = name.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
        const ext = m ? m[1].toLowerCase() : null;
        switch (ext) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "heic":
                return "image/heic";
            case "webp":
                return "image/webp";
            default:
                return asset.type === "image" ? "image/jpeg" : "application/octet-stream";
        }
    }

    // --- image picker with logging ---
    const pickImage = async () => {
        try {
            console.log("[DEBUG] pickImage pressed");
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log("[DEBUG] permission result:", perm);
            const granted = perm?.granted ?? perm?.status === "granted";
            if (!granted) {
                Alert.alert("Permission denied", "Allow photo library access to pick an image.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
            });

            console.log("[DEBUG] picker result:", result);
            if (result.canceled) {
                console.log("[DEBUG] user canceled picker");
                return;
            }
            const asset = result.assets && result.assets[0] ? result.assets[0] : result;
            console.log("[DEBUG] selected asset:", asset);
            setSelectedImage(asset);
        } catch (err) {
            console.error("[ERROR] pickImage failed:", err);
            Alert.alert("Error", "Failed to pick image: " + (err?.message || String(err)));
        }
    };

    // --- date/time picker handling (keeps same behavior you had) ---
    const handleDateChange = (event, selectedDate) => {
        if (event?.type === "dismissed") {
            setShowDatePicker(false);
            setPickerMode("date");
            return;
        }
        if (selectedDate) {
            setStartTime(selectedDate);
            if (pickerMode === "date") {
                setPickerMode("time");
            } else {
                setShowDatePicker(false);
                setPickerMode("date");
            }
        }
    };

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setCoordinates({ latitude, longitude });
        // Optional: reverse geocode here if you want to automatically fill the Location text field
        console.log("[DEBUG] Map pressed:", latitude, longitude);
    };

    function formatDateForAPI(date) {
        return date.toISOString();
    }

    function validate() {
        if (!name.trim()) { Alert.alert("Validatie", "Naam is verplicht"); return false; }
        if (!description.trim()) { Alert.alert("Validatie", "Beschrijving is verplicht"); return false; }
        if (!location.trim()) { Alert.alert("Validatie", "Locatie is verplicht"); return false; }
        if (!predictedMembers.trim() || isNaN(predictedMembers)) { Alert.alert("Validatie", "Verwachte leden moet een getal zijn"); return false; }
        if (!selectedImage) { Alert.alert("Validatie", "Foto is verplicht"); return false; }
        return true;
    }

    // --- main submit: copies file if needed, sets proper mime, no Content-Type header ---
    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            console.log("[DEBUG] submit start", { name, description, location, predictedMembers, link, startTime });
            console.log("[DEBUG] selectedImage before upload:", selectedImage);

            let uploadUri = selectedImage?.uri;
            uploadUri = await resolveUploadUri(uploadUri);
            console.log("[DEBUG] resolved uploadUri:", uploadUri);

            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("description", description.trim());
            formData.append("location", location.trim());
            formData.append("predicted_members", String(parseInt(predictedMembers, 10) || 0));
            formData.append("link", link.trim());
            formData.append("start_time", formatDateForAPI(startTime));
            formData.append("latitude", String(coordinates.latitude));
            formData.append("longitude", String(coordinates.longitude));

            if (uploadUri) {
                const filename = uploadUri.split("/").pop();
                const mimeType = deriveMimeType(selectedImage);
                console.log("[DEBUG] appending file:", { uploadUri, filename, mimeType });
                formData.append("card_img", {
                    uri: uploadUri,
                    name: filename,
                    type: mimeType,
                });
            }

            console.log("[DEBUG] FormData contents before sending:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            // debug: try httpbin first if you want to confirm device multipart works
            // const testResp = await fetch("https://httpbin.org/post", { method: "POST", body: formData });
            // console.log("[DEBUG] httpbin test status", testResp.status);

            console.log("[DEBUG] posting to API_URL:", API_URL);
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            console.log("[DEBUG] response object:", response);
            console.log("[DEBUG] response.ok:", response.ok, "status:", response.status);
            const text = await response.text();
            console.log("[DEBUG] response text (truncated):", text?.slice(0, 2000));

            if (!response.ok) {
                Alert.alert("Upload failed", `Status ${response.status}\n${text?.slice(0, 500)}`);
                return;
            }

            Alert.alert("Succes", "Protest aangemaakt!");
        } catch (err) {
            console.error("[ERROR] submit failed:", err);
            Alert.alert("Network error", err?.message || String(err));
        } finally {
            setLoading(false);
        }
    };

    // --- debug helpers (buttons call these) ---
    async function testConnectivity() {
        try {
            console.log("[TEST] public fetch");
            const pr = await fetch("https://jsonplaceholder.typicode.com/todos/1");
            console.log("[TEST] public status:", pr.status);
            console.log("[TEST] public body:", await pr.json());
        } catch (e) {
            console.error("[TEST] public fetch error:", e);
        }

        try {
            console.log("[TEST] server GET:", API_URL);
            const sr = await fetch(API_URL);
            console.log("[TEST] server GET status:", sr.status);
            console.log("[TEST] server GET body (truncated):", (await sr.text()).slice(0, 2000));
        } catch (e) {
            console.error("[TEST] server GET error:", e);
        }
    }

    async function testHttpBinUpload() {
        try {
            const tf = new FormData();
            tf.append("name", "test-upload");
            tf.append("description", "test");
            if (selectedImage?.uri) {
                const uri = selectedImage.uri;
                const name = uri.split("/").pop();
                const type = deriveMimeType(selectedImage);
                console.log("[TEST] httpbin will attach:", { uri, name, type });
                tf.append("card_img", { uri, name, type });
            }
            const resp = await fetch("https://httpbin.org/post", { method: "POST", body: tf });
            console.log("[TEST] httpbin status:", resp.status);
            const txt = await resp.text();
            console.log("[TEST] httpbin resp (truncated):", txt.slice(0, 2000));
        } catch (e) {
            console.error("[TEST] httpbin failed:", e);
        }
    }

    // ---- JSX ----
    return (
        <ScrollView className="flex-1 bg-offWhite px-6 py-4">
            <Text className="text-2xl font-bold text-darkBlue mb-6">Nieuw Protest</Text>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">Naam *</Text>
                <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white" placeholder="Protestnaam" value={name} onChangeText={setName} editable={!loading} />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">Beschrijving *</Text>
                <TextInput className="w-full border border-gray-300 rounded-md px-3 py-3 bg-white text-top" placeholder="Beschrijf het protest" value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" editable={!loading} />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">Locatie *</Text>
                <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white" placeholder="Locatie" value={location} onChangeText={setLocation} editable={!loading} />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">Verwachte leden *</Text>
                <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white" placeholder="0" value={predictedMembers} onChangeText={setPredictedMembers} keyboardType="number-pad" editable={!loading} />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-semibold text-darkBlue mb-2">Link</Text>
                <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white" placeholder="https://..." value={link} onChangeText={setLink} keyboardType="url" editable={!loading} />
            </View>

            <View className="mb-6">
                <Text className="text-sm font-semibold text-darkBlue mb-2">Starttijd *</Text>
                <TouchableOpacity className="w-full border border-gray-300 rounded-md px-3 py-3 bg-white flex-row items-center justify-between" onPress={() => { setShowDatePicker(true); setPickerMode("date"); }} disabled={loading}>
                    <View className="flex-row items-center flex-1">
                        <Ionicons name="calendar" size={20} color="#14213D" />
                        <Text className="ml-3 text-gray-700">{startTime.toLocaleString()}</Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color="#14213D" />
                </TouchableOpacity>
                {showDatePicker && (
                    <Modal transparent={true} animationType="fade">
                        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
                            <View style={{ backgroundColor: "#F8F9FA", padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                                <DateTimePicker value={startTime} mode={pickerMode} display={Platform.OS === "ios" ? "spinner" : "default"} onChange={handleDateChange} />
                                <View style={{ flexDirection: "row", marginTop: 12 }}>
                                    <TouchableOpacity style={{ flex: 1, padding: 12, backgroundColor: "#ddd", borderRadius: 8, marginRight: 8 }} onPress={() => { setShowDatePicker(false); setPickerMode("date"); }}>
                                        <Text style={{ textAlign: "center" }}>Annuleren</Text>
                                    </TouchableOpacity>
                                    {pickerMode === "time" && (
                                        <TouchableOpacity style={{ flex: 1, padding: 12, backgroundColor: "#14213D", borderRadius: 8 }} onPress={() => { setShowDatePicker(false); setPickerMode("date"); }}>
                                            <Text style={{ textAlign: "center", color: "white" }}>Bevestigen</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>

            <View className="mb-6">
                <Text className="text-sm font-semibold text-darkBlue mb-2">Foto *</Text>
                <TouchableOpacity className="w-full border-2 border-dashed border-gray-400 rounded-md p-6 items-center justify-center bg-gray-50" onPress={pickImage} disabled={loading}>
                    {selectedImage ? (
                        <View style={{ alignItems: "center" }}>
                            <Ionicons name="image" size={32} color="#14213D" />
                            <Text style={{ marginTop: 8 }}>{(selectedImage.fileName || selectedImage.uri?.split("/").pop())}</Text>
                        </View>
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <Ionicons name="cloud-upload-outline" size={48} color="#14213D" />
                            <Text style={{ marginTop: 8 }}>Foto uploaden</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View className="mb-6">
                <Text className="text-sm font-semibold text-darkBlue mb-2">Locatie op de kaart selecteren *</Text>
                <View className="h-64 w-full rounded-md overflow-hidden border border-gray-300">
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                        onPress={handleMapPress}
                    >
                        <Marker
                            coordinate={coordinates}
                            draggable
                            onDragEnd={handleMapPress}
                        />
                    </MapView>
                </View>
                <Text className="text-[10px] text-gray-500 mt-1">Tik op de kaart of sleep de marker om de exacte locatie te bepalen.</Text>
            </View>

            <TouchableOpacity style={{ backgroundColor: "#14213D", padding: 12, borderRadius: 8, marginBottom: 12 }} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>Protest aanmaken</Text>}
            </TouchableOpacity>

            {/* DEBUG buttons */}
            <TouchableOpacity style={{ backgroundColor: "#888", padding: 12, borderRadius: 8, marginBottom: 8 }} onPress={testConnectivity}>
                <Text style={{ textAlign: "center", color: "#fff" }}>Test Connectivity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: "#555", padding: 12, borderRadius: 8 }} onPress={testHttpBinUpload}>
                <Text style={{ textAlign: "center", color: "#fff" }}>Test httpbin Upload</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
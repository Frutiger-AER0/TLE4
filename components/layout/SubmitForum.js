import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://145.24.237.86:8000";
const DEMO_MODE = true; // Zet op 'true' voor demo, 'false' voor live API calls.

export default function SubmitForum({ protest, onUploadComplete }) {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function getCurrentUserId() {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return 1; // Fallback voor MVP
      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser?.id || parsedUser?.user_id || parsedUser?.user?.id || 1;
      return id;
    } catch (error) {
      console.log("getCurrentUserId error:", error.message);
      return 1;
    }
  }

  function getFileName(file) {
    if (!file?.uri) return `support_upload_${Date.now()}.jpg`;
    return file.fileName || file.uri.split("/").pop() || `support_upload_${Date.now()}.jpg`;
  }

  async function pickFile() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Toestemming nodig", "We hebben toestemming nodig om toegang te krijgen tot je mediabibliotheek.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        Alert.alert("Fout", "Geen geldig bestand gekozen.");
        return;
      }
      setSelectedFile(asset);
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Fout", "Er ging iets mis bij het openen van de mediabibliotheek.");
    }
  }

  // Functie om een gesimuleerde upload voor de demo uit te voeren
  async function handleDemoUpload() {
    setUploading(true);
    console.log("DEMO MODE: Simulating upload...");

    // Simuleer een netwerkvertraging
    setTimeout(() => {
      Alert.alert('Success (Demo)', 'Bestand succesvol geüpload!');
      setSelectedFile(null);
      setIsChecked(false);
      setUploading(false);

      if (onUploadComplete) {
        onUploadComplete();
      }
    }, 1500);
  }

  async function handleUpload() {
    if (!selectedFile) {
      Alert.alert("Geen bestand", "Selecteer eerst een bestand om te uploaden.");
      return;
    }
    if (!isChecked) {
      Alert.alert("Voorwaarden", "Je moet akkoord gaan met de voorwaarden voordat je kunt verzenden.");
      return;
    }

    // Als DEMO_MODE aan staat, voer de nep-upload uit en stop
    if (DEMO_MODE) {
      handleDemoUpload();
      return;
    }

    // --- Live API Call ---
    const protestId = protest?.id || protest?.protest_id || protest?.protestProjectId;
    if (!protestId) {
      Alert.alert("Fout", "Kan dit bestand niet koppelen aan een protest. Protest ID ontbreekt.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    const uriParts = selectedFile.uri.split('.');
    const fileType = uriParts[uriParts.length - 1] || 'jpg';

    formData.append('file', {
      uri: selectedFile.uri,
      name: getFileName(selectedFile),
      type: `image/${fileType === 'png' ? 'png' : 'jpeg'}`,
    });

    const userId = await getCurrentUserId();
    formData.append('user_id', String(userId));
    formData.append('protest_id', String(protestId));

    try {
      const response = await fetch(`${API_BASE_URL}/finished_projects`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || `Server returned status ${response.status}`);
      }

      Alert.alert('Success', 'Bestand succesvol geüpload!');
      setSelectedFile(null);
      setIsChecked(false);
      
      if (onUploadComplete) {
          onUploadComplete();
      }

    } catch (error) {
      console.error('Upload error details:', error);
      Alert.alert(
          'Upload Mislukt',
          error.message || 'Er kon geen verbinding worden gemaakt of de server weigerde de data.'
      );
    } finally {
      setUploading(false);
    }
  }

  return (
      <View className="relative w-full mt-4 overflow-hidden bg-offWhite">
        {protest?.image && (
            <View className="absolute inset-0 items-center justify-center">
              <Image
                  source={protest.image}
                  style={{ width: "200%", height: "150%", opacity: 0.25 }}
                  resizeMode="cover"
              />
            </View>
        )}
        <View className="absolute top-4 right-4 z-20 items-end">
          <Text className="text-darkBlue italic font-semibold text-lg">Support</Text>
          <Text className="text-darkBlue font-semibold text-md">Thuisfront aan je zijlijn</Text>
        </View>
        <View className="p-5 pt-20 z-10 pb-10">
          <View className="bg-white/95 p-4 rounded-xl shadow-md">
            <Text className="text-xl font-bold text-darkBlue mb-2">High impact - low effort</Text>
            <Text className="text-darkBlue text-sm mb-4 leading-5">
              Upload jouw creatieve bijdrage voor dit protest. Denk aan een sticker, poster, spandoek of ander visueel ontwerp.
            </Text>
            <TouchableOpacity
                onPress={pickFile}
                className="border-2 border-dashed border-lightPurple rounded-lg h-28 items-center justify-center mb-4"
                activeOpacity={0.85}
                disabled={uploading}
            >
              <Ionicons name="attach" size={26} color="#7B2CBF" />
              <Text className="text-purple mt-2 text-center px-3" numberOfLines={1} ellipsizeMode="middle">
                {selectedFile ? getFileName(selectedFile) : "Voeg bestand toe"}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">Afbeelding uit je galerij</Text>
            </TouchableOpacity>
            <View className="flex-row items-start mt-2 mb-6">
              <TouchableOpacity
                  onPress={() => setIsChecked(!isChecked)}
                  className="mt-1"
                  activeOpacity={0.85}
                  disabled={uploading}
              >
                <Ionicons name={isChecked ? "checkbox" : "square-outline"} size={24} color="#14213D" />
              </TouchableOpacity>
              <Text className="text-darkBlue ml-3 flex-1 text-sm leading-5">
                <Text className="font-bold text-blue underline">Ik ga akkoord met de voorwaarden. </Text>
                Het schenden van de regels betekent uitsluiting van de actie.
              </Text>
            </View>
            <TouchableOpacity
                className={`py-3 rounded-full items-center shadow-sm ${isChecked && selectedFile && !uploading ? "bg-blue" : "bg-gray-400"}`}
                disabled={!isChecked || !selectedFile || uploading}
                onPress={handleUpload}
                activeOpacity={0.85}
            >
              {uploading ? (
                  <ActivityIndicator color="#F8F9FA" />
              ) : (
                  <Text className="text-offWhite font-bold text-lg">Verzend</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

const API_BASE_URL = "http://145.24.237.86:8000";

export default function SubmitForum({ protest }) {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Toestemming nodig', 'Sorry, we hebben toestemming nodig om toegang te krijgen tot je bestanden.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Fout", "Er ging iets mis bij het openen van de mediabibliotheek.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Geen bestand', 'Selecteer eerst een bestand om te uploaden.');
      return;
    }
    if (!protest?.protestProjectId) {
      Alert.alert('Fout', 'Kan dit project niet koppelen aan het protest. Protest Project ID ontbreekt.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    const uriParts = selectedFile.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: selectedFile.uri,
      name: `upload.${fileType}`,
      type: selectedFile.mimeType || `image/${fileType}`,
    });

    const MOCK_USER_ID = 1; 
    formData.append('user_id', MOCK_USER_ID.toString());
    formData.append('protest_project_id', protest.protestProjectId.toString());

    try {
      // FIX: Endpoint aangepast naar de bestaande /protest_projects route
      const response = await fetch(`${API_BASE_URL}/protest_projects`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Serverfout: ${errorText}`);
      }

      await response.json(); 
      Alert.alert('Success', 'Bestand succesvol geüpload!');
      setSelectedFile(null);
      setIsChecked(false);

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Mislukt', error.message || 'Er is iets misgegaan bij het uploaden.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="relative w-full mt-4 overflow-hidden bg-offWhite">
      <View className="absolute inset-0 items-center justify-center">
        <Image
          source={require('../../assets/palestineflag.webp')}
          style={{ width: '200%', height: '150%', opacity: 0.25 }}
          resizeMode="cover"
        />
      </View>
      <View className="absolute top-4 right-4 z-20 items-end">
        <Text className="text-darkBlue italic font-semibold text-lg">Support</Text>
        <Text className="text-darkBlue font-semibold text-md">Thuisfront aan je zijlijn</Text>
      </View>
      <View className="p-5 pt-20 z-10 pb-10">
        <View className="bg-white/95 p-4 rounded-xl shadow-md">
          <Text className="text-xl font-bold text-darkBlue mb-4">
            High impact - low effort
          </Text>

          <TouchableOpacity 
            onPress={pickFile}
            className="border-2 border-dashed border-lightPurple rounded-lg h-24 items-center justify-center mb-4"
          >
            <Ionicons name="attach" size={24} color="#7B2CBF" />
            <Text className="text-purple mt-1 text-center px-2" numberOfLines={1} ellipsizeMode="middle">
              {selectedFile ? selectedFile.uri.split('/').pop() : 'Voeg bestand toe'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-start mt-2 mb-6">
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)} className="mt-1">
              <Ionicons 
                name={isChecked ? "checkbox" : "square-outline"} 
                size={24} 
                color="#14213D" 
              />
            </TouchableOpacity>
            <Text className="text-darkBlue ml-3 flex-1 text-sm">
              <Text className="font-bold text-blue underline">Ik ga akkoord met de voorwaarden. </Text>
              Het schenden van de regels betekent uitsluiting van de actie.
            </Text>
          </View>

          <TouchableOpacity 
            className={`py-3 rounded-full items-center shadow-sm ${isChecked && selectedFile && !uploading ? 'bg-blue' : 'bg-gray-400'}`}
            disabled={!isChecked || !selectedFile || uploading}
            onPress={handleUpload}
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

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function SubmitForum() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    // Main container met offWhite background
    <View className="relative w-full mt-4 overflow-hidden bg-offWhite">
      
      {/* Background Image (200% width, 150% height, 25% opacity) */}
      <View className="absolute inset-0 items-center justify-center">
        <Image
          source={require('../../assets/palestineflag.webp')}
          style={{ width: '200%', height: '150%', opacity: 0.25 }}
          resizeMode="cover"
        />
      </View>

      {/* Top-right text overlay */}
      <View className="absolute top-4 right-4 z-20 items-end">
        <Text className="text-darkBlue italic font-semibold text-lg">Support</Text>
        <Text className="text-darkBlue font-semibold text-md">Thuisfront aan je zijlijn</Text>
      </View>

      {/* Content container met padding */}
      <View className="p-5 pt-20 z-10 pb-10">
        
        {/* White form card */}
        <View className="bg-white/95 p-4 rounded-xl shadow-md">
          <Text className="text-xl font-bold text-darkBlue mb-4">
            High impact - low effort
          </Text>

          {/* File upload area */}
          <TouchableOpacity className="border-2 border-dashed border-lightPurple rounded-lg h-24 items-center justify-center mb-4">
            <Ionicons name="attach" size={24} color="#7B2CBF" />
            <Text className="text-purple mt-1">Voeg bestand toe</Text>
          </TouchableOpacity>

          {/* Checkbox and Terms */}
          <View className="flex-row items-start mt-2 mb-6">
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)} className="mt-1">
              <Ionicons 
                name={isChecked ? "checkbox" : "square-outline"} 
                size={24} 
                color="#14213D" // darkBlue
              />
            </TouchableOpacity>
            <Text className="text-darkBlue ml-3 flex-1 text-sm">
              <Text className="font-bold text-blue underline">Ik ga akkoord met de voorwaarden. </Text>
              Het schenden van de regels betekent uitsluiting van de actie.
            </Text>
          </View>

          {/* Verzend Button */}
          <TouchableOpacity 
            className={`py-3 rounded-full items-center shadow-sm ${isChecked ? 'bg-blue' : 'bg-gray-400'}`}
            disabled={!isChecked}
          >
            <Text className="text-offWhite font-bold text-lg">Verzend</Text>
          </TouchableOpacity>
          
        </View>

      </View>
    </View>
  );
}

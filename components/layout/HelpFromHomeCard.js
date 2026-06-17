import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpFromHomeCard({ protest }) {
  // Zoek naar een 'projectNeeds' array in de protestdata.
  // Als die niet bestaat, gebruik een standaard fallback array.
  const needs = protest?.projectNeeds && Array.isArray(protest.projectNeeds)
    ? protest.projectNeeds
    : [
        "150 sticker-designs nodig.",
        "100 spandoek-designs gezocht.",
      ];

  return (
    <View className="bg-white p-5 w-full">
      <Text className="text-darkBlue text-2xl font-bold mb-2">
        Hoe kan jij helpen vanuit huis?
      </Text>
      <Text className="text-darkBlue text-sm leading-5 mb-4">
        Laat je creativiteit spreken voor dit protest. Ontwerp digitaal, veilig en privé vanaf je eigen kamer. Jouw inzendingen worden door onze partners geproduceerd en direct geleverd aan de organisatie.
      </Text>
      
      <View className="bg-darkBlue/10 p-3 rounded-lg">
        {needs.map((need, index) => (
          <View key={index} className="flex-row items-center mb-2 last:mb-0">
            <Ionicons name="ellipse" size={8} color="#14213D" className="mr-2" />
            <Text className="text-darkBlue font-semibold ml-2">
              {need}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

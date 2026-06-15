import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpFromHomeCard({ protest }) {
  // Deze data kan later dynamisch uit de protest prop komen
  const stickerDesignsNeeded = 150;
  const bannerDesignsNeeded = 100;

  return (
    // Witte achtergrond met padding
    <View className="bg-white p-5 w-full">
      <Text className="text-darkBlue text-2xl font-bold mb-2">
        Hoe kan jij helpen vanuit huis?
      </Text>
      <Text className="text-darkBlue text-sm leading-5 mb-4">
        Laat je creativiteit spreken voor dit protest. Ontwerp digitaal, veilig en privé vanaf je eigen kamer. Jouw inzendingen worden door onze partners geproduceerd en direct geleverd aan de organisatie.
      </Text>
      
      <View className="bg-darkBlue/10 p-3 rounded-lg">
        <View className="flex-row items-center mb-2">
          <Ionicons name="ellipse" size={8} color="#14213D" className="mr-2" />
          <Text className="text-darkBlue font-semibold ml-2">
            We hebben {stickerDesignsNeeded} sticker-designs nodig.
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="ellipse" size={8} color="#14213D" className="mr-2" />
          <Text className="text-darkBlue font-semibold ml-2">
            {bannerDesignsNeeded} spandoek-designs gezocht.
          </Text>
        </View>
      </View>
    </View>
  );
}

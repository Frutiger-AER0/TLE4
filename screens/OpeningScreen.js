// import {Text, TouchableOpacity, View} from "react-native";
// import React from "react";
// import AppHeader from "../components/layout/AppHeader";
// import {SafeAreaView} from "react-native-safe-area-context";
//
// export default function OpeningScreen({navigation}) {
//     return (
//         <SafeAreaView className="flex-1 bg-offWhite">
//             <AppHeader/>
//             <View className="flex-1 items-center justify-center px-6">
//                 <Text className="text-3xl font-bold mb-8 text-darkBlue">Welkom bij SupporT!</Text>
//
//                 <TouchableOpacity className="w-full max-w-md bg-blue py-3 rounded-lg items-center mb-4"
//                                   onPress={() => navigation.navigate("Login")}
//                                   accessibilityLabel="Ga naar Loginpagina">
//                     <Text className="text-offWhite text-lg font-semibold">Login</Text>
//                 </TouchableOpacity>
//
//                 <TouchableOpacity className="w-full max-w-md bg-purple py-3 rounded-lg items-center"
//                                   onPress={() => navigation.navigate("Registry")}
//                                   accessibilityLabel="Ga naar Registratiepagina">
//                     <Text className="text-offWhite text-lg font-semibold">Registreer</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };


import React, {useState, useRef} from 'react';
import {View, Text, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import AppHeader from "../components/layout/AppHeader";

const {width} = Dimensions.get('window');

const PAGES = [
    {id: '1', title: 'Welkom bij de App', desc: 'Dit is de eerste pagina.'},
    {id: '2', title: 'Ontdek Functies', desc: 'Dit is de tweede pagina met uitleg.'},
    {id: '3', title: 'Aan de Slag', desc: 'Je bent klaar om te beginnen!'},
];

export default function OpeningScreen({navigation}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const onViewableItemsChanged = useRef(({viewableItems}) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    return (
        <View className="flex-1 bg-offWhite">
            <AppHeader/>

            <View className="flex-1 justify-center items-center">
                <FlatList
                    data={PAGES}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={{width}} className="justify-center items-center p-6">
                            <Text className="text-3xl font-bold mb-4 text-darkBlue text-center">
                                {item.title}
                            </Text>
                            <Text className="text-lg text-gray-600 text-center px-4">
                                {item.desc}
                            </Text>
                        </View>
                    )}
                />

                <View className="flex-row absolute bottom-16 justify-center items-center">
                    {PAGES.map((_, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <View
                                key={index}
                                className={`h-1.5 mx-1 rounded-full ${
                                    isActive ? 'w-10 bg-blue' : 'w-7 bg-gray-300'
                                }`}
                            />
                        );
                    })}
                </View>

                {currentIndex === PAGES.length - 1 && (
                    <TouchableOpacity
                        className="absolute bottom-4 w-full max-w-md bg-purple py-3 rounded-lg items-center px-6"
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text className="text-offWhite text-lg font-semibold">Aan de slag</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
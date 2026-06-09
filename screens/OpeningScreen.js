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
import {View, Text, FlatList, Dimensions, TouchableOpacity, Image} from 'react-native';
import AppHeader from "../components/layout/AppHeader";

const {width} = Dimensions.get('window');

const PAGES = [
    {
        id: '1',
        title: 'Support de protesten in Rotterdam',
        coloredtitle: 'Op jouw manier',
        desc: 'Verbind de straat met de huiskamer.',
        coloreddesc: 'SupporT, thuisfront aan je zijlijn.',
        image: require("../assets/tle4-spandoek.avif")
    },
    {
        id: '2',
        title: 'Wat is jouw rol?',
        desc: 'Kies je rol om door te gaan',
        image: null
    },
    {
        id: '3',
        title: 'Aan de Slag',
        desc: 'Je bent klaar om te beginnen!',
        image: require("../assets/tle4-doneren-v2.avif")
    },
];

export default function OpeningScreen({navigation}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const onViewableItemsChanged = useRef(({viewableItems}) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const handleNext = () => {
        if (currentIndex < PAGES.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            navigation.navigate("Login");
        }
    };
    const handleBack = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
            });
        }
    };

    const isLastPage = currentIndex === PAGES.length - 1;

    return (
        <View className="flex-1 bg-darkBlue">
            <AppHeader/>

            <View className="flex-1 justify-center items-center">
                <FlatList
                    ref={flatListRef}
                    data={PAGES}
                    horizontal
                    pagingEnabled
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={{width}} className="justify-center p-8">
                            {item.image && (
                                <Image
                                    source={item.image}
                                    className="w-96 h-96 -mt-20 self-center"
                                    resizeMode="contain"
                                />
                            )}
                            <Text className="text-3xl font-bold mb-1 text-offWhite text-left">
                                {item.title}
                            </Text>
                            {item.coloredtitle && (
                                <Text className="text-3xl font-bold mb-8 text-yellow text-left">
                                    {item.coloredtitle}
                                </Text>
                            )}
                            <Text className="text-lg text-offWhite text-left ">
                                {item.desc}
                            </Text>
                            {item.coloreddesc && (
                                <Text className="text-lg text-yellow text-left">
                                    {item.coloreddesc}
                                </Text>
                            )}
                        </View>
                    )}
                />

                <View className="flex-row absolute top-6 justify-center items-center">
                    {PAGES.map((_, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <View
                                key={index}
                                className={`h-1.5 mx-1 rounded-full ${
                                    isActive ? 'w-32 bg-yellow' : 'w-32 bg-offWhite'
                                }`}
                            />
                        );
                    })}
                </View>

                <View className="absolute bottom-6 flex-row w-full max-w-md px-6 items-center justify-between gap-4">
                    {currentIndex > 0 ? (
                        <TouchableOpacity
                            className="bg-transparent border border-offWhite p-3 rounded-lg items-center justify-center w-14"
                            onPress={handleBack}
                        >
                            <Text className="text-offWhite text-xl font-bold">←</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="w-14"/>
                    )}

                    <TouchableOpacity
                        className={` ${isLastPage ? 'bg-purple flex-1 py-3 rounded-lg items-center' : 'bg-transparent border border-offWhite p-3 rounded-lg items-center justify-center w-14 text-offWhite text-xl font-bold'} `}
                        onPress={handleNext}
                    >
                        <Text className="text-offWhite text-lg font-semibold">
                            {isLastPage ? "Aan de slag" : "→"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
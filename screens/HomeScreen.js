// screens/HomeScreen.js

import React, {useMemo, useState, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";
import tw from "twrnc";

import PreviewModal from "../components/PreviewModal";
import FilterModal from "../components/filters/FilterModal";
import {protests, helpOptions, filterOptions} from "../data/dummydata";

export default function HomeScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const [search, setSearch] = useState("");
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedProtest, setSelectedProtest] = useState(null);

    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState("Alle");
    const [selectedMoment, setSelectedMoment] = useState("Alle");

    // Effect to set initial filter based on navigation params
    useEffect(() => {
        if (route.params?.type) {
            setSelectedAssignment(route.params.type);
        }
    }, [route.params?.type]);

    /*
        PSEUDOCODE VOOR LATER MET BACKEND:

        const [protests, setProtests] = useState([]);

        useEffect(() => {
            async function loadProtests() {
                const data = await fetchProtests();
                setProtests(data);
            }

            loadProtests();
        }, []);

        Waar fetchProtests() dan uit je API/database komt.
        De dummydata in data/dummydata.js kan dan weg.
    */

    const filteredProtests = useMemo(() => {
        return protests.filter((item) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                item.title.toLowerCase().includes(searchValue) ||
                item.description.toLowerCase().includes(searchValue) ||
                item.location.toLowerCase().includes(searchValue) ||
                item.topic.toLowerCase().includes(searchValue);

            const matchesTopic = selectedTopic ? item.topic === selectedTopic : true;

            const matchesAssignment =
                selectedAssignment === "Alle" ? true : item.type === selectedAssignment;

            /*
                PSEUDOCODE VOOR LATER:
                selectedMoment moet later gekoppeld worden aan echte start_time uit de database.
                Bijvoorbeeld:
                - Vandaag = protest.start_time is vandaag
                - Deze week = protest.start_time valt binnen deze week
                - Dit weekend = protest.start_time valt op zaterdag/zondag
            */
            const matchesMoment = selectedMoment ? true : true;

            return matchesSearch && matchesTopic && matchesAssignment && matchesMoment;
        });
    }, [search, selectedTopic, selectedAssignment, selectedMoment]);

    function goBackToActions() {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate("ActionScreen");
        }
    }

    function openPreview(item) {
        setSelectedProtest(item);
        setPreviewVisible(true);
    }

    function closePreview() {
        setPreviewVisible(false);
        setSelectedProtest(null);
    }

    function clearFilters() {
        setSelectedTopic(null);
        setSelectedAssignment("Alle");
        setSelectedMoment("Alle");
    }

    function applyFilters() {
        setFilterVisible(false);
    }

    function renderHelpOption({item}) {
        return (
            <View style={tw`flex-1 bg-[#E6D8F5] rounded-xl p-3 mr-2 min-h-24`}>
                <Text style={tw`text-[#0A1A3A] font-semibold mb-2`}>{item.title}</Text>

                {item.points.map((point, index) => (
                    <View key={index} style={tw`flex-row mb-2`}>
                        <Ionicons
                            name="caret-forward"
                            size={11}
                            color="#7B2DD2"
                            style={tw`mt-1 mr-1`}
                        />
                        <Text style={tw`text-[#0A1A3A] text-[10px] flex-1`}>
                            {point}
                        </Text>
                    </View>
                ))}
            </View>
        );
    }

    function renderProtestCard({item}) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => openPreview(item)}
                style={tw`mb-4 bg-[#E6D8F5] rounded-xl overflow-hidden`}
            >
                <View>
                    <Image
                        source={item.image}
                        style={tw`w-full h-28`}
                        resizeMode="cover"
                    />

                    <TouchableOpacity
                        onPress={() => openPreview(item)}
                        style={tw`absolute top-2 right-2 bg-[#0057B8] rounded-lg p-2`}
                    >
                        <Ionicons name="bookmark-outline" size={20} color="white"/>
                    </TouchableOpacity>
                </View>

                <View style={tw`p-3`}>
                    <Text style={tw`text-[#0A1A3A] font-semibold text-base`}>
                        {item.title}
                    </Text>

                    <Text style={tw`text-[#0A1A3A] italic text-xs mt-1`}>
                        {item.subtitle}
                    </Text>

                    <View style={tw`flex-row items-center mt-4`}>
                        <View style={tw`flex-row items-center mr-4`}>
                            <Ionicons name="location" size={13} color="#7B2DD2"/>
                            <Text style={tw`text-[#0A1A3A] text-[10px] ml-1`}>
                                {item.location}
                            </Text>
                        </View>

                        <View style={tw`flex-row items-center mr-4`}>
                            <Ionicons name="person-outline" size={13} color="#7B2DD2"/>
                            <Text style={tw`text-[#0A1A3A] text-[10px] ml-1`}>
                                {item.participants}
                            </Text>
                        </View>

                        <View style={tw`flex-row items-center`}>
                            <Ionicons name="pricetag-outline" size={13} color="#7B2DD2"/>
                            <Text style={tw`text-[#0A1A3A] text-[10px] ml-1`}>
                                {item.type}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <FlatList
                data={filteredProtests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProtestCard}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`px-5 pb-8`}
                ListHeaderComponent={
                    <View>
                        {/* Geen SupporT header meer hier, want AppHeader staat al globaal in App.js */}

                        <TouchableOpacity
                            onPress={goBackToActions}
                            style={tw`flex-row items-center mt-5 mb-4`}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="arrow-back" size={30} color="#0A1A3A"/>
                            <Text style={tw`text-[#0A1A3A] text-2xl font-bold ml-3`}>
                                Terug
                            </Text>
                        </TouchableOpacity>

                        <View style={tw`mt-3 flex-row items-center`}>
                            <TextInput
                                placeholder="zoeken..."
                                placeholderTextColor="#827095"
                                value={search}
                                onChangeText={setSearch}
                                style={tw`flex-1 bg-[#E6D8F5] rounded-xl px-4 py-3 text-[#0A1A3A]`}
                            />

                            <TouchableOpacity
                                onPress={() => setFilterVisible(true)}
                                style={tw`ml-2 bg-[#0057B8] p-3 rounded-xl`}
                            >
                                <Ionicons name="filter" size={22} color="white"/>
                            </TouchableOpacity>
                        </View>

                        <Text style={tw`text-[#0A1A3A] text-lg font-bold mt-5 mb-3`}>
                            Wat kan je doen om te helpen?
                        </Text>

                        <View style={tw`flex-row mb-6`}>
                            {helpOptions.map((item) => (
                                <View key={item.id} style={tw`flex-1`}>
                                    {renderHelpOption({item})}
                                </View>
                            ))}
                        </View>

                        <Text style={tw`text-[#0A1A3A] text-xl font-bold mb-3`}>
                            Demonstraties
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={tw`bg-[#E6D8F5] rounded-xl p-5`}>
                        <Text style={tw`text-[#0A1A3A] font-semibold`}>
                            Geen demonstraties gevonden.
                        </Text>
                        <Text style={tw`text-[#0A1A3A] text-sm mt-1`}>
                            Pas je zoekopdracht of filters aan.
                        </Text>
                    </View>
                }
            />

            <PreviewModal
                visible={previewVisible}
                onClose={closePreview}
                protest={selectedProtest}
            />

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
                selectedAssignment={selectedAssignment}
                setSelectedAssignment={setSelectedAssignment}
                selectedMoment={selectedMoment}
                setSelectedMoment={setSelectedMoment}
                topics={filterOptions.topics}
                assignments={filterOptions.assignments}
                moments={filterOptions.moments}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
            />
        </View>
    );
}
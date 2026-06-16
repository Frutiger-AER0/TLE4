// screens/HomeScreen.js

import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "twrnc";

import PreviewModal from "../components/PreviewModal";
import FilterModal from "../components/filters/FilterModal";
import { fetchProtests } from "../components/services/ProtestApi";

const MOMENT_OPTIONS = ["Alle", "Vandaag", "Deze week", "Dit weekend"];

export default function HomeScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const routeProjectType =
        route.params?.projectType ||
        route.params?.type ||
        "Alle";

    const [search, setSearch] = useState("");
    const [protests, setProtests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorText, setErrorText] = useState("");

    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedProtest, setSelectedProtest] = useState(null);

    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState("Alle");
    const [selectedMoment, setSelectedMoment] = useState("Alle");

    useEffect(() => {
        loadProtests();
    }, []);

    useEffect(() => {
        if (routeProjectType && routeProjectType !== "Alle") {
            setSelectedAssignment(normalizeAssignmentParam(routeProjectType));
        }
    }, [routeProjectType]);

    async function loadProtests() {
        try {
            setLoading(true);
            setErrorText("");

            const data = await fetchProtests();

            const sortedData = [...data].sort((a, b) => {
                if (!a.startTimeRaw && !b.startTimeRaw) return 0;
                if (!a.startTimeRaw) return 1;
                if (!b.startTimeRaw) return -1;

                return new Date(a.startTimeRaw) - new Date(b.startTimeRaw);
            });

            setProtests(sortedData);
        } catch (error) {
            console.log("HomeScreen fetchProtests error:", error.message);
            setErrorText("Demonstraties konden niet worden geladen.");
        } finally {
            setLoading(false);
        }
    }

    async function refreshProtests() {
        try {
            setRefreshing(true);
            await loadProtests();
        } finally {
            setRefreshing(false);
        }
    }

    function normalizeAssignmentParam(value) {
        if (!value) return "Alle";

        const cleanValue = value.toLowerCase();

        if (cleanValue.includes("sticker")) {
            return "Stickers";
        }

        if (cleanValue.includes("spandoek")) {
            return "Spandoek";
        }

        if (cleanValue.includes("donatie")) {
            return "Donatie";
        }

        return value;
    }

    const filterOptions = useMemo(() => {
        const topics = Array.from(
            new Set(
                protests
                    .map((item) => item.topic)
                    .filter(Boolean)
            )
        );

        const assignments = Array.from(
            new Set(
                protests
                    .map((item) => item.type)
                    .filter(Boolean)
            )
        );

        return {
            topics: topics.length > 0 ? topics : ["Algemeen"],
            assignments: ["Alle", ...assignments],
            moments: MOMENT_OPTIONS,
        };
    }, [protests]);

    const filteredProtests = useMemo(() => {
        return protests.filter((item) => {
            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                !searchValue ||
                item.title?.toLowerCase().includes(searchValue) ||
                item.description?.toLowerCase().includes(searchValue) ||
                item.location?.toLowerCase().includes(searchValue) ||
                item.topic?.toLowerCase().includes(searchValue) ||
                item.type?.toLowerCase().includes(searchValue);

            const matchesTopic =
                selectedTopic ? item.topic === selectedTopic : true;

            const matchesAssignment =
                selectedAssignment === "Alle"
                    ? true
                    : item.type?.toLowerCase() === selectedAssignment.toLowerCase();

            const matchesMoment = matchesSelectedMoment(item, selectedMoment);

            return (
                matchesSearch &&
                matchesTopic &&
                matchesAssignment &&
                matchesMoment
            );
        });
    }, [protests, search, selectedTopic, selectedAssignment, selectedMoment]);

    function matchesSelectedMoment(item, moment) {
        if (!moment || moment === "Alle") {
            return true;
        }

        if (!item.startTimeRaw) {
            return false;
        }

        const protestDate = new Date(item.startTimeRaw);

        if (Number.isNaN(protestDate.getTime())) {
            return false;
        }

        const now = new Date();

        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const endOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59
        );

        if (moment === "Vandaag") {
            return protestDate >= startOfToday && protestDate <= endOfToday;
        }

        if (moment === "Deze week") {
            const dayOfWeek = now.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

            const startOfWeek = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + mondayOffset
            );

            const endOfWeek = new Date(
                startOfWeek.getFullYear(),
                startOfWeek.getMonth(),
                startOfWeek.getDate() + 6,
                23,
                59,
                59
            );

            return protestDate >= startOfWeek && protestDate <= endOfWeek;
        }

        if (moment === "Dit weekend") {
            const dayOfWeek = now.getDay();
            const saturdayOffset = dayOfWeek === 0 ? -1 : 6 - dayOfWeek;

            const startOfWeekend = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + saturdayOffset
            );

            const endOfWeekend = new Date(
                startOfWeekend.getFullYear(),
                startOfWeekend.getMonth(),
                startOfWeekend.getDate() + 1,
                23,
                59,
                59
            );

            return protestDate >= startOfWeekend && protestDate <= endOfWeekend;
        }

        return true;
    }

    function goBackToActions() {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }

        navigation.navigate("ActionScreen");
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

    function hasActiveFilters() {
        return (
            selectedTopic ||
            selectedAssignment !== "Alle" ||
            selectedMoment !== "Alle"
        );
    }

    function renderInfoPill(icon, text) {
        return (
            <View style={tw`flex-row items-center mr-3 mb-2`}>
                <Ionicons name={icon} size={14} color="#842BD7" />

                <Text
                    numberOfLines={1}
                    style={tw`text-[#0A1A3A] text-xs ml-1 max-w-32`}
                >
                    {text}
                </Text>
            </View>
        );
    }

    function renderProtestCard({ item }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => openPreview(item)}
                style={tw`mb-5 bg-[#E6D8F5] rounded-2xl overflow-hidden`}
            >
                <View>
                    <Image
                        source={item.image}
                        style={tw`w-full h-40 bg-gray-200`}
                        resizeMode="cover"
                    />

                    <TouchableOpacity
                        onPress={() => openPreview(item)}
                        activeOpacity={0.85}
                        style={tw`absolute top-3 right-3 bg-[#0057B8] rounded-xl p-2`}
                    >
                        <Ionicons name="bookmark-outline" size={22} color="white" />
                    </TouchableOpacity>

                    {item.topic && (
                        <View
                            style={tw`absolute bottom-3 left-3 bg-[#F4C430] rounded-full px-3 py-1`}
                        >
                            <Text style={tw`text-[#0A1A3A] text-xs font-bold`}>
                                {item.topic}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={tw`p-4`}>
                    <View style={tw`flex-row items-start justify-between`}>
                        <View style={tw`flex-1 pr-3`}>
                            <Text
                                numberOfLines={2}
                                style={tw`text-[#0A1A3A] font-bold text-lg`}
                            >
                                {item.title}
                            </Text>

                            <Text
                                numberOfLines={1}
                                style={tw`text-[#0A1A3A] italic text-sm mt-1`}
                            >
                                {item.subtitle}
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward" size={24} color="#0A1A3A" />
                    </View>

                    <Text
                        numberOfLines={2}
                        style={tw`text-[#0A1A3A] text-sm mt-3 leading-5`}
                    >
                        {item.description}
                    </Text>

                    <View style={tw`flex-row flex-wrap mt-4`}>
                        {renderInfoPill(
                            "calendar-outline",
                            `${item.date} • ${item.timeStart}`
                        )}

                        {renderInfoPill("location-outline", item.location)}

                        {renderInfoPill("people-outline", item.participants)}

                        {renderInfoPill("pricetag-outline", item.type)}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    function renderHeader() {
        return (
            <View>
                <TouchableOpacity
                    onPress={goBackToActions}
                    style={tw`flex-row items-center mt-5 mb-4`}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={30} color="#0A1A3A" />

                    <Text style={tw`text-[#0A1A3A] text-2xl font-bold ml-3`}>
                        Terug
                    </Text>
                </TouchableOpacity>

                <View style={tw`bg-[#E6D8F5] rounded-2xl p-4 mb-4`}>
                    <Text style={tw`text-[#0A1A3A] text-xl font-bold`}>
                        Demonstraties vinden
                    </Text>

                    <Text style={tw`text-[#0A1A3A] text-sm mt-2 leading-5`}>
                        Zoek een protest dat bij jouw doel past. Bekijk de details,
                        datum, locatie en hoe je creatief kunt bijdragen.
                    </Text>
                </View>

                <View style={tw`flex-row items-center`}>
                    <TextInput
                        placeholder="Zoeken op naam, locatie, onderwerp..."
                        placeholderTextColor="#827095"
                        value={search}
                        onChangeText={setSearch}
                        style={tw`flex-1 bg-[#E6D8F5] rounded-xl px-4 py-3 text-[#0A1A3A]`}
                    />

                    <TouchableOpacity
                        onPress={() => setFilterVisible(true)}
                        activeOpacity={0.85}
                        style={tw`ml-2 bg-[#0057B8] p-3 rounded-xl`}
                    >
                        <Ionicons name="filter" size={22} color="white" />
                    </TouchableOpacity>
                </View>

                {hasActiveFilters() && (
                    <View style={tw`flex-row flex-wrap mt-3`}>
                        {selectedTopic && (
                            <View
                                style={tw`bg-[#F4C430] rounded-full px-3 py-1 mr-2 mb-2`}
                            >
                                <Text style={tw`text-[#0A1A3A] text-xs font-bold`}>
                                    {selectedTopic}
                                </Text>
                            </View>
                        )}

                        {selectedAssignment !== "Alle" && (
                            <View
                                style={tw`bg-[#F4C430] rounded-full px-3 py-1 mr-2 mb-2`}
                            >
                                <Text style={tw`text-[#0A1A3A] text-xs font-bold`}>
                                    {selectedAssignment}
                                </Text>
                            </View>
                        )}

                        {selectedMoment !== "Alle" && (
                            <View
                                style={tw`bg-[#F4C430] rounded-full px-3 py-1 mr-2 mb-2`}
                            >
                                <Text style={tw`text-[#0A1A3A] text-xs font-bold`}>
                                    {selectedMoment}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={clearFilters}
                            style={tw`bg-[#0A1A3A] rounded-full px-3 py-1 mb-2`}
                        >
                            <Text style={tw`text-white text-xs font-bold`}>
                                Wissen
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={tw`flex-row items-center justify-between mt-5 mb-3`}>
                    <Text style={tw`text-[#0A1A3A] text-xl font-bold`}>
                        Beschikbare demonstraties
                    </Text>

                    <Text style={tw`text-[#0A1A3A] text-sm`}>
                        {filteredProtests.length} gevonden
                    </Text>
                </View>

                {errorText ? (
                    <TouchableOpacity
                        onPress={loadProtests}
                        activeOpacity={0.85}
                        style={tw`bg-red-100 rounded-xl p-4 mb-4`}
                    >
                        <Text style={tw`text-red-700 font-bold`}>
                            {errorText}
                        </Text>

                        <Text style={tw`text-red-700 text-sm mt-1`}>
                            Tik om opnieuw te proberen.
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            {loading ? (
                <View style={tw`flex-1 items-center justify-center px-5`}>
                    <ActivityIndicator size="large" color="#0A1A3A" />

                    <Text style={tw`text-[#0A1A3A] mt-3 font-semibold`}>
                        Demonstraties laden...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProtests}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={renderProtestCard}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`px-5 pb-32`}
                    ListHeaderComponent={renderHeader}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshProtests}
                            tintColor="#0A1A3A"
                        />
                    }
                    ListEmptyComponent={
                        <View style={tw`bg-[#E6D8F5] rounded-xl p-5`}>
                            <Text style={tw`text-[#0A1A3A] font-bold`}>
                                Geen demonstraties gevonden.
                            </Text>

                            <Text style={tw`text-[#0A1A3A] text-sm mt-1 leading-5`}>
                                Pas je zoekopdracht of filters aan. Als de database leeg is,
                                voeg dan eerst protesten toe via de backend.
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setSearch("");
                                    clearFilters();
                                    loadProtests();
                                }}
                                style={tw`bg-[#0A1A3A] rounded-xl py-3 mt-4 items-center`}
                            >
                                <Text style={tw`text-white font-bold`}>
                                    Opnieuw laden
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

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
// screens/HomeScreen.js

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import {
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import tw from "twrnc";

import PreviewModal from "../components/PreviewModal";
import FilterModal from "../components/filters/FilterModal";
import { fetchProtests } from "../components/services/ProtestApi";

const MOMENT_OPTIONS = ["Alle", "Vandaag", "Deze week", "Dit weekend"];

const DEFAULT_TOPICS = [
    "Algemeen",
    "Klimaat",
    "Palestina",
    "LGBTQ",
    "Woningnood",
    "Racisme",
    "Onderwijs",
    "Zorg",
    "Dierenrechten",
];

const DEFAULT_ASSIGNMENTS = [
    "Alle",
    "Stickers",
    "Spandoek",
    "Donatie",
];

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

    const [selectedProtest, setSelectedProtest] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState("Alle");
    const [selectedMoment, setSelectedMoment] = useState("Alle");

    useEffect(() => {
        loadProtests();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const normalizedRouteAssignment = normalizeAssignmentParam(routeProjectType);

            if (normalizedRouteAssignment !== "Alle") {
                setSelectedAssignment(normalizedRouteAssignment);
            }

            if (protests.length === 0 && !loading) {
                loadProtests();
            }
        }, [routeProjectType, protests.length, loading])
    );

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

    function resetRouteProjectFilter() {
        navigation.setParams({
            type: "Alle",
            projectType: "Alle",
        });
    }

    function handleSelectedAssignmentChange(value) {
        resetRouteProjectFilter();
        setSelectedAssignment(value);
    }

    function handleSelectedTopicChange(value) {
        setSelectedTopic(value);
    }

    function handleSelectedMomentChange(value) {
        setSelectedMoment(value);
    }

    function normalizeText(value) {
        return (value || "")
            .toString()
            .toLowerCase()
            .trim();
    }

    function normalizeAssignmentParam(value) {
        const cleanValue = normalizeText(value);

        if (!cleanValue || cleanValue === "alle") {
            return "Alle";
        }

        if (cleanValue.includes("sticker")) {
            return "Stickers";
        }

        if (
            cleanValue.includes("spandoek") ||
            cleanValue.includes("spandoeken") ||
            cleanValue.includes("banner")
        ) {
            return "Spandoek";
        }

        if (
            cleanValue.includes("donatie") ||
            cleanValue.includes("doneren") ||
            cleanValue.includes("donation")
        ) {
            return "Donatie";
        }

        return value;
    }

    function getItemAssignmentText(item) {
        return [
            item.type,
            item.subtitle,
            item.projectLabel,
            item.actionTitle,
            item.actionDescription,
        ]
            .filter(Boolean)
            .join(" ");
    }

    function matchesAssignmentFilter(item, assignment) {
        const cleanAssignment = normalizeText(assignment);

        if (!cleanAssignment || cleanAssignment === "alle") {
            return true;
        }

        const itemAssignmentText = normalizeText(getItemAssignmentText(item));

        if (cleanAssignment.includes("sticker")) {
            return itemAssignmentText.includes("sticker");
        }

        if (cleanAssignment.includes("spandoek")) {
            return (
                itemAssignmentText.includes("spandoek") ||
                itemAssignmentText.includes("spandoeken") ||
                itemAssignmentText.includes("banner")
            );
        }

        if (cleanAssignment.includes("donatie")) {
            return (
                itemAssignmentText.includes("donatie") ||
                itemAssignmentText.includes("doneren") ||
                itemAssignmentText.includes("donation")
            );
        }

        return itemAssignmentText.includes(cleanAssignment);
    }

    function mergeUniqueOptions(defaultOptions, apiOptions) {
        const result = [...defaultOptions];

        apiOptions.forEach((option) => {
            if (!option) return;

            const alreadyExists = result.some((item) => {
                return normalizeText(item) === normalizeText(option);
            });

            if (!alreadyExists) {
                result.push(option);
            }
        });

        return result;
    }

    const filterOptions = useMemo(() => {
        const apiTopics = protests
            .map((item) => item.topic)
            .filter(Boolean);

        const apiAssignments = protests
            .map((item) => normalizeAssignmentParam(item.type || item.subtitle))
            .filter(Boolean)
            .filter((item) => item !== "Alle");

        return {
            topics: mergeUniqueOptions(DEFAULT_TOPICS, apiTopics),
            assignments: mergeUniqueOptions(DEFAULT_ASSIGNMENTS, apiAssignments),
            moments: MOMENT_OPTIONS,
        };
    }, [protests]);

    const filteredProtests = useMemo(() => {
        return protests.filter((item) => {
            const searchValue = normalizeText(search);

            const matchesSearch =
                !searchValue ||
                normalizeText(item.title).includes(searchValue) ||
                normalizeText(item.description).includes(searchValue) ||
                normalizeText(item.location).includes(searchValue) ||
                normalizeText(item.topic).includes(searchValue) ||
                normalizeText(item.type).includes(searchValue) ||
                normalizeText(item.subtitle).includes(searchValue);

            const matchesTopic =
                selectedTopic
                    ? normalizeText(item.topic) === normalizeText(selectedTopic)
                    : true;

            const matchesAssignment = matchesAssignmentFilter(
                item,
                selectedAssignment
            );

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
        setSelectedProtest(null);
        setPreviewVisible(false);
    }

    function clearFilters() {
        resetRouteProjectFilter();
        setSearch("");
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
            selectedMoment !== "Alle" ||
            search.trim().length > 0
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

                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#0A1A3A"
                        />
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
                        {search.trim().length > 0 && (
                            <View
                                style={tw`bg-[#F4C430] rounded-full px-3 py-1 mr-2 mb-2`}
                            >
                                <Text style={tw`text-[#0A1A3A] text-xs font-bold`}>
                                    Zoek: {search}
                                </Text>
                            </View>
                        )}

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

    function renderEmptyList() {
        if (loading) {
            return (
                <View style={tw`bg-[#E6D8F5] rounded-xl p-5 items-center`}>
                    <ActivityIndicator size="large" color="#0A1A3A" />

                    <Text style={tw`text-[#0A1A3A] mt-3 font-semibold`}>
                        Demonstraties laden...
                    </Text>
                </View>
            );
        }

        return (
            <View style={tw`bg-[#E6D8F5] rounded-xl p-5`}>
                <Text style={tw`text-[#0A1A3A] font-bold`}>
                    Geen demonstraties gevonden.
                </Text>

                <Text style={tw`text-[#0A1A3A] text-sm mt-1 leading-5`}>
                    Pas je zoekopdracht of filters aan. Als de database leeg is,
                    voeg dan eerst protesten toe via de backend.
                </Text>

                <TouchableOpacity
                    onPress={clearFilters}
                    style={tw`bg-[#0A1A3A] rounded-xl py-3 mt-4 items-center`}
                >
                    <Text style={tw`text-white font-bold`}>
                        Filters wissen
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <FlatList
                data={loading ? [] : filteredProtests}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderProtestCard}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`px-5 pb-32`}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshProtests}
                        tintColor="#0A1A3A"
                    />
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
                setSelectedTopic={handleSelectedTopicChange}
                selectedAssignment={selectedAssignment}
                setSelectedAssignment={handleSelectedAssignmentChange}
                selectedMoment={selectedMoment}
                setSelectedMoment={handleSelectedMomentChange}
                topics={filterOptions.topics}
                assignments={filterOptions.assignments}
                moments={filterOptions.moments}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
            />
        </View>
    );
}
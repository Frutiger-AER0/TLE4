// screens/AgendaScreen.js

import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

import PreviewModal from "../components/PreviewModal";
import { protests, savedActions } from "../data/dummydata";

export default function AgendaScreen() {
    const navigation = useNavigation();

    const [selectedProtest, setSelectedProtest] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const monthName = "Mei";
    const year = 2026;

    /*
        PSEUDOCODE VOOR LATER MET BACKEND:

        const [plannedProtests, setPlannedProtests] = useState([]);
        const [savedProtests, setSavedProtests] = useState([]);

        useEffect(() => {
            async function loadAgenda() {
                const response = await fetch(`/api/users/${currentUser.id}/agenda`);
                const data = await response.json();

                setPlannedProtests(data.planned_protests);
                setSavedProtests(data.saved_protests);
            }

            loadAgenda();
        }, []);

        ERD:
        - geplande demonstraties kunnen uit user_projects + protest_projects + protests komen.
        - opgeslagen acties kunnen uit user_projects komen waarbij is_finished false is.
        - start_time komt uit protest_details.
    */

    const plannedProtests = useMemo(() => {
        return protests.filter((item) => item.isPlanned);
    }, []);

    const savedProtests = useMemo(() => {
        return protests.filter((item) => item.isSaved);
    }, []);

    const markedDays = useMemo(() => {
        return protests
            .filter((item) => item.calendarMonth === monthName && item.calendarYear === year)
            .map((item) => item.calendarDay);
    }, []);

    function openPreview(protest) {
        setSelectedProtest(protest);
        setPreviewVisible(true);
    }

    function closePreview() {
        setSelectedProtest(null);
        setPreviewVisible(false);
    }

    function removePlannedProtest(protestId) {
        /*
            PSEUDOCODE VOOR LATER:

            await fetch(`/api/user-projects/${protestId}`, {
                method: "DELETE",
            });

            Daarna agenda opnieuw ophalen.
        */

        Alert.alert("Demo", `Demonstratie ${protestId} tijdelijk verwijderd.`);
    }

    function renderCalendarDays() {
        const days = [];

        /*
            Mei 2026 start op vrijdag.
            Daarom eerst 4 lege vakken.
            Dit is tijdelijk hardcoded voor het wireframe.

            PSEUDOCODE VOOR LATER:
            Gebruik een datum library of JS Date:
            const firstDay = new Date(2026, 4, 1).getDay();
        */

        const emptyStartCells = 4;
        const totalDays = 31;
        const totalCells = 35;

        for (let i = 0; i < emptyStartCells; i++) {
            days.push(
                <View
                    key={`empty-${i}`}
                    style={tw`w-[14.28%] h-16 border-2 border-[#842BD7] bg-white`}
                />
            );
        }

        for (let day = 1; day <= totalDays; day++) {
            const isMarked = markedDays.includes(day);

            days.push(
                <TouchableOpacity
                    key={day}
                    activeOpacity={0.8}
                    onPress={() => {
                        const protest = protests.find((item) => item.calendarDay === day);
                        if (protest) {
                            openPreview(protest);
                        }
                    }}
                    style={tw`w-[14.28%] h-16 border-2 border-[#842BD7] bg-white items-center justify-center`}
                >
                    <View
                        style={[
                            tw`w-11 h-11 rounded-xl items-center justify-center`,
                            isMarked ? tw`bg-[#0057B8]` : tw`bg-transparent`,
                        ]}
                    >
                        <Text style={tw`text-black text-xl font-bold`}>
                            {day}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        const remainingCells = totalCells - emptyStartCells - totalDays;

        for (let i = 0; i < remainingCells; i++) {
            days.push(
                <View
                    key={`end-empty-${i}`}
                    style={tw`w-[14.28%] h-16 border-2 border-[#842BD7] bg-white`}
                />
            );
        }

        return days;
    }

    function renderPlannedCard(item) {
        return (
            <View
                key={item.id}
                style={tw`bg-[#E6D8F5] rounded-xl p-3 mb-4 flex-row items-center`}
            >
                <Image
                    source={item.image}
                    style={tw`w-28 h-28 bg-white`}
                    resizeMode="cover"
                />

                <View style={tw`flex-1 ml-4`}>
                    <Text style={tw`text-[#0A1A3A] text-xl font-bold`}>
                        {item.title}
                    </Text>

                    <Text style={tw`text-[#842BD7] mt-2`}>
                        {item.date} - {item.timeStart}
                    </Text>

                    <Text style={tw`text-[#842BD7] mt-2`}>
                        {item.location}
                    </Text>

                    <View style={tw`flex-row mt-3`}>
                        <TouchableOpacity
                            onPress={() => openPreview(item)}
                            style={tw`flex-1 bg-[#842BD7] rounded-xl py-2 items-center mr-2`}
                        >
                            <Text style={tw`text-white`}>
                                Preview
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => removePlannedProtest(item.id)}
                            style={tw`flex-1 bg-[#0A1A3A] rounded-xl py-2 items-center ml-2`}
                        >
                            <Text style={tw`text-white`}>
                                Verwijderen
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    function renderSavedAction(item) {
        return (
            <View
                key={item.id}
                style={tw`bg-white border border-gray-300 rounded-xl px-4 py-3 mb-3 flex-row items-center`}
            >
                <View style={tw`bg-gray-200 w-11 h-11 rounded-lg items-center justify-center mr-4`}>
                    <Ionicons name="document-outline" size={24} color="#0A1A3A" />
                </View>

                <Text style={tw`flex-1 text-[#0A1A3A] font-semibold`}>
                    {item.title}
                </Text>

                <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={26} color="#0A1A3A" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`px-5 pt-3 pb-28`}
            >
                <View style={tw`bg-[#E6D8F5] rounded-xl px-5 pt-5 pb-4`}>
                    <Text style={tw`text-[#0A1A3A] text-4xl font-bold text-center`}>
                        Calendar
                    </Text>

                    <View style={tw`flex-row items-center justify-between mt-2 mb-5`}>
                        <TouchableOpacity
                            style={tw`bg-[#842BD7] w-14 h-14 rounded-xl items-center justify-center`}
                        >
                            <Ionicons name="arrow-back" size={34} color="white" />
                        </TouchableOpacity>

                        <Text style={tw`text-[#0A1A3A] text-xl font-bold`}>
                            {monthName} {year}
                        </Text>

                        <TouchableOpacity
                            style={tw`bg-[#842BD7] w-14 h-14 rounded-xl items-center justify-center`}
                        >
                            <Ionicons name="arrow-forward" size={34} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row flex-wrap`}>
                        {renderCalendarDays()}
                    </View>
                </View>

                <Text style={tw`text-[#0A1A3A] text-xl font-bold mt-4 mb-2`}>
                    Jouw geplande demonstraties
                </Text>

                {plannedProtests.length > 0 ? (
                    plannedProtests.map(renderPlannedCard)
                ) : (
                    <View style={tw`bg-[#E6D8F5] rounded-xl p-4`}>
                        <Text style={tw`text-[#0A1A3A] font-semibold`}>
                            Je hebt nog geen geplande demonstraties.
                        </Text>
                    </View>
                )}

                <Text style={tw`text-[#0A1A3A] text-xl font-bold mt-6 mb-3`}>
                    Opgeslagen acties
                </Text>

                {savedActions.map(renderSavedAction)}

                <Text style={tw`text-[#0A1A3A] text-xl font-bold mt-6 mb-3`}>
                    Opgeslagen demonstraties
                </Text>

                {savedProtests.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => navigation.navigate("Detail", { protest: item })}
                        style={tw`bg-[#E6D8F5] rounded-xl p-4 mb-3 flex-row items-center`}
                    >
                        <Image
                            source={item.image}
                            style={tw`w-16 h-16 rounded-lg`}
                            resizeMode="cover"
                        />

                        <View style={tw`flex-1 ml-4`}>
                            <Text style={tw`text-[#0A1A3A] font-bold`}>
                                {item.title}
                            </Text>

                            <Text style={tw`text-[#842BD7] text-sm mt-1`}>
                                {item.date} - {item.location}
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward" size={24} color="#0A1A3A" />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <PreviewModal
                visible={previewVisible}
                onClose={closePreview}
                protest={selectedProtest}
            />
        </View>
    );
}
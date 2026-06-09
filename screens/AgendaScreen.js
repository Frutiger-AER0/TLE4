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
import tw from "twrnc";

import PreviewModal from "../components/PreviewModal";
import { protests, savedActions } from "../data/dummydata";

const API_BASE_URL = "http://145.24.237.86:8000";

const months = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December",
];

export default function AgendaScreen() {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(4); // Mei = index 4
    const [currentYear, setCurrentYear] = useState(2026);

    const [selectedProtest, setSelectedProtest] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    /*
        BACKEND PSEUDOCODE VOOR LATER:

        const [plannedProtests, setPlannedProtests] = useState([]);
        const [savedProtests, setSavedProtests] = useState([]);
        const [savedActions, setSavedActions] = useState([]);

        useEffect(() => {
            async function loadAgenda() {
                const response = await fetch(`${API_BASE_URL}/api/agenda`);
                const data = await response.json();

                setPlannedProtests(data.plannedProtests);
                setSavedProtests(data.savedProtests);
                setSavedActions(data.savedActions);
            }

            loadAgenda();
        }, []);

        Mogelijke ERD-koppeling:

        protests:
        - id
        - name
        - description
        - location
        - predicted_members

        protest_details:
        - protest_id
        - start_time
        - link

        protest_projects:
        - protest_id
        - project_id

        user_projects:
        - user_id
        - protest_project_id
        - is_finished

        Op basis hiervan kun je:
        - geplande demonstraties tonen uit user_projects + protest_projects + protests
        - datum/tijd halen uit protest_details.start_time
        - opgeslagen demonstraties tonen waar user_projects bestaat
    */

    const currentMonthName = months[currentMonthIndex];

    const protestsInCurrentMonth = useMemo(() => {
        return protests.filter((item) => {
            return (
                item.calendarMonth === currentMonthName &&
                item.calendarYear === currentYear
            );
        });
    }, [currentMonthName, currentYear]);

    const plannedProtests = useMemo(() => {
        return protests.filter((item) => {
            return (
                item.isPlanned &&
                item.calendarMonth === currentMonthName &&
                item.calendarYear === currentYear
            );
        });
    }, [currentMonthName, currentYear]);

    const savedProtests = useMemo(() => {
        return protests.filter((item) => item.isSaved);
    }, []);

    const markedDays = useMemo(() => {
        return protestsInCurrentMonth.map((item) => item.calendarDay);
    }, [protestsInCurrentMonth]);

    function goToPreviousMonth() {
        if (currentMonthIndex === 0) {
            setCurrentMonthIndex(11);
            setCurrentYear(currentYear - 1);
            return;
        }

        setCurrentMonthIndex(currentMonthIndex - 1);
    }

    function goToNextMonth() {
        if (currentMonthIndex === 11) {
            setCurrentMonthIndex(0);
            setCurrentYear(currentYear + 1);
            return;
        }

        setCurrentMonthIndex(currentMonthIndex + 1);
    }

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
            BACKEND PSEUDOCODE VOOR LATER:

            await fetch(`${API_BASE_URL}/api/user-projects/${protestId}`, {
                method: "DELETE",
            });

            Daarna:
            - agenda opnieuw ophalen
            - of lokaal uit state verwijderen
        */

        Alert.alert("Demo", `Demonstratie ${protestId} tijdelijk verwijderd.`);
    }

    function getDaysInMonth(monthIndex, year) {
        return new Date(year, monthIndex + 1, 0).getDate();
    }

    function getFirstDayOffset(monthIndex, year) {
        /*
            JS Date:
            zondag = 0
            maandag = 1
            dinsdag = 2
            ...
            zaterdag = 6

            Voor deze agenda gebruiken we maandag als eerste kolom.
        */

        const jsDay = new Date(year, monthIndex, 1).getDay();

        if (jsDay === 0) {
            return 6;
        }

        return jsDay - 1;
    }

    function renderCalendarDays() {
        const days = [];

        const totalDays = getDaysInMonth(currentMonthIndex, currentYear);
        const emptyStartCells = getFirstDayOffset(currentMonthIndex, currentYear);

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

            const protestOnDay = protestsInCurrentMonth.find((item) => {
                return item.calendarDay === day;
            });

            days.push(
                <TouchableOpacity
                    key={day}
                    activeOpacity={0.8}
                    onPress={() => {
                        if (protestOnDay) {
                            openPreview(protestOnDay);
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
                        <Text
                            style={[
                                tw`text-xl font-bold`,
                                isMarked ? tw`text-white` : tw`text-black`,
                            ]}
                        >
                            {day}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        const totalUsedCells = emptyStartCells + totalDays;
        const remainingCells = totalUsedCells % 7 === 0 ? 0 : 7 - (totalUsedCells % 7);

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
                <TouchableOpacity
                    onPress={() => openPreview(item)}
                    activeOpacity={0.85}
                >
                    <Image
                        source={item.image}
                        style={tw`w-28 h-28 bg-white rounded-lg`}
                        resizeMode="cover"
                    />
                </TouchableOpacity>

                <View style={tw`flex-1 ml-4`}>
                    <TouchableOpacity
                        onPress={() => openPreview(item)}
                        activeOpacity={0.85}
                    >
                        <Text style={tw`text-[#0A1A3A] text-xl font-bold`}>
                            {item.title}
                        </Text>

                        <Text style={tw`text-[#842BD7] mt-2`}>
                            {item.date} - {item.timeStart}
                        </Text>

                        <Text style={tw`text-[#842BD7] mt-2`}>
                            {item.location}
                        </Text>
                    </TouchableOpacity>

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

    function renderSavedProtest(item) {
        return (
            <TouchableOpacity
                key={item.id}
                onPress={() => openPreview(item)}
                activeOpacity={0.85}
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

                    <Text style={tw`text-[#0A1A3A] text-xs mt-1`}>
                        Tik om preview te bekijken
                    </Text>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#0A1A3A" />
            </TouchableOpacity>
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
                            onPress={goToPreviousMonth}
                            style={tw`bg-[#842BD7] w-14 h-14 rounded-xl items-center justify-center`}
                        >
                            <Ionicons name="arrow-back" size={34} color="white" />
                        </TouchableOpacity>

                        <Text style={tw`text-[#0A1A3A] text-xl font-bold`}>
                            {currentMonthName} {currentYear}
                        </Text>

                        <TouchableOpacity
                            onPress={goToNextMonth}
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
                    <View style={tw`bg-[#E6D8F5] rounded-xl p-4 mb-4`}>
                        <Text style={tw`text-[#0A1A3A] font-semibold`}>
                            Geen geplande demonstraties in {currentMonthName} {currentYear}.
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

                {savedProtests.length > 0 ? (
                    savedProtests.map(renderSavedProtest)
                ) : (
                    <View style={tw`bg-[#E6D8F5] rounded-xl p-4`}>
                        <Text style={tw`text-[#0A1A3A] font-semibold`}>
                            Je hebt nog geen opgeslagen demonstraties.
                        </Text>
                    </View>
                )}
            </ScrollView>

            <PreviewModal
                visible={previewVisible}
                onClose={closePreview}
                protest={selectedProtest}
            />
        </View>
    );
}
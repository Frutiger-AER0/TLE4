// screens/AgendaScreen.js

import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

import PreviewModal from "../components/PreviewModal";
import {
    fetchUserProjects,
    fetchProtests,
    deleteUserProject,
} from "../components/services/ProtestApi";

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

const ITEMS_PER_PAGE = 10;

export default function AgendaScreen() {
    const today = new Date();

    const todayDay = today.getDate();
    const todayMonthIndex = today.getMonth();
    const todayYear = today.getFullYear();

    const [currentMonthIndex, setCurrentMonthIndex] = useState(todayMonthIndex);
    const [currentYear, setCurrentYear] = useState(todayYear);

    const [agendaItems, setAgendaItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState("");

    const [selectedProtest, setSelectedProtest] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const [activityPage, setActivityPage] = useState(0);

    const currentMonthName = months[currentMonthIndex];

    useEffect(() => {
        loadAgenda();
    }, []);

    async function loadAgenda() {
        try {
            setLoading(true);
            setErrorText("");

            const userProjects = await fetchUserProjects();

            if (userProjects.length > 0) {
                setAgendaItems(removeDuplicateItems(userProjects));
                return;
            }

            const protests = await fetchProtests();
            setAgendaItems(removeDuplicateItems(protests));
        } catch (error) {
            setErrorText("Agenda kon niet worden geladen.");
            console.log("Agenda load error:", error.message);
        } finally {
            setLoading(false);
        }
    }

    function removeDuplicateItems(items) {
        const seen = new Set();

        return items.filter((item) => {
            const uniqueKey = item.userProjectId || item.protestProjectId || item.id;

            if (!uniqueKey) {
                return true;
            }

            if (seen.has(uniqueKey)) {
                return false;
            }

            seen.add(uniqueKey);
            return true;
        });
    }

    const itemsInCurrentMonth = useMemo(() => {
        return agendaItems.filter((item) => {
            return (
                item.calendarMonthIndex === currentMonthIndex &&
                item.calendarYear === currentYear
            );
        });
    }, [agendaItems, currentMonthIndex, currentYear]);

    const markedDays = useMemo(() => {
        return itemsInCurrentMonth
            .map((item) => item.calendarDay)
            .filter(Boolean);
    }, [itemsInCurrentMonth]);

    const sortedActivities = useMemo(() => {
        return [...agendaItems].sort((a, b) => {
            if (!a.startTimeRaw && !b.startTimeRaw) return 0;
            if (!a.startTimeRaw) return 1;
            if (!b.startTimeRaw) return -1;

            return new Date(a.startTimeRaw) - new Date(b.startTimeRaw);
        });
    }, [agendaItems]);

    const totalActivityPages = Math.max(
        1,
        Math.ceil(sortedActivities.length / ITEMS_PER_PAGE)
    );

    const visibleActivities = useMemo(() => {
        const start = activityPage * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        return sortedActivities.slice(start, end);
    }, [sortedActivities, activityPage]);

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

    function goToToday() {
        setCurrentMonthIndex(todayMonthIndex);
        setCurrentYear(todayYear);
    }

    function goToNextActivityPage() {
        if (activityPage < totalActivityPages - 1) {
            setActivityPage(activityPage + 1);
        }
    }

    function goToPreviousActivityPage() {
        if (activityPage > 0) {
            setActivityPage(activityPage - 1);
        }
    }

    function openPreview(protest) {
        setSelectedProtest(protest);
        setPreviewVisible(true);
    }

    function closePreview() {
        setSelectedProtest(null);
        setPreviewVisible(false);
    }

    async function removeActivity(item) {
        try {
            if (!item.userProjectId) {
                Alert.alert(
                    "Niet mogelijk",
                    "Dit item heeft nog geen user_project id."
                );
                return;
            }

            await deleteUserProject(item.userProjectId);
            await loadAgenda();
        } catch (error) {
            Alert.alert("Fout", "Item kon niet worden verwijderd.");
            console.log("deleteUserProject error:", error.message);
        }
    }

    function getDaysInMonth(monthIndex, year) {
        return new Date(year, monthIndex + 1, 0).getDate();
    }

    function getFirstDayOffset(monthIndex, year) {
        const jsDay = new Date(year, monthIndex, 1).getDay();

        if (jsDay === 0) {
            return 6;
        }

        return jsDay - 1;
    }

    function getActivityTypeLabel(item) {
        if (item.isPlanned) {
            return "Geplande demonstratie";
        }

        if (item.isSaved) {
            return "Opgeslagen demonstratie";
        }

        return "Demonstratie";
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
            const itemOnDay = itemsInCurrentMonth.find((item) => {
                return item.calendarDay === day;
            });

            const isMarked = markedDays.includes(day);

            const isToday =
                day === todayDay &&
                currentMonthIndex === todayMonthIndex &&
                currentYear === todayYear;

            days.push(
                <TouchableOpacity
                    key={day}
                    activeOpacity={0.8}
                    onPress={() => {
                        if (itemOnDay) {
                            openPreview(itemOnDay);
                        }
                    }}
                    style={[
                        tw`w-[14.28%] h-16 border-2 border-[#842BD7] items-center justify-center`,
                        isToday ? tw`bg-[#F4C430]` : tw`bg-white`,
                    ]}
                >
                    <View
                        style={[
                            tw`w-11 h-11 rounded-xl items-center justify-center`,
                            isToday
                                ? tw`bg-transparent`
                                : isMarked
                                    ? tw`bg-[#0057B8]`
                                    : tw`bg-transparent`,
                        ]}
                    >
                        <Text
                            style={[
                                tw`text-xl font-bold`,
                                isToday
                                    ? tw`text-[#0A1A3A]`
                                    : isMarked
                                        ? tw`text-white`
                                        : tw`text-black`,
                            ]}
                        >
                            {day}
                        </Text>

                        {isToday && (
                            <View
                                style={tw`absolute bottom-1 w-6 h-1 rounded-full bg-[#0A1A3A]`}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            );
        }

        const totalUsedCells = emptyStartCells + totalDays;
        const remainingCells =
            totalUsedCells % 7 === 0 ? 0 : 7 - (totalUsedCells % 7);

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

    function renderActivityItem(item, index) {
        const number = activityPage * ITEMS_PER_PAGE + index + 1;

        return (
            <TouchableOpacity
                key={`${item.userProjectId || item.protestProjectId || item.id}-${index}`}
                onPress={() => openPreview(item)}
                activeOpacity={0.85}
                style={tw`bg-[#E6D8F5] rounded-xl p-4 mb-3 flex-row items-center`}
            >
                <Text style={tw`text-[#0A1A3A] font-bold mr-3`}>
                    {number}.
                </Text>

                <Image
                    source={item.image}
                    style={tw`w-16 h-16 rounded-lg bg-white`}
                    resizeMode="cover"
                />

                <View style={tw`flex-1 ml-4`}>
                    <Text style={tw`text-[#0A1A3A] font-bold`}>
                        {item.title}
                    </Text>

                    <Text style={tw`text-[#842BD7] text-sm mt-1`}>
                        {item.date} - {item.timeStart}
                    </Text>

                    <Text style={tw`text-[#842BD7] text-sm mt-1`}>
                        {item.location}
                    </Text>

                    <Text style={tw`text-[#0A1A3A] text-xs mt-1`}>
                        {getActivityTypeLabel(item)}
                    </Text>
                </View>

                <View style={tw`items-center`}>
                    <Ionicons name="bookmark-outline" size={24} color="#0A1A3A" />

                    <TouchableOpacity
                        onPress={() => removeActivity(item)}
                        style={tw`mt-3`}
                    >
                        <Ionicons name="trash-outline" size={22} color="#0A1A3A" />
                    </TouchableOpacity>
                </View>
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
                        Kalender
                    </Text>

                    <View style={tw`flex-row items-center justify-between mt-2 mb-3`}>
                        <TouchableOpacity
                            onPress={goToPreviousMonth}
                            style={tw`bg-[#842BD7] w-14 h-14 rounded-xl items-center justify-center`}
                        >
                            <Ionicons name="arrow-back" size={34} color="white" />
                        </TouchableOpacity>

                        <View style={tw`items-center`}>
                            <Text style={tw`text-[#0A1A3A] text-xl font-bold`}>
                                {currentMonthName} {currentYear}
                            </Text>

                            <TouchableOpacity
                                onPress={goToToday}
                                activeOpacity={0.85}
                                style={tw`mt-2 bg-[#F4C430] rounded-full px-4 py-1`}
                            >
                                <Text style={tw`text-[#0A1A3A] text-xs font-bold`}>
                                    Vandaag: {todayDay} {months[todayMonthIndex]}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={goToNextMonth}
                            style={tw`bg-[#842BD7] w-14 h-14 rounded-xl items-center justify-center`}
                        >
                            <Ionicons name="arrow-forward" size={34} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row justify-around mb-2 mt-2`}>
                        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((dayName) => (
                            <Text
                                key={dayName}
                                style={tw`w-[14.28%] text-center text-[#0A1A3A] font-bold`}
                            >
                                {dayName}
                            </Text>
                        ))}
                    </View>

                    <View style={tw`flex-row flex-wrap`}>
                        {renderCalendarDays()}
                    </View>
                </View>

                {loading && (
                    <View style={tw`py-6 items-center`}>
                        <ActivityIndicator size="large" color="#0A1A3A" />

                        <Text style={tw`text-[#0A1A3A] mt-2`}>
                            Agenda laden...
                        </Text>
                    </View>
                )}

                {!!errorText && (
                    <TouchableOpacity
                        onPress={loadAgenda}
                        style={tw`bg-red-100 rounded-xl p-4 mt-4`}
                    >
                        <Text style={tw`text-red-700 font-semibold`}>
                            {errorText}
                        </Text>

                        <Text style={tw`text-red-700 mt-1`}>
                            Tik om opnieuw te proberen.
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={tw`flex-row items-center justify-between mt-6 mb-3`}>
                    <Text style={tw`text-[#0A1A3A] text-xl font-bold`}>
                        Jouw activiteiten
                    </Text>

                    <Text style={tw`text-[#0A1A3A] text-sm`}>
                        Pagina {activityPage + 1} / {totalActivityPages}
                    </Text>
                </View>

                {!loading && visibleActivities.length > 0 ? (
                    visibleActivities.map(renderActivityItem)
                ) : (
                    !loading && (
                        <View style={tw`bg-[#E6D8F5] rounded-xl p-4`}>
                            <Text style={tw`text-[#0A1A3A] font-semibold`}>
                                Je hebt nog geen activiteiten.
                            </Text>
                        </View>
                    )
                )}

                {!loading && sortedActivities.length > ITEMS_PER_PAGE && (
                    <View style={tw`flex-row justify-between items-center mt-3`}>
                        <TouchableOpacity
                            onPress={goToPreviousActivityPage}
                            disabled={activityPage === 0}
                            style={[
                                tw`rounded-xl px-5 py-3 flex-row items-center`,
                                activityPage === 0 ? tw`bg-gray-300` : tw`bg-[#0A1A3A]`,
                            ]}
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />

                            <Text style={tw`text-white font-bold ml-2`}>
                                Vorige
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={goToNextActivityPage}
                            disabled={activityPage >= totalActivityPages - 1}
                            style={[
                                tw`rounded-xl px-5 py-3 flex-row items-center`,
                                activityPage >= totalActivityPages - 1
                                    ? tw`bg-gray-300`
                                    : tw`bg-[#0A1A3A]`,
                            ]}
                        >
                            <Text style={tw`text-white font-bold mr-2`}>
                                Volgende
                            </Text>

                            <Ionicons name="arrow-forward" size={22} color="white" />
                        </TouchableOpacity>
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
// screens/ProfileScreen.js

import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = "http://145.24.237.86:8000";

function getPossibleUserId(userObject) {
    if (!userObject) return null;

    return (
        userObject?.id ||
        userObject?.userId ||
        userObject?.user_id ||
        userObject?.user?.id ||
        userObject?.user?.user_id ||
        userObject?.data?.id ||
        userObject?.data?.user_id ||
        userObject?.data?.user?.id ||
        userObject?.data?.user?.user_id ||
        userObject?.userData?.id ||
        userObject?.userData?.user_id ||
        null
    );
}

function getPossibleEmail(userObject) {
    if (!userObject) return null;

    return (
        userObject?.email ||
        userObject?.user?.email ||
        userObject?.data?.email ||
        userObject?.data?.user?.email ||
        userObject?.userData?.email ||
        null
    );
}

function getPossibleUsername(userObject) {
    if (!userObject) return null;

    return (
        userObject?.username ||
        userObject?.name ||
        userObject?.user?.username ||
        userObject?.user?.name ||
        userObject?.data?.username ||
        userObject?.data?.name ||
        userObject?.data?.user?.username ||
        userObject?.data?.user?.name ||
        userObject?.userData?.username ||
        userObject?.userData?.name ||
        null
    );
}

export default function ProfileScreen({ navigation }) {
    const { user: loggedInUser, logout } = useContext(AuthContext);

    const [storedUser, setStoredUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState("");

    const activeUser = loggedInUser || storedUser;

    useEffect(() => {
        loadProfile();
    }, [loggedInUser]);

    async function getUserFromStorage() {
        const rawUser = await AsyncStorage.getItem("user");

        if (!rawUser) {
            return null;
        }

        const parsedUser = JSON.parse(rawUser);
        setStoredUser(parsedUser);

        return parsedUser;
    }

    async function findUserByEmail(email) {
        if (!email) {
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        const users = Array.isArray(data)
            ? data
            : data.data || data.users || [];

        return users.find((item) => {
            return item.email?.toLowerCase() === email.toLowerCase();
        }) || null;
    }

    async function fetchUserData(foundUserId) {
        try {
            const userDataResponse = await fetch(`${API_BASE_URL}/user-data`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!userDataResponse.ok) {
                return;
            }

            const userDataJson = await userDataResponse.json();

            const userDataList = Array.isArray(userDataJson)
                ? userDataJson
                : userDataJson.data || userDataJson.user_data || [];

            const foundUserData = userDataList.find((item) => {
                return (
                    item.user_id === foundUserId ||
                    item.user_id === Number(foundUserId)
                );
            });

            setUserData(foundUserData || null);
        } catch (error) {
            console.log("user-data endpoint niet beschikbaar:", error.message);
        }
    }

    async function loadProfile() {
        try {
            setLoading(true);
            setErrorText("");

            const userFromStorage = await getUserFromStorage();
            const userSource = loggedInUser || userFromStorage;

            let foundUserId = getPossibleUserId(userSource);
            const foundEmail = getPossibleEmail(userSource);

            let foundUser = null;

            if (!foundUserId && foundEmail) {
                foundUser = await findUserByEmail(foundEmail);
                foundUserId = getPossibleUserId(foundUser);
            }

            if (!foundUserId) {
                setErrorText(
                    "Geen gebruikers-ID gevonden. De login-response bevat waarschijnlijk alleen email/wachtwoord of geen user object."
                );
                return;
            }

            if (!foundUser) {
                const userResponse = await fetch(`${API_BASE_URL}/users/${foundUserId}`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });

                if (!userResponse.ok) {
                    throw new Error(`Gebruiker ophalen mislukt. Status: ${userResponse.status}`);
                }

                foundUser = await userResponse.json();
            }

            setProfileUser(foundUser);
            await fetchUserData(foundUserId);
        } catch (error) {
            console.log("Profile load error:", error.message);
            setErrorText(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        await logout();

        navigation.reset({
            index: 0,
            routes: [{ name: "Opening" }],
        });
    }

    function getActiveUserId() {
        return (
            getPossibleUserId(profileUser) ||
            getPossibleUserId(activeUser) ||
            "Niet gevonden"
        );
    }

    function getUsername() {
        return (
            userData?.username ||
            profileUser?.username ||
            profileUser?.name ||
            getPossibleUsername(activeUser) ||
            "Gebruiker"
        );
    }

    function getEmail() {
        return (
            profileUser?.email ||
            getPossibleEmail(activeUser) ||
            "Geen email gevonden"
        );
    }

    function getProfileImage() {
        const profileImg =
            userData?.profile_img ||
            profileUser?.profile_img ||
            activeUser?.profile_img ||
            activeUser?.user?.profile_img ||
            activeUser?.data?.user?.profile_img ||
            null;

        if (!profileImg || typeof profileImg !== "string") {
            return null;
        }

        if (profileImg.startsWith("http")) {
            return { uri: profileImg };
        }

        if (profileImg.startsWith("/")) {
            return { uri: `${API_BASE_URL}${profileImg}` };
        }

        return { uri: `${API_BASE_URL}/${profileImg}` };
    }

    if (loading) {
        return (
            <View className="flex-1 bg-offWhite items-center justify-center px-5">
                <ActivityIndicator size="large" color="#14213D" />

                <Text className="text-darkBlue text-base mt-3">
                    Profiel laden...
                </Text>
            </View>
        );
    }

    if (errorText) {
        return (
            <View className="flex-1 bg-offWhite items-center justify-center px-5">
                <Ionicons name="warning-outline" size={46} color="#842BD7" />

                <Text className="text-darkBlue text-xl font-bold mt-4 text-center">
                    Profiel kon niet worden geladen
                </Text>

                <Text className="text-darkBlue text-sm mt-2 text-center">
                    {errorText}
                </Text>

                <TouchableOpacity
                    onPress={loadProfile}
                    activeOpacity={0.85}
                    className="bg-darkBlue rounded-xl px-6 py-3 mt-5"
                >
                    <Text className="text-white font-bold">
                        Opnieuw proberen
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogout}
                    activeOpacity={0.85}
                    className="bg-lightPurple rounded-xl px-6 py-3 mt-3"
                >
                    <Text className="text-darkBlue font-bold">
                        Uitloggen
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const profileImage = getProfileImage();

    return (
        <ScrollView
            className="flex-1 bg-offWhite"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 120,
            }}
        >
            <Text className="text-darkBlue text-2xl font-bold mb-5">
                Mijn Profiel
            </Text>

            <View className="bg-lightPurple rounded-2xl p-5 items-center">
                {profileImage ? (
                    <Image
                        source={profileImage}
                        style={{
                            width: 96,
                            height: 96,
                            borderRadius: 48,
                            backgroundColor: "#ffffff",
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={{
                            width: 96,
                            height: 96,
                            borderRadius: 48,
                            backgroundColor: "#14213D",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name="person-outline" size={48} color="white" />
                    </View>
                )}

                <Text className="text-darkBlue text-2xl font-bold mt-4">
                    {getUsername()}
                </Text>

                <Text className="text-darkBlue text-sm mt-1">
                    {getEmail()}
                </Text>
            </View>

            <View className="bg-white rounded-2xl p-5 mt-5">
                <Text className="text-darkBlue text-lg font-bold mb-4">
                    Accountgegevens
                </Text>

                <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 rounded-xl bg-lightPurple items-center justify-center mr-3">
                        <Ionicons name="person-outline" size={22} color="#14213D" />
                    </View>

                    <View className="flex-1">
                        <Text className="text-darkBlue text-xs">
                            Gebruikersnaam
                        </Text>

                        <Text className="text-darkBlue font-bold">
                            {getUsername()}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 rounded-xl bg-lightPurple items-center justify-center mr-3">
                        <Ionicons name="mail-outline" size={22} color="#14213D" />
                    </View>

                    <View className="flex-1">
                        <Text className="text-darkBlue text-xs">
                            Email
                        </Text>

                        <Text className="text-darkBlue font-bold">
                            {getEmail()}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-lightPurple items-center justify-center mr-3">
                        <Ionicons name="key-outline" size={22} color="#14213D" />
                    </View>

                    <View className="flex-1">
                        <Text className="text-darkBlue text-xs">
                            Gebruikers-ID
                        </Text>

                        <Text className="text-darkBlue font-bold">
                            {getActiveUserId()}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="bg-white rounded-2xl p-5 mt-5">
                <Text className="text-darkBlue text-lg font-bold mb-3">
                    Profielstatus
                </Text>

                <Text className="text-darkBlue text-sm leading-5">
                    Dit profiel is gekoppeld aan de ingelogde gebruiker. Later kunnen hier ook interesses, pronouns, opgeslagen protesten en afgeronde creatieve projecten worden getoond.
                </Text>
            </View>

            <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.85}
                className="bg-darkBlue rounded-xl py-4 mt-6 items-center"
            >
                <Text className="text-white font-bold">
                    Uitloggen
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
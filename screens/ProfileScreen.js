// screens/ProfileScreen.js

import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
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
        null
    );
}

function getPossibleCreatedAt(userObject) {
    if (!userObject) return null;

    return (
        userObject?.created_at ||
        userObject?.createdAt ||
        userObject?.user?.created_at ||
        userObject?.data?.created_at ||
        userObject?.data?.user?.created_at ||
        null
    );
}

function getPossibleProfileImg(userObject) {
    if (!userObject) return "";

    return (
        userObject?.profile_img ||
        userObject?.profileImg ||
        userObject?.profile_image ||
        userObject?.image ||
        userObject?.user?.profile_img ||
        userObject?.data?.profile_img ||
        userObject?.data?.user?.profile_img ||
        ""
    );
}

function getPossibleIsAdmin(userObject) {
    if (!userObject) return 0;

    return (
        userObject?.is_admin ??
        userObject?.isAdmin ??
        userObject?.user?.is_admin ??
        userObject?.data?.is_admin ??
        userObject?.data?.user?.is_admin ??
        0
    );
}

function normalizeApiObject(data) {
    if (!data) {
        return null;
    }

    if (Array.isArray(data)) {
        return data[0] || null;
    }

    return (
        data?.data ||
        data?.user ||
        data?.details ||
        data?.user_details ||
        data?.userDetails ||
        data
    );
}

function formatCreatedAt(value) {
    if (!value) {
        return "Niet bekend";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Niet bekend";
    }

    return date.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function buildImageSource(imageValue) {
    if (!imageValue || typeof imageValue !== "string") {
        return null;
    }

    const cleanValue = imageValue.trim();

    if (!cleanValue) {
        return null;
    }

    if (cleanValue.startsWith("http")) {
        return { uri: cleanValue };
    }

    if (cleanValue.startsWith("/")) {
        return { uri: `${API_BASE_URL}${cleanValue}` };
    }

    return { uri: `${API_BASE_URL}/users/image/${cleanValue}` };
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const contentType = response.headers.get("content-type") || "";

    let data = null;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.detail ||
            data?.error ||
            data ||
            `Server error ${response.status}`;

        throw new Error(message.toString());
    }

    return data;
}

export default function ProfileScreen({ navigation }) {
    const { user: loggedInUser, login, logout } = useContext(AuthContext);

    const [storedUser, setStoredUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorText, setErrorText] = useState("");

    const [editMode, setEditMode] = useState(false);

    const [usernameInput, setUsernameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [profileImgInput, setProfileImgInput] = useState("");

    const [oldPasswordInput, setOldPasswordInput] = useState("");
    const [newPasswordInput, setNewPasswordInput] = useState("");
    const [repeatPasswordInput, setRepeatPasswordInput] = useState("");

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

    async function getLocalProfileImage(userId) {
        if (!userId) {
            return "";
        }

        const savedImage = await AsyncStorage.getItem(`profile_img_${userId}`);
        return savedImage || "";
    }

    async function findUserByEmail(email) {
        if (!email) {
            return null;
        }

        const data = await requestJson(`${API_BASE_URL}/users`);

        const users = Array.isArray(data)
            ? data
            : data.data || data.users || [];

        return (
            users.find((item) => {
                return item.email?.toLowerCase() === email.toLowerCase();
            }) || null
        );
    }

    async function fetchUserDetails(userId) {
        try {
            const data = await requestJson(`${API_BASE_URL}/users/${userId}/details`);
            const normalizedDetails = normalizeApiObject(data);

            setUserDetails(normalizedDetails);
            return normalizedDetails;
        } catch (error) {
            console.log("GET /users/:id/details failed:", error.message);
            setUserDetails(null);
            return null;
        }
    }

    async function updateUserMainFields(userId) {
        const body = {
            username: usernameInput.trim(),
            email: emailInput.trim(),
            is_admin: getPossibleIsAdmin(profileUser || activeUser),
        };

        if (newPasswordInput.trim()) {
            body.password = newPasswordInput.trim();
        }

        await requestJson(`${API_BASE_URL}/users/${userId}`, {
            method: "PUT",
            body: JSON.stringify(body),
        });

        const updatedUserData = await requestJson(`${API_BASE_URL}/users/${userId}`);
        return normalizeApiObject(updatedUserData);
    }

    async function updateUserDetails(userId) {
        const body = {
            profile_img: profileImgInput.trim(),
        };

        try {
            const data = await requestJson(`${API_BASE_URL}/users/${userId}/details`, {
                method: "PUT",
                body: JSON.stringify(body),
            });

            return normalizeApiObject(data);
        } catch (error) {
            console.log("PUT /users/:id/details failed:", error.message);
            return userDetails;
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
                    "Geen gebruikers-ID gevonden. Log opnieuw in of controleer de login-response."
                );
                return;
            }

            if (!foundUser) {
                const userData = await requestJson(`${API_BASE_URL}/users/${foundUserId}`);
                foundUser = normalizeApiObject(userData);
            }

            const foundUserDetails = await fetchUserDetails(foundUserId);
            const localProfileImage = await getLocalProfileImage(foundUserId);

            setProfileUser(foundUser);

            setUsernameInput(
                foundUser?.username ||
                getPossibleUsername(userSource) ||
                ""
            );

            setEmailInput(
                foundUser?.email ||
                getPossibleEmail(userSource) ||
                ""
            );

            setProfileImgInput(
                getPossibleProfileImg(foundUserDetails) ||
                getPossibleProfileImg(foundUser) ||
                localProfileImage ||
                ""
            );
        } catch (error) {
            console.log("Profile load error:", error.message);
            setErrorText(error.message);
        } finally {
            setLoading(false);
        }
    }

    function getActiveUserId() {
        return (
            getPossibleUserId(profileUser) ||
            getPossibleUserId(activeUser) ||
            null
        );
    }

    function getUsername() {
        return (
            profileUser?.username ||
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

    function getCreatedAt() {
        return (
            getPossibleCreatedAt(profileUser) ||
            getPossibleCreatedAt(activeUser) ||
            null
        );
    }

    function getCurrentProfileImage() {
        return (
            getPossibleProfileImg(userDetails) ||
            getPossibleProfileImg(profileUser) ||
            profileImgInput ||
            getPossibleProfileImg(activeUser) ||
            ""
        );
    }

    async function saveProfileChanges() {
        const userId = getActiveUserId();

        if (!userId) {
            Alert.alert("Fout", "Geen gebruiker gevonden.");
            return;
        }

        if (!usernameInput.trim()) {
            Alert.alert("Validatie", "Gebruikersnaam mag niet leeg zijn.");
            return;
        }

        if (!emailInput.trim()) {
            Alert.alert("Validatie", "Email mag niet leeg zijn.");
            return;
        }

        const wantsToChangePassword =
            oldPasswordInput.trim() ||
            newPasswordInput.trim() ||
            repeatPasswordInput.trim();

        if (wantsToChangePassword) {
            if (!oldPasswordInput.trim()) {
                Alert.alert("Validatie", "Vul je oude wachtwoord in.");
                return;
            }

            if (!newPasswordInput.trim()) {
                Alert.alert("Validatie", "Vul een nieuw wachtwoord in.");
                return;
            }

            if (!repeatPasswordInput.trim()) {
                Alert.alert("Validatie", "Herhaal je nieuwe wachtwoord.");
                return;
            }

            if (newPasswordInput.trim() !== repeatPasswordInput.trim()) {
                Alert.alert("Validatie", "De nieuwe wachtwoorden komen niet overeen.");
                return;
            }

            if (newPasswordInput.trim().length < 6) {
                Alert.alert(
                    "Validatie",
                    "Het nieuwe wachtwoord moet minimaal 6 tekens hebben."
                );
                return;
            }
        }

        try {
            setSaving(true);

            const updatedUser = await updateUserMainFields(userId);
            const updatedDetails = await updateUserDetails(userId);

            await AsyncStorage.setItem(
                `profile_img_${userId}`,
                profileImgInput.trim()
            );

            const updatedStoredUser = {
                ...(activeUser || {}),
                ...updatedUser,
                id: userId,
                username: updatedUser?.username || usernameInput.trim(),
                email: updatedUser?.email || emailInput.trim(),
                is_admin: updatedUser?.is_admin ?? getPossibleIsAdmin(activeUser),
                created_at: updatedUser?.created_at || getCreatedAt(),
                profile_img:
                    getPossibleProfileImg(updatedDetails) ||
                    profileImgInput.trim(),
            };

            await login(updatedStoredUser);

            setProfileUser(updatedUser);
            setUserDetails(updatedDetails);
            setStoredUser(updatedStoredUser);
            setEditMode(false);

            setOldPasswordInput("");
            setNewPasswordInput("");
            setRepeatPasswordInput("");

            Alert.alert("Opgeslagen", "Je profiel is bijgewerkt.");
        } catch (error) {
            console.log("saveProfileChanges error:", error.message);
            Alert.alert("Opslaan mislukt", error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleLogout() {
        await logout();

        navigation.reset({
            index: 0,
            routes: [{ name: "Opening" }],
        });
    }

    function cancelEdit() {
        setEditMode(false);
        setUsernameInput(getUsername());
        setEmailInput(getEmail());
        setProfileImgInput(getCurrentProfileImage());
        setOldPasswordInput("");
        setNewPasswordInput("");
        setRepeatPasswordInput("");
    }

    function renderAccountRow(iconName, label, value, accessibilityLabel) {
        return (
            <View
                className="flex-row items-center mb-4"
                accessible={true}
                accessibilityLabel={accessibilityLabel || `${label}: ${value}`}
            >
                <View
                    className="w-10 h-10 rounded-xl bg-lightPurple items-center justify-center mr-3"
                    accessible={false}
                    importantForAccessibility="no"
                >
                    <Ionicons
                        name={iconName}
                        size={22}
                        color="#14213D"
                        accessible={false}
                        importantForAccessibility="no"
                    />
                </View>

                <View className="flex-1">
                    <Text className="text-darkBlue text-xs">
                        {label}
                    </Text>

                    <Text className="text-darkBlue font-bold">
                        {value}
                    </Text>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View
                className="flex-1 bg-offWhite items-center justify-center px-5"
                accessible={true}
                accessibilityRole="progressbar"
                accessibilityLabel="Profiel wordt geladen"
            >
                <ActivityIndicator
                    size="large"
                    color="#14213D"
                    accessible={false}
                    importantForAccessibility="no"
                />

                <Text className="text-darkBlue text-base mt-3">
                    Profiel laden...
                </Text>
            </View>
        );
    }

    if (errorText) {
        return (
            <View className="flex-1 bg-offWhite items-center justify-center px-5">
                <Ionicons
                    name="warning-outline"
                    size={46}
                    color="#842BD7"
                    accessible={false}
                    importantForAccessibility="no"
                />

                <Text
                    className="text-darkBlue text-xl font-bold mt-4 text-center"
                    accessibilityRole="header"
                >
                    Profiel kon niet worden geladen
                </Text>

                <Text
                    className="text-darkBlue text-sm mt-2 text-center"
                    accessibilityLabel={`Foutmelding: ${errorText}`}
                >
                    {errorText}
                </Text>

                <TouchableOpacity
                    onPress={loadProfile}
                    activeOpacity={0.85}
                    className="bg-darkBlue rounded-xl px-6 py-3 mt-5 min-h-12 items-center justify-center"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Profiel opnieuw laden"
                    accessibilityHint="Probeert de profielgegevens opnieuw op te halen."
                >
                    <Text className="text-white font-bold">
                        Opnieuw proberen
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogout}
                    activeOpacity={0.85}
                    className="bg-lightPurple rounded-xl px-6 py-3 mt-3 min-h-12 items-center justify-center"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Uitloggen"
                    accessibilityHint="Logt je uit en brengt je terug naar het beginscherm."
                >
                    <Text className="text-darkBlue font-bold">
                        Uitloggen
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const profileImage = buildImageSource(
        editMode ? profileImgInput : getCurrentProfileImage()
    );

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-offWhite"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                className="flex-1 bg-offWhite"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                accessibilityLabel="Profielpagina"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 120,
                }}
            >
                <View className="flex-row items-center justify-between mb-5">
                    <Text
                        className="text-darkBlue text-2xl font-bold"
                        accessibilityRole="header"
                    >
                        Mijn Profiel
                    </Text>

                    {!editMode && (
                        <TouchableOpacity
                            onPress={() => setEditMode(true)}
                            activeOpacity={0.85}
                            className="bg-darkBlue rounded-xl px-4 py-2 min-h-11 items-center justify-center"
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Profiel bewerken"
                            accessibilityHint="Opent de bewerkmodus voor je profielgegevens."
                        >
                            <Text className="text-white font-bold">
                                Bewerken
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View
                    className="bg-lightPurple rounded-2xl p-5 items-center"
                    accessible={true}
                    accessibilityLabel={`Profiel van ${editMode ? usernameInput || "Gebruiker" : getUsername()}. Email: ${editMode ? emailInput || "Geen email" : getEmail()}. Lid sinds ${formatCreatedAt(getCreatedAt())}.`}
                >
                    {profileImage ? (
                        <Image
                            source={profileImage}
                            style={{
                                width: 108,
                                height: 108,
                                borderRadius: 54,
                                backgroundColor: "#ffffff",
                            }}
                            resizeMode="cover"
                            accessible={true}
                            accessibilityRole="image"
                            accessibilityLabel={`Profielfoto van ${editMode ? usernameInput || "Gebruiker" : getUsername()}`}
                        />
                    ) : (
                        <View
                            style={{
                                width: 108,
                                height: 108,
                                borderRadius: 54,
                                backgroundColor: "#14213D",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            accessible={true}
                            accessibilityRole="image"
                            accessibilityLabel="Standaard profielfoto"
                        >
                            <Ionicons
                                name="person-outline"
                                size={54}
                                color="white"
                                accessible={false}
                                importantForAccessibility="no"
                            />
                        </View>
                    )}

                    <Text className="text-darkBlue text-2xl font-bold mt-4">
                        {editMode ? usernameInput || "Gebruiker" : getUsername()}
                    </Text>

                    <Text className="text-darkBlue text-sm mt-1">
                        {editMode ? emailInput || "Geen email" : getEmail()}
                    </Text>

                    <Text className="text-darkBlue text-xs mt-2">
                        Lid sinds {formatCreatedAt(getCreatedAt())}
                    </Text>
                </View>

                {!editMode && (
                    <>
                        <View
                            className="bg-white rounded-2xl p-5 mt-5"
                            accessible={false}
                        >
                            <Text
                                className="text-darkBlue text-lg font-bold mb-4"
                                accessibilityRole="header"
                            >
                                Accountgegevens
                            </Text>

                            {renderAccountRow(
                                "person-outline",
                                "Gebruikersnaam",
                                getUsername()
                            )}

                            {renderAccountRow(
                                "mail-outline",
                                "Email",
                                getEmail()
                            )}

                            {renderAccountRow(
                                "calendar-outline",
                                "Account aangemaakt",
                                formatCreatedAt(getCreatedAt())
                            )}

                            {renderAccountRow(
                                "lock-closed-outline",
                                "Wachtwoord",
                                "verborgen",
                                "Wachtwoord: verborgen om veiligheidsredenen."
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={handleLogout}
                            activeOpacity={0.85}
                            className="bg-darkBlue rounded-xl py-4 mt-6 items-center min-h-12 justify-center"
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Uitloggen"
                            accessibilityHint="Logt je uit en brengt je terug naar het beginscherm."
                        >
                            <Text className="text-white font-bold">
                                Uitloggen
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {editMode && (
                    <View className="bg-white rounded-2xl p-5 mt-5">
                        <Text
                            className="text-darkBlue text-lg font-bold mb-4"
                            accessibilityRole="header"
                        >
                            Profiel bewerken
                        </Text>

                        <Text className="text-darkBlue text-sm font-bold mb-2">
                            Gebruikersnaam
                        </Text>

                        <TextInput
                            value={usernameInput}
                            onChangeText={setUsernameInput}
                            placeholder="Gebruikersnaam"
                            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-white text-darkBlue min-h-12"
                            accessible={true}
                            accessibilityLabel="Gebruikersnaam"
                            accessibilityHint="Vul hier je gebruikersnaam in."
                            returnKeyType="next"
                        />

                        <Text className="text-darkBlue text-sm font-bold mb-2">
                            Email
                        </Text>

                        <TextInput
                            value={emailInput}
                            onChangeText={setEmailInput}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-white text-darkBlue min-h-12"
                            accessible={true}
                            accessibilityLabel="Emailadres"
                            accessibilityHint="Vul hier je emailadres in."
                            returnKeyType="next"
                        />

                        <Text className="text-darkBlue text-sm font-bold mb-2">
                            Profielfoto token of URL
                        </Text>

                        <TextInput
                            value={profileImgInput}
                            onChangeText={setProfileImgInput}
                            placeholder="Bijvoorbeeld: profile_img token of https://..."
                            autoCapitalize="none"
                            className="border border-gray-300 rounded-xl px-4 py-3 mb-5 bg-white text-darkBlue min-h-12"
                            accessible={true}
                            accessibilityLabel="Profielfoto token of URL"
                            accessibilityHint="Vul de profile_img token uit de database in, of een volledige afbeelding URL."
                            returnKeyType="next"
                        />

                        <View
                            className="h-[1px] bg-gray-200 mb-5"
                            accessible={false}
                            importantForAccessibility="no"
                        />

                        <Text
                            className="text-darkBlue text-lg font-bold mb-3"
                            accessibilityRole="header"
                        >
                            Wachtwoord wijzigen
                        </Text>

                        <Text className="text-darkBlue text-xs mb-4">
                            Vul je oude wachtwoord in en kies daarna een nieuw wachtwoord.
                        </Text>

                        <TextInput
                            value={oldPasswordInput}
                            onChangeText={setOldPasswordInput}
                            placeholder="Oud wachtwoord"
                            secureTextEntry
                            className="border border-gray-300 rounded-xl px-4 py-3 mb-3 bg-white text-darkBlue min-h-12"
                            accessible={true}
                            accessibilityLabel="Oud wachtwoord"
                            accessibilityHint="Vul je oude wachtwoord in."
                            returnKeyType="next"
                        />

                        <TextInput
                            value={newPasswordInput}
                            onChangeText={setNewPasswordInput}
                            placeholder="Nieuw wachtwoord"
                            secureTextEntry
                            className="border border-gray-300 rounded-xl px-4 py-3 mb-3 bg-white text-darkBlue min-h-12"
                            accessible={true}
                            accessibilityLabel="Nieuw wachtwoord"
                            accessibilityHint="Vul je nieuwe wachtwoord in."
                            returnKeyType="next"
                        />

                        <TextInput
                            value={repeatPasswordInput}
                            onChangeText={setRepeatPasswordInput}
                            placeholder="Herhaal nieuw wachtwoord"
                            secureTextEntry
                            className="border border-gray-300 rounded-xl px-4 py-3 mb-5 bg-white text-darkBlue min-h-12"
                            accessible={true}
                            accessibilityLabel="Herhaal nieuw wachtwoord"
                            accessibilityHint="Vul je nieuwe wachtwoord nog een keer in."
                            returnKeyType="done"
                        />

                        <TouchableOpacity
                            onPress={saveProfileChanges}
                            disabled={saving}
                            activeOpacity={0.85}
                            className="bg-darkBlue rounded-xl py-4 items-center min-h-12 justify-center"
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={saving ? "Profiel wordt opgeslagen" : "Profiel opslaan"}
                            accessibilityHint="Slaat je aangepaste profielgegevens op."
                            accessibilityState={{
                                disabled: saving,
                                busy: saving,
                            }}
                        >
                            {saving ? (
                                <ActivityIndicator
                                    color="#ffffff"
                                    accessible={false}
                                    importantForAccessibility="no"
                                />
                            ) : (
                                <Text className="text-white font-bold">
                                    Opslaan
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={cancelEdit}
                            disabled={saving}
                            activeOpacity={0.85}
                            className="bg-lightPurple rounded-xl py-4 items-center mt-3 min-h-12 justify-center"
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Bewerken annuleren"
                            accessibilityHint="Sluit de bewerkmodus zonder wijzigingen op te slaan."
                            accessibilityState={{
                                disabled: saving,
                            }}
                        >
                            <Text className="text-darkBlue font-bold">
                                Annuleren
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
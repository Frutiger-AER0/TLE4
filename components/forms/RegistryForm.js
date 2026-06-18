// components/forms/RegistryForm.js

import React, { useState } from "react";
import {
    ActivityIndicator,
    Text,
    Alert,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const API_BASE_URL = "http://145.24.237.86:8000";
const REGISTER_URL = `${API_BASE_URL}/users`;

function getErrorMessage(data, status) {
    if (!data) {
        return `Server returned ${status}`;
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.detail) {
        return data.detail;
    }

    if (data.message) {
        return data.message;
    }

    if (data.error) {
        return data.error;
    }

    if (Array.isArray(data.errors)) {
        return data.errors.join("\n");
    }

    if (typeof data.errors === "object") {
        return Object.values(data.errors).flat().join("\n");
    }

    return JSON.stringify(data);
}

export default function RegistryForm({ onSuccess }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function validate() {
        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanUsername || !cleanEmail || !password || !verifyPassword) {
            Alert.alert("Validatie", "Alle velden zijn verplicht.");
            return false;
        }

        if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
            Alert.alert("Validatie", "Vul een geldig emailadres in.");
            return false;
        }

        if (password.length < 6) {
            Alert.alert(
                "Validatie",
                "Wachtwoord moet minstens 6 karakters bevatten."
            );
            return false;
        }

        if (password !== verifyPassword) {
            Alert.alert("Validatie", "Wachtwoorden komen niet overeen.");
            return false;
        }

        return true;
    }

    async function handleSubmit() {
        if (!validate()) return;

        setLoading(true);

        try {
            const cleanUsername = username.trim();
            const cleanEmail = email.trim().toLowerCase();

            const body = {
                username: cleanUsername,
                email: cleanEmail,
                password: password,
                is_admin: false,
            };

            const res = await fetch(REGISTER_URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const contentType = res.headers.get("content-type") || "";

            let data = null;

            if (contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            if (!res.ok) {
                const message = getErrorMessage(data, res.status);
                Alert.alert("Registratie mislukt", message.toString());
                return;
            }

            setUsername("");
            setEmail("");
            setPassword("");
            setVerifyPassword("");

            Alert.alert("Account aangemaakt", "Je account is succesvol aangemaakt.", [
                {
                    text: "Naar login",
                    onPress: () => onSuccess?.(data),
                },
            ]);
        } catch (error) {
            Alert.alert("Network error", error.message || String(error));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="w-full px-6">
            <Text className="text-3xl text-center font-semibold text-darkBlue mb-2">
                Registreer
            </Text>

            <TextInput
                className="w-full border border-gray-300 rounded-md px-3 py-3 mb-3 bg-white text-darkBlue"
                placeholder="Gebruikersnaam"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                editable={!loading}
            />

            <TextInput
                className="w-full border border-gray-300 rounded-md px-3 py-3 mb-3 bg-white text-darkBlue"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                editable={!loading}
            />

            <TextInput
                className="w-full border border-gray-300 rounded-md px-3 py-3 mb-3 bg-white text-darkBlue"
                placeholder="Wachtwoord"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
                editable={!loading}
            />

            <TextInput
                className="w-full border border-gray-300 rounded-md px-3 py-3 mb-4 bg-white text-darkBlue"
                placeholder="Herhaal wachtwoord"
                placeholderTextColor="#9CA3AF"
                value={verifyPassword}
                onChangeText={setVerifyPassword}
                secureTextEntry
                returnKeyType="done"
                editable={!loading}
            />

            <TouchableOpacity
                className="w-full bg-blue py-3 rounded-md items-center mb-3"
                onPress={handleSubmit}
                disabled={loading}
                accessibilityLabel="Registreer account"
                activeOpacity={0.85}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white text-base font-semibold">
                        Maak account
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
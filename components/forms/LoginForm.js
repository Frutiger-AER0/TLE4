// components/LoginForm.js

import React, { useContext, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthContext } from "../../context/AuthContext.js";

const API_BASE_URL = "http://145.24.237.86:8000";
const LOGIN_URL = `${API_BASE_URL}/login`;

function getUserFromLoginResponse(data, email) {
    /*
        Deze functie probeert de user uit verschillende mogelijke backend responses te halen.

        Mogelijke responses:
        1. { id, email, username }
        2. { user: { id, email, username } }
        3. { data: { user: { id, email, username } } }
        4. { token, user: { ... } }
        5. Alleen token zonder user
    */

    const possibleUser =
        data?.user ||
        data?.data?.user ||
        data?.data ||
        data;

    if (possibleUser && typeof possibleUser === "object") {
        return {
            ...possibleUser,
            email: possibleUser.email || email,
        };
    }

    return {
        email: email,
    };
}

async function findUserByEmail(email) {
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

    return (
        users.find((item) => {
            return item.email?.toLowerCase() === email.toLowerCase();
        }) || null
    );
}

export default function LoginForm({ onSuccess }) {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function validate() {
        if (!email.trim() || !password) {
            Alert.alert("Validatie", "Email en wachtwoord zijn verplicht");
            return false;
        }

        return true;
    }

    async function handleSubmit() {
        if (!validate()) return;

        setLoading(true);

        try {
            const cleanEmail = email.trim();

            const res = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: cleanEmail,
                    password: password,
                }),
            });

            const contentType = res.headers.get("content-type") || "";
            let data = null;

            if (contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            if (!res.ok) {
                const message =
                    data?.detail ||
                    data?.message ||
                    JSON.stringify(data) ||
                    `Server returned ${res.status}`;

                Alert.alert("Login mislukt", message.toString());
                return;
            }

            const token =
                data?.access_token ||
                data?.token ||
                data?.jwt ||
                data?.data?.access_token ||
                data?.data?.token ||
                null;

            let userData = getUserFromLoginResponse(data, cleanEmail);

            /*
                Belangrijk:
                Als de login-response geen id bevat, zoeken we de user alsnog op via /users
                op basis van email. Dit fixt jouw profiel-error.
            */

            if (!userData?.id && !userData?.user_id && cleanEmail) {
                const foundUser = await findUserByEmail(cleanEmail);

                if (foundUser) {
                    userData = {
                        ...userData,
                        ...foundUser,
                    };
                }
            }

            if (token) {
                userData.token = token;
            }

            await login(userData);

            onSuccess?.(token, userData);
        } catch (error) {
            Alert.alert("Network error", error.message || String(error));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="w-full px-6">
            <Text className="text-3xl text-center font-semibold text-darkBlue mb-2">
                Log in
            </Text>

            <TextInput
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 bg-white"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
            />

            <TextInput
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 bg-white"
                placeholder="Wachtwoord"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
            />

            <TouchableOpacity
                className="w-full bg-blue py-3 rounded-md items-center mb-3"
                onPress={handleSubmit}
                disabled={loading}
                accessibilityLabel="Login"
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white text-base font-semibold">
                        Log in
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
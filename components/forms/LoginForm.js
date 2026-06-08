import React, {useState} from "react";
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native";

const LOGIN_URL = "http://145.24.237.86:8000/login";

export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!email.trim() || !password) {
            Alert.alert("Validatie", "Email en wachtwoord zijn verplicht");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: email.trim(),
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
                    (data && (data.detail || data.message || JSON.stringify(data))) ||
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

            if (!token) {
                Alert.alert(
                    "Login geslaagd",
                    "Je bent ingelogd, maar er werd geen JWT-token teruggegeven."
                );
                onSuccess?.(null, data);
                return;
            }

            Alert.alert("Succes", "JWT-token ontvangen.");
            onSuccess?.(token, data);
        } catch (error) {
            Alert.alert("Network error", error.message || String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="w-full px-6">
            <Text className="text-3xl text-center font-semibold text-darkBlue mb-2">Log in</Text>
            <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 bg-white" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" returnKeyType="next"/>
            <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 bg-white" placeholder="Wachtwoord" value={password} onChangeText={setPassword} secureTextEntry returnKeyType="done"/>
            <TouchableOpacity className="w-full bg-blue py-3 rounded-md items-center mb-3" onPress={handleSubmit} disabled={loading} accessibilityLabel="Login">
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white text-base font-semibold">Log in</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
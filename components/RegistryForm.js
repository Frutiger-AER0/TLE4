import React, {useState} from "react";
import {ActivityIndicator, Text, Alert, TextInput, TouchableOpacity, View} from "react-native";

export default function RegistryForm({ onSuccess }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!username || !email || !password || !verifyPassword) {
            Alert.alert("Validatie", "Alle velden zijn verplicht");
            return false;
        }
        if (password.length < 6) {
            Alert.alert("Validatie", "Wachtwoord moet minstens 6 karakters bevatten");
            return false;
        }
        if (password !== verifyPassword) {
            Alert.alert("Validatie", "Wachtwoorden komen niet overeen");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch("http://145.24.237.86:8000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password: password.trim(),
                }),
            });

            const contentType = res.headers.get("content-type") || "";
            let data = null;
            if (contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            if (res.ok) {
                Alert.alert("Success", "Account aangemaakt.", [
                    { text: "OK", onPress: () => onSuccess?.() },
                ]);
                // clear form
                setUsername("");
                setEmail("");
                setPassword("");
                setVerifyPassword("");
            } else {
                const message = (data && (data.detail || data.message || JSON.stringify(data))) || `Server returned ${res.status}`;
                Alert.alert("Registratie mislukt", message.toString());
            }
        } catch (error) {
            Alert.alert("Network error", error.message || String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="w-full px-6">
            <Text className="text-3xl text-center font-semibold text-darkBlue mb-2">Registreer</Text>
            <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 bg-white" placeholder="Gebruikersnaam" value={username} onChangeText={setUsername} autoCapitalize="none" returnKeyType="next"/>
            <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 bg-white" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" returnKeyType="next"/>
            <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 bg-white" placeholder="Wachtwoord" value={password} onChangeText={setPassword} secureTextEntry returnKeyType="next"/>
            <TextInput className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 bg-white" placeholder="Wachtwoord voor Verificatie" value={verifyPassword} onChangeText={setVerifyPassword} secureTextEntry returnKeyType="done"/>
            <TouchableOpacity className="w-full bg-blue py-3 rounded-md items-center mb-3" onPress={handleSubmit} disabled={loading} accessibilityLabel="Registreer account">
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white text-base font-semibold">Maak account</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
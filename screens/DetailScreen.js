// DetailScreen.js
// Volledige detailpagina met uitgebreide informatie over het protest

import React from "react";
import { View, Text, ScrollView } from "react-native";

export default function DetailScreen({ route }) {
    // Haal het protest-object uit route.params
    const { protest } = route.params || {};

    // Als er geen protest is, toon een fallback
    if (!protest) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
                <Text style={{ fontSize: 16, color: "#666" }}>Geen details beschikbaar</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 48, paddingBottom: 24 }}>

            // Titel
            <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 8 }}>{protest.title}</Text>

            // Basis info
            <Text style={{ color: "#555" }}>Datum: {protest.date}</Text>
            <Text style={{ color: "#555" }}>Tijd: {protest.time}</Text>
            <Text style={{ color: "#555" }}>Locatie: {protest.location}</Text>

            {protest.participants && (
                <Text style={{ color: "#555", marginTop: 6 }}>Verwachte deelnemers: {protest.participants}</Text>
            )}

            // Beschrijving
            <Text style={{ marginTop: 20, color: "#333", lineHeight: 22 }}>
                {protest.description}
            </Text>

            // Praktische info placeholder
            <View style={{ marginTop: 28 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Praktische info</Text>
                <Text style={{ color: "#666" }}>
                    Hier kun je later extra informatie tonen zoals route, tips, wat je mee moet nemen, en regels.
                </Text>
            </View>

        </ScrollView>
    );
}

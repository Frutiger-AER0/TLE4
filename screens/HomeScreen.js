// HomeScreen.js
// Explorer-achtige homepage met secties: Spandoeken, Stickers, Demonstraties
// Klik op demonstratie opent PreviewModal; vanuit modal ga je naar Details

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { BANNERS, STICKERS, DEMONSTRATIONS } from "../data/dummyData";
import PreviewModal from "../components/PreviewModal";

export default function HomeScreen({ navigation }) {
    // State voor geselecteerd item en modal zichtbaarheid
    const [selectedItem, setSelectedItem] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    // Open preview modal
    const openPreview = (item) => {
        setSelectedItem(item);
        setPreviewVisible(true);
    };

    // Sluit preview modal
    const closePreview = () => {
        setPreviewVisible(false);
        setSelectedItem(null);
    };

    // Navigeer naar details en sluit modal
    const goToDetails = () => {
        if (!selectedItem) return;
        navigation.navigate("Details", { protest: selectedItem });
        closePreview();
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView style={{ paddingHorizontal: 16, paddingTop: 48, paddingBottom: 24 }}>

                // Hoofdtekst
                <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 6 }}>Ontdek acties</Text>
                <Text style={{ color: "#666", marginBottom: 20 }}>Verken spandoeken, stickers en demonstraties</Text>

                // Spandoeken sectie (horizontaal)
                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Spandoeken</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    {BANNERS.map((item) => (
                        <View key={item.id} style={{ backgroundColor: "#f3f3f3", padding: 14, borderRadius: 14, width: 220, marginRight: 12 }}>
                            <Text style={{ fontWeight: "600" }}>{item.title}</Text>
                            <Text style={{ color: "#666", marginTop: 6 }}>{item.description}</Text>
                        </View>
                    ))}
                </ScrollView>

                // Stickers sectie (horizontaal)
                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Stickers</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    {STICKERS.map((item) => (
                        <View key={item.id} style={{ backgroundColor: "#f3f3f3", padding: 14, borderRadius: 14, width: 220, marginRight: 12 }}>
                            <Text style={{ fontWeight: "600" }}>{item.title}</Text>
                            <Text style={{ color: "#666", marginTop: 6 }}>{item.description}</Text>
                        </View>
                    ))}
                </ScrollView>

                // Demonstraties sectie (verticaal)
                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Demonstraties</Text>
                {DEMONSTRATIONS.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => openPreview(item)}>
                        <View style={{ backgroundColor: "#f3f3f3", padding: 14, borderRadius: 14, marginBottom: 12 }}>
                            <Text style={{ fontWeight: "700", fontSize: 16 }}>{item.title}</Text>
                            <Text style={{ color: "#555", marginTop: 4 }}>{item.date} • {item.time}</Text>
                            <Text style={{ color: "#555" }}>{item.location}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>

            // Preview modal component
            <PreviewModal
                visible={previewVisible}
                item={selectedItem}
                onClose={closePreview}
                onDetails={goToDetails}
            />
        </View>
    );
}

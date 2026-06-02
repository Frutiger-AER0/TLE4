// PreviewModal.js
// Modal die van onder omhoog schuift met basisinfo en knop naar details

import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

export default function PreviewModal({ visible, onClose, onDetails, item }) {
    if (!visible || !item) return null;

    return (
        <Modal transparent animationType="slide" visible={visible}>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
                <View style={{ backgroundColor: "white", padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>

                    // Titel
                    <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 6 }}>
                        {item.title}
                    </Text>

                    // Basis info: datum, tijd, locatie
                    <Text style={{ color: "#333" }}>{item.date} • {item.time}</Text>
                    <Text style={{ color: "#333", marginBottom: 8 }}>{item.location}</Text>

                    // Aantal deelnemers (optioneel)
                    {item.participants && (
                        <Text style={{ color: "#666", marginBottom: 12 }}>
                            Ongeveer {item.participants} deelnemers
                        </Text>
                    )}

                    // Knoppen: Sluiten en Details
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: "#e5e5e5", padding: 12, borderRadius: 12, alignItems: "center", marginRight: 8 }}
                            onPress={onClose}
                        >
                            <Text style={{ color: "#111" }}>Sluiten</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: "#111", padding: 12, borderRadius: 12, alignItems: "center", marginLeft: 8 }}
                            onPress={onDetails}
                        >
                            <Text style={{ color: "#fff" }}>Details</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}

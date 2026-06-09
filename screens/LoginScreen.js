// screens/LoginScreen.js

import React from "react";
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginForm from "../components/LoginForm";
import AppHeader from "../components/layout/AppHeader";

export default function LoginScreen({ navigation }) {
    const screenHeight = Dimensions.get("window").height;

    return (
        <View className="flex-1 bg-offWhite">
            <AppHeader />

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    paddingBottom: 8,
                }}
            >
                <Ionicons name="arrow-back" size={28} color="#14213D" />

                <Text
                    style={{
                        color: "#14213D",
                        fontSize: 22,
                        fontWeight: "700",
                        marginLeft: 10,
                    }}
                >
                    Back
                </Text>
            </TouchableOpacity>

            <KeyboardAvoidingView
                className="flex-1 bg-offWhite"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    className="flex-1 bg-offWhite"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        minHeight: screenHeight - 180,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 24,
                        paddingTop: 24,
                        paddingBottom: 48,
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            maxWidth: 420,
                            alignSelf: "center",
                        }}
                    >
                        <LoginForm
                            onSuccess={() => navigation.replace("Home")}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
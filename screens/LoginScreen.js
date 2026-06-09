// screens/LoginScreen.js

import React from "react";
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from "react-native";
import LoginForm from "../components/LoginForm";
import AppHeader from "../components/layout/AppHeader";

export default function LoginScreen({ navigation }) {
    const screenHeight = Dimensions.get("window").height;

    return (
        <View className="flex-1 bg-offWhite">
            <AppHeader />

            <KeyboardAvoidingView
                className="flex-1 bg-offWhite"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    className="flex-1 bg-offWhite"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        minHeight: screenHeight - 120,
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
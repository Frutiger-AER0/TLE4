import React, {useEffect, useState, useContext} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import tw from 'twrnc';
import {AuthContext} from '../context/AuthContext';

export default function ProfileScreen() {
    // 1. Extract the 'user' object from the AuthContext
    const {user: loggedInUser} = useContext(AuthContext);

    // 2. Safely grab the ID from your stored user object (adjust 'id' to matching backend key if needed)
    const contextUserId = loggedInUser?.id || loggedInUser?.userId;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if contextUserId is available
        if (!contextUserId) {
            setError("Geen gebruikers-ID opgegeven. Kan profiel niet laden. Zorg ervoor dat u bent ingelogd.");
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`http://145.24.237.86:8000/users/${contextUserId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUser(data);
            } catch (e) {
                console.error(`Failed to fetch user ${contextUserId}:`, e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [contextUserId]); // Reload whenever the user ID changes

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <ActivityIndicator size="large" color="#0000ff"/>
                <Text style={tw`mt-2 text-lg text-gray-700`}>Profiel laden...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white p-5`}>
                <Text style={tw`text-lg text-red-600 text-center`}>Fout bij het laden van profiel: {error}</Text>
                {contextUserId &&
                    <Text style={tw`text-base text-gray-600 text-center mt-2`}>Controleer of de server draait en de URL
                        voor gebruiker {contextUserId} correct is.</Text>}
                {!contextUserId &&
                    <Text style={tw`text-base text-gray-600 text-center mt-2`}>U bent mogelijk niet ingelogd of de
                        gebruikers-ID is niet beschikbaar.</Text>}
            </View>
        );
    }

    if (!user) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <Text style={tw`text-lg text-gray-700`}>Geen gebruikersgegevens gevonden voor
                    ID: {contextUserId}.</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-100 p-4`}>
            <Text style={tw`text-2xl font-bold text-darkBlue mb-4`}>Mijn Profiel</Text>
            <View style={tw`bg-white p-5 rounded-lg shadow-md`}>
                <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Gebruikersnaam: {user.username}</Text>
                {user.email && <Text style={tw`text-gray-600 mb-1`}>Email: {user.email}</Text>}
                {user.id && <Text style={tw`text-gray-600 mb-1`}>Gebruikers-ID: {user.id}</Text>}
                <Text style={tw`text-gray-600 mt-4 italic`}>Dit zijn de details van de ingelogde gebruiker.</Text>
            </View>
        </View>
    );
}
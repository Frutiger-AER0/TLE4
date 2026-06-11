import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import * as Location from 'expo-location';
import {fetchUserProjects} from "../components/services/ProtestApi";


export default function MapScreen({route}) {
    const item = route?.params?.item || null;
    const [location, setLocation] = useState(null);
    const [protests, setProtests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let subscription;

        async function initializeMap() {
            try {
                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Locatietoegang is geweigerd!');
                    return;
                }

                const initialLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: initialLocation.coords.latitude,
                    longitude: initialLocation.coords.longitude,
                });

                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 10,
                    },
                    (newLocation) => {
                        setLocation({
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude,
                        });
                    }
                );

                const savedProtests = await fetchUserProjects();
                setProtests(savedProtests);

            } catch (error) {
                console.error("Fout bij laden van kaartgegevens:", error);
            } finally {
                setLoading(false);
            }
        }

        initializeMap();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    if (loading || !location) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#849782"/>
                <Text style={styles.loadingText}>Kaart en protesten laden...</Text>
            </View>
        );
    }

    const initialRegion = {
        latitude: item ? Number(item.latitude) : location.latitude,
        longitude: item ? Number(item.longitude) : location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                userInterfaceStyle='light'
                initialRegion={initialRegion}
            >
                {protests.map((protest) => {
                    if (!protest.latitude || !protest.longitude) return null;
                    return (
                        <Marker
                            key={protest.id || `${protest.latitude}-${protest.longitude}`}
                            coordinate={{
                                latitude: protest.latitude,
                                longitude: protest.longitude,
                            }}
                            title={protest.title}
                            description={protest.location}
                            pinColor='#849782'
                        />
                    )
                })}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 10,
        color: '#000000',
    }
});
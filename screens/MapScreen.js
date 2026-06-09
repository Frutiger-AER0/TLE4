import React, {useEffect, useState} from 'react';
// import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, View, Text} from 'react-native';
// import * as Location from 'expo-location';

export default function MapScreen({route}) {
    const item = route?.params?.item || {latitude: 52.3702, longitude: 4.8952, name: "Standaard", address: "Onbekend"};

    const [location, setLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    useEffect(() => {
        let subscription;

        async function startWatching() {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Locatietoegang is geweigerd!');
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000,
                    distanceInterval: 50,
                },
                (newLocation) => {
                    const {latitude, longitude} = newLocation.coords;
                    const newCoord = {latitude, longitude};
                    setLocation(newCoord);
                    setRouteCoordinates((prevCoords) => [...prevCoords, newCoord]);
                }
            );
        }

        startWatching();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    if (!location) {
        return (
            <View style={[styles.container, {backgroundColor: '#ffffff'}]}>
                <Text style={{color: '#000000'}}>Locatie ophalen...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, {backgroundColor: '#ffffff'}]}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                userInterfaceStyle='light'
                initialRegion={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }}
                    title={item.name}
                    description={item.address}
                    pinColor='#849782'
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
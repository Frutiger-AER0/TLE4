import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DonationScreen from "./screens/DonationScreen";

export default function App() {
    return (
        <NavigationContainer>
            <DonationScreen/>
        </NavigationContainer>
    );
}
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DonationScreen from "./screens/DonationScreen";
import "./global.css";

export default function App() {
    return (
        <NavigationContainer>
            <DonationScreen/>
        </NavigationContainer>
    );
}
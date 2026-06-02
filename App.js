import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ActionScreen from "./screens/ActionScreen";

export default function App() {
    return (
        <NavigationContainer>
            <ActionScreen/>
        </NavigationContainer>
    );
}
import {NavigationContainer} from "@react-navigation/native";
import OpeningScreen from "./screens/OpeningScreen";

import "./global.css"

export default function App() {
  return (
    <NavigationContainer>
        <OpeningScreen/>
    </NavigationContainer>
  );
}

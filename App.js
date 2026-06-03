import {NavigationContainer} from "@react-navigation/native";
import RegistryScreen from "./screens/RegistryScreen";

import "./global.css"

export default function App() {
  return (
    <NavigationContainer>
        <RegistryScreen/>
    </NavigationContainer>
  );
}

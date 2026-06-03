import React from "react";
import {Text, View} from "react-native";
import DonationForm from "../components/forms/DonationForm";

export default function DonationScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
            {/*header*/}
            
            {/*form*/}
            <DonationForm/>

            {/*nav*/}
        </View>
    );
}
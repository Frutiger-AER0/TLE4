import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Switch,
    ActivityIndicator,
    ScrollView,
    Platform,
    Button
} from "react-native";
import {Picker} from '@react-native-picker/picker';
import {SafeAreaView} from "react-native-safe-area-context"; // Keep SafeAreaView

// Custom RadioButton component
const RadioButton = ({label, selected, onSelect, value}) => (
    <TouchableOpacity className="flex-row items-center mb-2" onPress={() => onSelect(value)}>
        <View
            className={`h-5 w-5 rounded-full border-2 ${selected ? 'border-blue-500' : 'border-gray-400'} items-center justify-center mr-2`}>
            {selected && <View className="w-3 h-3 rounded-full bg-blue-500"/>}
        </View>
        <Text className="text-sm text-gray-700">{label}</Text>
    </TouchableOpacity>
);

function DonationForm({onSubmit, initialData, isSubmitting}) {
    const [formData, setFormData] = useState({
        topic: initialData?.topic || '',
        selectedAmount: initialData?.selectedAmount || '',
        customAmount: initialData?.customAmount || '',
        salutation: initialData?.salutation || '',
        firstName: initialData?.firstName || '',
        infix: initialData?.infix || '',
        lastName: initialData?.lastName || '',
        email: initialData?.email || '',
        receiveEmailUpdates: initialData?.receiveEmailUpdates || false,
        payment: initialData?.payment || '',
    });

    const [isTopicPickerVisible, setTopicPickerVisible] = useState(false);
    const [isPaymentPickerVisible, setPaymentPickerVisible] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(prevData => ({
                ...prevData,
                ...initialData,
            }));
        }
    }, [initialData]);

    const handleInputChange = (name, value, isCheckbox = false) => {
        setFormData((prevFormData) => {
            if (isCheckbox) {
                return {
                    ...prevFormData,
                    [name]: value,
                };
            } else if (name === 'selectedAmount') {
                return {
                    ...prevFormData,
                    selectedAmount: value,
                    customAmount: value === 'other' ? prevFormData.customAmount : '',
                };
            } else if (name === 'customAmount') {
                return {
                    ...prevFormData,
                    customAmount: value,
                    selectedAmount: 'other',
                };
            } else {
                return {
                    ...prevFormData,
                    [name]: value,
                };
            }
        });
    };

    const handleSubmit = () => {
        const finalAmount = formData.selectedAmount === 'other' ? formData.customAmount : formData.selectedAmount;
        onSubmit({...formData, amount: finalAmount});
    };

    const predefinedAmounts = [10, 25, 50, 100];
    const salutationOptions = [
        {label: "Dhr.", value: "Dhr."},
        {label: "Mevr.", value: "Mevr."},
        {label: "Anders", value: "Anders"},
    ];
    const topicOptions = ["Palenstina", "Arbeid", "LHBTQI+"];
    const paymentOptions = ["iDeal", "Creditcard", "PayPal"];

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} // Vertical centering
            >
                <View
                    className="bg-white mx-auto p-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden w-11/12 max-w-lg">
                    <View className="mb-4"> {/* Wrapper View for the title */}
                        <Text className="text-center text-xl font-bold text-gray-800">Doneren</Text>
                    </View>
                    <View className="space-y-4">
                        {/* Onderwerp */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-1">Onderwerp*</Text>
                            <TouchableOpacity
                                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 justify-center min-h-[50px]"
                                onPress={() => setTopicPickerVisible(!isTopicPickerVisible)}
                            >
                                <Text className="text-base text-gray-800">
                                    {formData.topic || "Kies een onderwerp..."}
                                </Text>
                            </TouchableOpacity>
                            {isTopicPickerVisible && (
                                <View
                                    className="border border-gray-300 rounded-lg bg-gray-50 mt-1 overflow-hidden z-10">
                                    <Picker
                                        selectedValue={formData.topic}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('topic', itemValue);
                                            setTopicPickerVisible(false);
                                        }}
                                        className="h-[50px] w-full text-gray-800 bg-transparent"
                                        itemStyle={Platform.OS === 'ios' ? {
                                            fontSize: 16,
                                            color: '#1f2937'
                                        } : {}} // itemStyle is iOS only
                                        mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'}
                                    >
                                        <Picker.Item label="Kies een onderwerp..." value=""/>
                                        {topicOptions.map(option => (
                                            <Picker.Item key={option} label={option} value={option}/>
                                        ))}
                                    </Picker>
                                </View>
                            )}
                        </View>

                        {/* Bedrag (Amount) Radio Buttons */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-1">Welk bedrag wil je doneren?*</Text>
                            <View className="mt-2">
                                {predefinedAmounts.map((amount) => (
                                    <RadioButton
                                        key={amount}
                                        label={`€${amount}`}
                                        value={String(amount)}
                                        selected={formData.selectedAmount === String(amount)}
                                        onSelect={(value) => handleInputChange('selectedAmount', value)}
                                    />
                                ))}
                                <RadioButton
                                    label="Overig"
                                    value="other"
                                    selected={formData.selectedAmount === 'other'}
                                    onSelect={(value) => handleInputChange('selectedAmount', value)}
                                />
                            </View>
                            {formData.selectedAmount === 'other' && (
                                <TextInput
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none mt-2"
                                    keyboardType="numeric"
                                    placeholder="Voer hier je bedrag in"
                                    value={formData.customAmount}
                                    onChangeText={(text) => handleInputChange('customAmount', text)}
                                />
                            )}
                        </View>

                        <View
                            className="flex-row flex-wrap justify-between">
                            {/* Aanhef (Salutation) Radio Buttons */}
                            <View className="w-[48%] mb-4"> {/* w-[48%] to account for gap */}
                                <Text className="text-sm font-medium text-gray-700 mb-1">Aanhef*</Text>
                                <View className="mt-2">
                                    {salutationOptions.map((option) => (
                                        <RadioButton
                                            key={option.value}
                                            label={option.label}
                                            value={option.value}
                                            selected={formData.salutation === option.value}
                                            onSelect={(value) => handleInputChange('salutation', value)}
                                        />
                                    ))}
                                </View>
                            </View>

                            <View className="w-[48%] mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Voornaam*</Text>
                                <TextInput
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                    value={formData.firstName}
                                    onChangeText={(text) => handleInputChange('firstName', text)}
                                />
                            </View>

                            <View className="w-[48%] mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Tussenvoegsel</Text>
                                <TextInput
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                    value={formData.infix}
                                    onChangeText={(text) => handleInputChange('infix', text)}
                                />
                            </View>

                            <View className="w-[48%] mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-1">Achternaam*</Text>
                                <TextInput
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                    value={formData.lastName}
                                    onChangeText={(text) => handleInputChange('lastName', text)}
                                />
                            </View>

                            <View className="w-full mb-4"> {/* Full width for email */}
                                <Text className="text-sm font-medium text-gray-700 mb-1">E-mail*</Text>
                                <TextInput
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                                    keyboardType="email-address"
                                    value={formData.email}
                                    onChangeText={(text) => handleInputChange('email', text)}
                                />
                            </View>

                            {/* Email Updates Checkbox (Switch) */}
                            <View className="flex-row items-center mb-4 w-full"> {/* col-span-full for full width */}
                                <Switch
                                    onValueChange={(value) => handleInputChange('receiveEmailUpdates', value, true)}
                                    value={formData.receiveEmailUpdates}
                                />
                                <Text className="ml-3 text-sm text-gray-700">Ik wil graag e-mail updates
                                    ontvangen.</Text>
                            </View>

                            <View className="w-full mb-4"> {/* Full width for payment */}
                                <Text className="text-sm font-medium text-gray-700 mb-1">Selecteer een
                                    betaalmethode*</Text>
                                <TouchableOpacity
                                    className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 justify-center min-h-[50px]"
                                    onPress={() => setPaymentPickerVisible(!isPaymentPickerVisible)}
                                >
                                    <Text className="text-base text-gray-800">
                                        {formData.payment || "Kies een betaalmethode..."}
                                    </Text>
                                </TouchableOpacity>
                                {isPaymentPickerVisible && (
                                    <View
                                        className="border border-gray-300 rounded-lg bg-gray-50 mt-1 overflow-hidden z-10">
                                        <Picker
                                            selectedValue={formData.payment}
                                            onValueChange={(itemValue) => {
                                                handleInputChange('payment', itemValue);
                                                setPaymentPickerVisible(false);
                                            }}
                                            className="h-[50px] w-full text-gray-800 bg-transparent"
                                            itemStyle={Platform.OS === 'ios' ? {fontSize: 16, color: '#1f2937'} : {}}
                                            mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'}
                                        >
                                            <Picker.Item label="Kies een betaalmethode..." value=""/>
                                            {paymentOptions.map(option => (
                                                <Picker.Item key={option} label={option} value={option}/>
                                            ))}
                                        </Picker>
                                    </View>
                                )}
                            </View>
                        </View>

                        <Button
                            title={isSubmitting ? "Bezig..." : "Doneer nu"}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            color="#4f46e5" // Equivalent to bg-indigo-600
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default DonationForm;
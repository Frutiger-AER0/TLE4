import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Button,
    Modal, // Import Modal
    Pressable // Import Pressable for background dismissal
} from "react-native";
import {Picker} from '@react-native-picker/picker';
import {SafeAreaView} from "react-native-safe-area-context"; // Keep SafeAreaView

// Custom RadioButton component
const RadioButton = ({label, selected, onSelect, value}) => (
    <TouchableOpacity className="flex-row items-center mb-2" onPress={() => onSelect(value)}>
        <View
            className={`h-5 w-5 rounded-full border-2 ${
                selected ? 'border-blue' : 'border-purple'
            } items-center justify-center mr-2`}
        >
            {selected && <View className="w-3 h-3 rounded-full bg-blue"/>}
        </View>

        <Text className="text-sm text-darkBlue">
            {label}
        </Text>
    </TouchableOpacity>
);

// Custom Checkbox component
const Checkbox = ({label, selected, onSelect}) => (
    <TouchableOpacity className="flex-row items-center" onPress={onSelect}>
        <View
            className={`h-5 w-5 border-2 ${selected ? 'border-blue bg-blue' : 'border-purple'} items-center justify-center mr-2`}
        >
            {selected && <Text className="text-white text-xs">✓</Text>}
        </View>
        <Text className="text-sm text-darkBlue">{label}</Text>
    </TouchableOpacity>
);

// Generic Picker Modal component
const PickerModal = ({isVisible, onClose, selectedValue, onValueChange, options, placeholder, title}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose} // For Android hardware back button
        >
            <Pressable className="flex-1 justify-center items-center bg-black/50" onPress={onClose}>
                <Pressable className="bg-white rounded-lg p-5 w-11/12 max-w-sm">
                    <Text className="text-lg font-bold mb-3 text-darkBlue">{title}</Text>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue) => {
                            onValueChange(itemValue);
                            onClose(); // Close after selection
                        }}
                        className="h-[50px] w-full text-darkBlue bg-transparent"
                        itemStyle={Platform.OS === 'ios' ? {fontSize: 16, color: '#1f2937'} : {}}
                        mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'} // Keep original mode for Picker itself
                    >
                        <Picker.Item label={placeholder} value=""/>
                        {options.map(option => (
                            <Picker.Item key={option.value || option} label={option.label || option}
                                         value={option.value || option}/>
                        ))}
                    </Picker>
                    <TouchableOpacity
                        className="mt-4 bg-purple py-3 px-4 rounded-lg items-center"
                        onPress={onClose}
                    >
                        <Text className="text-offWhite font-semibold text-base">Annuleren</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};


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
    // Converted to array of objects for PickerModal
    const topicOptions = [
        {label: "Palenstina", value: "Palenstina"},
        {label: "Arbeid", value: "Arbeid"},
        {label: "LHBTQI+", value: "LHBTQI+"}
    ];
    // Converted to array of objects for PickerModal
    const paymentOptions = [
        {label: "iDeal", value: "iDeal"},
        {label: "Creditcard", value: "Creditcard"},
        {label: "PayPal", value: "PayPal"}
    ];

    return (
        <SafeAreaView className="flex-1 bg-offWhite">
            <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
                        className="flex-1">
                <View
                    className="bg-lightPurple/50 flex-1 flex-grow p-5 rounded-xl w-11-12 mx-4 max-w-lg">
                    <View className="mb-4">
                        <Text className="text-left text-xl font-bold text-darkBlue">Doneren</Text>
                    </View>

                    {/* Topic input */}
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-darkBlue mb-1">Onderwerp*</Text>
                        <TouchableOpacity
                            className="bg-lightPurple rounded-lg px-4 py-3 justify-center min-h-[50px]"
                            onPress={() => setTopicPickerVisible(true)} // Open modal
                        >
                            <Text className="text-base text-darkBlue">
                                {formData.topic || "Kies een onderwerp..."}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Topic Picker Modal */}
                    <PickerModal
                        isVisible={isTopicPickerVisible}
                        onClose={() => setTopicPickerVisible(false)}
                        selectedValue={formData.topic}
                        onValueChange={(itemValue) => handleInputChange('topic', itemValue)}
                        options={topicOptions}
                        placeholder="Kies een onderwerp..."
                        title="Selecteer een onderwerp"
                    />

                    {/* Amount Radio Buttons */}
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-darkBlue mb-1">Welk bedrag wil je
                            doneren?*</Text>
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
                                className="w-full px-4 py-3 rounded-lg bg-lightPurple text-darkBlue"
                                keyboardType="numeric"
                                placeholder="Voer hier je bedrag in"
                                value={formData.customAmount}
                                onChangeText={(text) => handleInputChange('customAmount', text)}
                            />
                        )}
                    </View>

                    {/* Salutation input */}
                    <View
                        className="flex-row flex-wrap justify-between">
                        {/* Aanhef (Salutation) Radio Buttons */}
                        <View className="w-full mb-4">
                            <Text className="text-sm font-medium text-darkBlue mb-1">Aanhef*</Text>
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

                        {/* Firstname input */}
                        <View className="w-full mb-4">
                            <Text className="text-sm font-medium text-darkBlue mb-1">Voornaam*</Text>
                            <TextInput
                                className="w-full px-4 py-3 rounded-lg bg-lightPurple text-darkBlue"
                                value={formData.firstName}
                                onChangeText={(text) => handleInputChange('firstName', text)}
                            />
                        </View>

                        {/* Infix input */}
                        <View className="w-[48%] mb-4">
                            <Text className="text-sm font-medium text-darkBlue mb-1">Tussenvoegsel</Text>
                            <TextInput
                                className="w-full px-4 py-3 rounded-lg bg-lightPurple text-darkBlue"
                                value={formData.infix}
                                onChangeText={(text) => handleInputChange('infix', text)}
                            />
                        </View>

                        {/* Lastname input */}
                        <View className="w-[48%] mb-4">
                            <Text className="text-sm font-medium text-darkBlue mb-1">Achternaam*</Text>
                            <TextInput
                                className="w-full px-4 py-3 rounded-lg bg-lightPurple text-darkBlue"
                                value={formData.lastName}
                                onChangeText={(text) => handleInputChange('lastName', text)}
                            />
                        </View>

                        {/* Email input */}
                        <View className="w-full mb-4">
                            <Text className="text-sm font-medium text-darkBlue mb-1">E-mail*</Text>
                            <TextInput
                                className="w-full px-4 py-3 rounded-lg bg-lightPurple text-darkBlue"
                                keyboardType="email-address"
                                value={formData.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                            />
                        </View>

                        {/* Email Updates Checkbox */}
                        <View className="w-full mb-4">
                            <Checkbox
                                label="Ik wil graag e-mail updates ontvangen."
                                selected={formData.receiveEmailUpdates}
                                onSelect={() => handleInputChange('receiveEmailUpdates', !formData.receiveEmailUpdates, true)}
                            />
                        </View>

                        {/* Payment Method Picker */}
                        <View className="w-full mb-4">
                            <Text className="text-sm font-medium text-darkBlue mb-1">Selecteer een
                                betaalmethode*</Text>
                            <TouchableOpacity
                                className="bg-lightPurple rounded-lg px-4 py-3 justify-center min-h-[50px]"
                                onPress={() => setPaymentPickerVisible(true)} // Open modal
                            >
                                <Text className="text-base text-darkBlue">
                                    {formData.payment || "Kies een betaalmethode..."}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Payment Picker Modal */}
                        <PickerModal
                            isVisible={isPaymentPickerVisible}
                            onClose={() => setPaymentPickerVisible(false)}
                            selectedValue={formData.payment}
                            onValueChange={(itemValue) => handleInputChange('payment', itemValue)}
                            options={paymentOptions}
                            placeholder="Kies een betaalmethode..."
                            title="Selecteer een betaalmethode"
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-purple py-3 px-4 rounded-lg flex-row items-center justify-center"
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Text className="text-offWhite font-semibold text-base">
                            {isSubmitting ? "Bezig..." : "Doneren"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default DonationForm;
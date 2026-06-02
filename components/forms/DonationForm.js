import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Switch,
    StyleSheet,
    ActivityIndicator,
    ScrollView, // Use ScrollView for scrollable content
    Platform // Import Platform to check OS
} from "react-native";
import { Picker } from '@react-native-picker/picker'; // Import Picker

// Custom RadioButton component
const RadioButton = ({ label, selected, onSelect, value }) => (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={() => onSelect(value)}>
        <View style={styles.radioCircle}>
            {selected && <View style={styles.selectedRadioCircle} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
);

function DonationForm({ onSubmit, initialData, isSubmitting }) {
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
                    [name]: value, // value is already boolean from Switch
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
        onSubmit({ ...formData, amount: finalAmount });
    };

    const predefinedAmounts = [10, 25, 50, 100];
    const salutationOptions = [
        { label: "Dhr.", value: "Dhr." },
        { label: "Mevr.", value: "Mevr." },
        { label: "Anders", value: "Anders" },
    ];
    const topicOptions = ["Palenstina", "Arbeid", "LHBTQI+"];
    const paymentOptions = ["iDeal", "Creditcard", "PayPal"];

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.form}>
                    {/* Onderwerp */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Onderwerp*</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.topic}
                                onValueChange={(itemValue) => handleInputChange('topic', itemValue)}
                                style={styles.picker}
                                itemStyle={styles.pickerItem} // Apply style to items (iOS only)
                                mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'} // Set mode to 'dialog' for Android
                            >
                                <Picker.Item label="Kies een onderwerp..." value="" />
                                {topicOptions.map(option => (
                                    <Picker.Item key={option} label={option} value={option} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Bedrag (Amount) Radio Buttons */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Welk bedrag wil je doneren?*</Text>
                        <View style={styles.radioGroup}>
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
                                style={styles.textInput}
                                keyboardType="numeric"
                                placeholder="Voer hier je bedrag in"
                                value={formData.customAmount}
                                onChangeText={(text) => handleInputChange('customAmount', text)}
                                // React Native TextInput does not have a 'required' prop, validation should be handled in onSubmit
                            />
                        )}
                    </View>

                    <View style={styles.gridContainer}>
                        {/* Aanhef (Salutation) Radio Buttons */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Aanhef*</Text>
                            <View style={styles.radioGroup}>
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Voornaam*</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.firstName}
                                onChangeText={(text) => handleInputChange('firstName', text)}
                                // React Native TextInput does not have a 'required' prop
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tussenvoegsel</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.infix}
                                onChangeText={(text) => handleInputChange('infix', text)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Achternaam*</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.lastName}
                                onChangeText={(text) => handleInputChange('lastName', text)}
                                // React Native TextInput does not have a 'required' prop
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail*</Text>
                            <TextInput
                                style={styles.textInput}
                                keyboardType="email-address"
                                value={formData.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                                // React Native TextInput does not have a 'required' prop
                            />
                        </View>

                        {/* Email Updates Checkbox (Switch) */}
                        <View style={[styles.inputGroup, styles.checkboxContainer]}>
                            <Switch
                                onValueChange={(value) => handleInputChange('receiveEmailUpdates', value, true)}
                                value={formData.receiveEmailUpdates}
                            />
                            <Text style={styles.checkboxLabel}>Ik wil graag e-mail updates ontvangen.</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Selecteer een betaalmethode*</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.payment}
                                    onValueChange={(itemValue) => handleInputChange('payment', itemValue)}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem} // Apply style to items (iOS only)
                                    mode={Platform.OS === 'android' ? 'dialog' : 'dropdown'} // Set mode to 'dialog' for Android
                                >
                                    <Picker.Item label="Kies een betaalmethode..." value="" />
                                    {paymentOptions.map(option => (
                                        <Picker.Item key={option} label={option} value={option} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Doneer nu</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f9fafb', // Equivalent to bg-gray-50 or similar light background
    },
    container: {
        backgroundColor: '#fff', // bg-white
        borderRadius: 12, // rounded-xl
        shadowColor: '#000', // shadow-sm
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2, // For Android shadow
        borderWidth: 1, // border
        borderColor: '#e5e7eb', // border-gray-100
        overflow: 'hidden',
        maxWidth: 600, // max-w-2xl
        marginHorizontal: 'auto', // mx-auto
        marginVertical: 20, // Added some vertical margin for better spacing
    },
    form: {
        padding: 24, // p-8
        // space-y-6 is handled by explicit margins or padding between groups
    },
    inputGroup: {
        marginBottom: 24, // space-y-1 + spacing between groups
    },
    label: {
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#374151', // text-gray-700
        marginBottom: 4, // space-y-1
    },
    textInput: {
        borderWidth: 1, // border
        borderColor: '#d1d5db', // border-gray-300
        borderRadius: 8, // rounded-lg
        paddingHorizontal: 16, // px-4
        paddingVertical: 12, // py-3
        fontSize: 16,
        color: '#1f2937', // text-gray-900
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: '#f0f0f0', // Added a distinct background color
        overflow: 'hidden',
        height: 50, // Explicit height for the container
        justifyContent: 'center', // Center the picker vertically
        zIndex: 10, // Added zIndex to ensure it's on top
    },
    picker: {
        height: 50, // Standard height for pickers
        width: '100%',
        color: '#1f2937', // Explicit text color
        backgroundColor: 'transparent', // Make picker background transparent to show container's background
    },
    pickerItem: { // Style for Picker.Item (iOS only)
        fontSize: 16,
        color: '#1f2937',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Distribute items
        marginBottom: 0,
    },
    gridItem: {
        width: '48%', // Roughly half width minus gap
        marginBottom: 24, // Gap between rows
    },
    radioGroup: {
        flexDirection: 'column', // Stack radio buttons vertically
        marginTop: 8, // mt-2
        marginBottom: 16, // space-y-2
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8, // Spacing between radio buttons
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#a78bfa', // focus:ring-indigo-500, text-indigo-600
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    selectedRadioCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#6366f1', // text-indigo-600
    },
    radioLabel: {
        fontSize: 14,
        color: '#374151', // text-gray-700
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24, // space-y-1
        width: '100%',
    },
    checkboxLabel: {
        marginLeft: 12, // ml-3
        fontSize: 14,
        color: '#374151', // text-gray-700
    },
    submitButton: {
        width: '100%', // w-full
        flexDirection: 'row',
        justifyContent: 'center', // justify-center
        paddingVertical: 12, // py-3
        paddingHorizontal: 16, // px-4
        borderWidth: 1, // border
        borderColor: 'transparent', // border-transparent
        borderRadius: 8, // rounded-lg
        shadowColor: '#000', // shadow-sm
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        backgroundColor: '#4f46e5', // bg-indigo-600
        marginTop: 16, // pt-4
    },
    submitButtonDisabled: {
        opacity: 0.75, // opacity-75
    },
    submitButtonText: {
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#fff', // text-white
    },
});

export default DonationForm;
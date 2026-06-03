import React, {useState, useEffect} from "react";
import {StyleSheet} from "react-native";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Switch,
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
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View
                    className="bg-white mx-auto p-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden w-11/12 max-w-lg">
                    <View className="mb-4">
                        <Text style={styles.title}>Doneren</Text> </View>
                    <View className="space-y-4">
                        {/* Onderwerp */}
                        <View className="mb-4">
                            <Text style={styles.label}>Onderwerp*</Text>
                            <TouchableOpacity style={styles.pickerButton}
                                              onPress={() => setTopicPickerVisible(!isTopicPickerVisible)}
                            >
                                <Text style={styles.pickerText}>
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
                            <Text style={styles.label}>Welk bedrag wil je doneren?*</Text>
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
                                <TextInput style={styles.input}
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
                            <View className="w-[48%] mb-4">
                                <Text style={styles.label}>Aanhef*</Text>
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
                                <Text style={styles.label}>Voornaam*</Text>
                                <TextInput style={styles.input}
                                           value={formData.firstName}
                                           onChangeText={(text) => handleInputChange('firstName', text)}
                                />
                            </View>

                            <View className="w-[48%] mb-4">
                                <Text style={styles.label}>Tussenvoegsel</Text>
                                <TextInput style={styles.input}
                                           value={formData.infix}
                                           onChangeText={(text) => handleInputChange('infix', text)}
                                />
                            </View>

                            <View className="w-[48%] mb-4">
                                <Text style={styles.label}>>Achternaam*</Text>
                                <TextInput style={styles.input}
                                           value={formData.lastName}
                                           onChangeText={(text) => handleInputChange('lastName', text)}
                                />
                            </View>

                            <View className="w-full mb-4">
                                <Text style={styles.label}>E-mail*</Text>
                                <TextInput style={styles.input}
                                           keyboardType="email-address"
                                           value={formData.email}
                                           onChangeText={(text) => handleInputChange('email', text)}
                                />
                            </View>

                            {/* Email Updates Checkbox (Switch) */}
                            <View className="flex-row items-center mb-4 w-full">
                                <Switch
                                    onValueChange={(value) => handleInputChange('receiveEmailUpdates', value, true)}
                                    value={formData.receiveEmailUpdates}
                                />
                                <Text className="ml-3 text-sm text-gray-700">Ik wil graag e-mail updates
                                    ontvangen.</Text>
                            </View>

                            <View className="w-full mb-4">
                                <Text style={styles.label}>Selecteer een
                                    betaalmethode*</Text>
                                <TouchableOpacity style={styles.pickerButton}
                                                  onPress={() => setPaymentPickerVisible(!isPaymentPickerVisible)}
                                >
                                    <Text style={styles.pickerText}>
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

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },

    scrollContent: {
        padding: 20,
    },

    card: {
        backgroundColor: "#E8DFF0",
        borderRadius: 12,
        padding: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 20,
        color: "#222",
    },

    section: {
        marginBottom: 18,
    },

    label: {
        fontSize: 12,
        color: "#333",
        marginBottom: 6,
    },

    input: {
        backgroundColor: "#DCCFE8",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 42,
    },

    pickerButton: {
        backgroundColor: "#DCCFE8",
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: "center",
        minHeight: 42,
    },

    pickerText: {
        color: "#333",
        fontSize: 14,
    },

    pickerContainer: {
        backgroundColor: "#DCCFE8",
        borderRadius: 8,
        marginTop: 4,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    half: {
        width: "48%",
    },

    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },

    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#0D5BCF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },

    selectedRadioCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#0D5BCF",
    },

    radioLabel: {
        fontSize: 13,
        color: "#333",
    },

    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    switchLabel: {
        marginLeft: 10,
        flex: 1,
        fontSize: 12,
    },

    donateButton: {
        backgroundColor: "#7B2CBF",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 10,
    },

    donateButtonText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 15,
    },
});

export default DonationForm;
import React, { useState } from "react";
import {
    TextInput,
    View,
    StyleSheet,
    Text,
} from "react-native";

const NumberInput = () => {
    const [number, setNumber] = useState("");

    const handleNumberChange = (text: any) => {
        if (!isNaN(text)) {
            setNumber(text);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Geeksforgeeks</Text>
            <TextInput
                style={styles.input}
                value={number}
                onChangeText={handleNumberChange}
                keyboardType="numeric"
                placeholder="Enter a number"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: "bold",
        color: "green",
    },
    input: {
        width: 250,
        height: 50,
        borderWidth: 2,
        borderColor: "#3498db",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 18,
        color: "#333",
        backgroundColor: "#fff",
    },
});

export default NumberInput;
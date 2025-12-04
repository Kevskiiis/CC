import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { responsive } from "../utils/responsive"; // Your responsive helper

type ErrorBoxProps = {
    message: string;
    width?: number | string; // Accept either pixels or percentage
    height?: number | string;
};

const ErrorBox: React.FC<ErrorBoxProps> = ({ message, width = 300, height = undefined }) => {
    return (
    <View style={[styles.container, { width: width as any, height: height as any }]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};
export default ErrorBox;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "rgba(255, 0, 0, 0.6)", // Slightly transparent red
        backgroundColor: "rgba(255, 0, 0, 0.1)", // Light red background
        borderRadius: responsive.number(6),
        padding: responsive.number(10),
        marginVertical: responsive.number(5),
    },
    text: {
        color: "red",
        fontSize: responsive.number(14),
    },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { responsive } from "../utils/responsive";

type SuccessBoxProps = {
    message: string;
    width?: number | string;
    height?: number | string;
};

const SuccessBox: React.FC<SuccessBoxProps> = ({ message, width = 300, height }) => {
    return (
        <View style={[styles.container, { width: width as any, height: height as any }]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

export default SuccessBox;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "rgba(0, 200, 0, 0.6)",     // Soft green outline
        backgroundColor: "rgba(0, 200, 0, 0.1)", // Light green wash
        borderRadius: responsive.number(6),
        padding: responsive.number(10),
        marginVertical: responsive.number(5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: "rgb(0, 120, 0)", // Darker green text
        fontSize: responsive.number(14),
        // textAlign: 'center',
        // textAlignVertical: 'center'
    },
});

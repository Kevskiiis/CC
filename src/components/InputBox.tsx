import { StyleSheet, View, Text, TouchableOpacity, TextInput} from "react-native";
import { responsive } from "../utils/responsive";
import { RefObject } from "react";

interface InputBoxProps {
    onEnter: () => void;
    inputRef: RefObject<TextInput>,
    hideInput: boolean;
    boxPlaceholder: string;
}

function InputBox ({onEnter, inputRef, hideInput, boxPlaceholder}: InputBoxProps) {
    return (
        <TextInput
            ref={inputRef}
            onSubmitEditing={onEnter}
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: 10,
                borderRadius: responsive.number(10),
                borderWidth: responsive.number(4),
                fontSize: responsive.number(16),
                height: responsive.number(50),
                width: '100%',
                color: '#000000ff',
                backgroundColor: '#ffffff'
            }} 
            secureTextEntry={hideInput}
            placeholder={boxPlaceholder}
        />
    )
}
export default InputBox;
import { StyleSheet, View, Text, TouchableOpacity, TextInput} from "react-native";
import { responsive } from "../utils/responsive";

interface InputBoxProps {
    boxPlaceholder: string;
}

function InputBox ({boxPlaceholder}: InputBoxProps) {
    return (
        <TextInput 
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
            placeholder={boxPlaceholder}
        />
    )
}
export default InputBox;
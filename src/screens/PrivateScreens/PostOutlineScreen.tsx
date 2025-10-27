import { StyleSheet, View} from "react-native";
import { TextInput } from "react-native-paper";
import { responsive } from "../../utils/responsive";

export default function PostOutline () {
    return (
        <View style={PostOutlineStyles.container}>
            <TextInput label='Title'/>
        </View>
    );
}

const PostOutlineStyles = StyleSheet.create ({
    container: {
        width: responsive.number(400),
        height: responsive.number(300),
        backgroundColor: '#000000ff'
    }
});

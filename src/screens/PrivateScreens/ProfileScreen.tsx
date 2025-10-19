import { Text, Avatar, Card, IconButton, Button, Divider} from "react-native-paper";
import { StyleSheet, View, ScrollView} from "react-native";
import { responsive } from "../../utils/responsive";
import { COLORS } from "../../themes/colors";
import { useState } from "react";

export default function ProfileScreen () {

    return (
        <View>
            <View style={ProfileScreenStyles.TopNavContainer}>
                <Text>User's </Text>
                <IconButton icon="cog" mode="contained" size={30}/>
            </View>
            {/* <Avatar.Image size={20} src={require('')}/> */}
            <Text>Profile Name</Text>
            <Text>Bio is here, who am I</Text>
            <Divider/>
            <Button style={ProfileScreenStyles.button}>Edit Profile</Button>
            <Divider/>
            <Card style={ProfileScreenStyles.card} onPress={() => console.log(' was pressed')}>
                <Card.Title title="Create Post"/>
                <Card.Cover/>
                <Card.Content>
                    <Text variant="bodyLarge">Got something to say? Create a post and start the conversation!</Text>
                </Card.Content>
            </Card>
        </View>
    );
}

const ProfileScreenStyles = StyleSheet.create({
    TopNavContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: responsive.number(65),
        backgroundColor: COLORS.primary
    },
    configurationContainer: {
        flexDirection: 'row',
        gap: responsive.number(20)
    },
    card: {
        width: responsive.number(230),
        // height: responsive.number(),
        // backgroundColor: '#f08080ff'
    },
    button: {
        width: responsive.number(200),
        height: responsive.number(50),
        backgroundColor: '#f08080ff'
    }
})
import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Button, IconButton, TextInput, Text, Card } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS } from "../../themes/colors";
import { responsive } from "../../utils/responsive";

export default function PostScreen () {
    

    return (
        <KeyboardAwareScrollView style={PostScreenStyles.screen}>
            <ScrollView>
                <View style={PostScreenStyles.mainContainer}>
                        <Card style={PostScreenStyles.card} onPress={() => console.log('Announcement was pressed')}>
                            <Card.Title title="Create Announcement" left={(props) => <IconButton {...props} style={{paddingRight: responsive.number(15)}} icon="bullhorn-outline"/>}/>
                            <Card.Cover/>
                            <Card.Content>
                                <Text variant="bodyLarge">Have big news? Post an announcement to keep your community informed.</Text>
                            </Card.Content>
                        </Card>
                        <Card style={PostScreenStyles.card} onPress={() => console.log('Post was pressed')}>
                            <Card.Title title="Create Post" left={(props) => <IconButton {...props} style={{paddingRight: responsive.number(15)}} icon="pencil"/>}/>
                            <Card.Cover/>
                            <Card.Content>
                                <Text variant="bodyLarge">Got something to say? Create a post and start the conversation!</Text>
                            </Card.Content>
                        </Card>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

const PostScreenStyles = StyleSheet.create ({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    mainContainer: {
        flex: 1,
        gap: responsive.number(20),
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: responsive.number(25),
        paddingBottom: responsive.number(25)
    },
    card: {
        width: responsive.number(325),
        height: 'auto',
    }
});

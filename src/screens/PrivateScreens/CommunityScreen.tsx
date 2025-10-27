import { View, ScrollView, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card, Text, IconButton} from "react-native-paper";
import { responsive } from "../../utils/responsive";
import { COLORS } from "../../themes/colors";

export default function CommunityScreen () {
    return (
        <KeyboardAwareScrollView style={CommunityScreenStyles.screen}>
            <ScrollView>
                <View style={CommunityScreenStyles.mainContainer}>
                        <Card style={CommunityScreenStyles.card} onPress={() => console.log('Join was pressed')}>
                            <Card.Title title="Join Community" left={(props) => <IconButton {...props} style={{paddingRight: responsive.number(15)}} icon="account-multiple-plus"/>}/>
                            <Card.Cover/>
                            <Card.Content>
                                {/* <Text variant="titleLarge">Hello World</Text> */}
                                <Text variant="bodyLarge">Meet, chat, and collaborate — your next great community starts here.</Text>
                            </Card.Content>
                        </Card>
                        <Card style={CommunityScreenStyles.card}>
                            <Card.Title title="Create Community" left={(props) => <IconButton {...props} style={{paddingRight: responsive.number(15)}} icon="plus-box-multiple"/>}/>
                            <Card.Cover/>
                            <Card.Content>
                                {/* <Text variant="titleLarge">Hello World</Text> */}
                                <Text variant="bodyLarge">Lead the way — create a community and inspire others to join your mission!</Text>
                            </Card.Content>
                        </Card>
                        <Card style={CommunityScreenStyles.card}>
                            <Card.Title title="Manage Communities" left={(props) => <IconButton {...props} style={{paddingRight: responsive.number(15)}} icon="tune"/>}/>
                            <Card.Cover/>
                            <Card.Content>
                                {/* <Text variant="titleLarge">Hello World</Text> */}
                                <Text variant="bodyLarge">View all your joined communities — explore, manage, or leave anytime.</Text>
                            </Card.Content>
                        </Card>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

const CommunityScreenStyles = StyleSheet.create ({
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
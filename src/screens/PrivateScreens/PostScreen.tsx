import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Button, IconButton, Text, Card } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS } from "../../themes/colors";
import PostModal from "../../components/Modals/PostModal"
import AnnouncementModal from "../../components/Modals/AnnouncementModal";
import { responsive } from "../../utils/responsive";

export default function PostScreen() {
  const [isPostModalVisible, setPostModalVisible] = useState(false);
  const [isAnnouncementModalVisible, setAnnouncementModalVisible] = useState(false);

  const showPostModal = () => setPostModalVisible(true);
  const hidePostModal = () => setPostModalVisible(false);

  const showAnnouncementModal = () => setAnnouncementModalVisible(true);
  const hideAnnouncementModal = () => setAnnouncementModalVisible(false);

  return (
    <>
      <KeyboardAwareScrollView style={PostScreenStyles.screen}>
        <ScrollView>
          <View style={PostScreenStyles.mainContainer}>
            {/* Announcement Card */}
            <Card style={PostScreenStyles.card}>
              <Card.Title 
                title="Create Announcement" 
                left={(props) => <IconButton {...props} style={{paddingRight: responsive.number(15)}} icon="bullhorn-outline"/>}
              />
              <Card.Cover/>
              <Card.Content>
                <Text variant="bodyLarge">
                  Have big news? Post an announcement to keep your community informed.
                </Text>
              </Card.Content>
              <Card.Actions style={{ marginTop: responsive.number(20), marginBottom: responsive.number(10), justifyContent: "center" }}>
                <Button 
                  textColor={COLORS.primaryText} 
                  style={{backgroundColor: COLORS.primary}} 
                  mode="contained" 
                  onPress={showAnnouncementModal} // Open announcement modal
                >
                  Create Announcement
                </Button>
              </Card.Actions>
            </Card>

            {/* Post Card */}
            <Card style={PostScreenStyles.card}>
              <Card.Title 
                title="Create Post" 
                left={(props) => <IconButton {...props} style={{paddingRight: responsive.number(15)}} icon="pencil"/>}
              />
              <Card.Cover/>
              <Card.Content>
                <Text variant="bodyLarge">
                  Got something to say? Create a post and start the conversation!
                </Text>
              </Card.Content>
              <Card.Actions style={{ marginTop: responsive.number(20), marginBottom: responsive.number(10), justifyContent: "center" }}>
                <Button
                  textColor={COLORS.primaryText}
                  style={{backgroundColor: COLORS.primary}}
                  mode="contained"
                  onPress={showPostModal} // Open post modal
                >
                  Create Post
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      {/* Modals */}
      <PostModal isVisible={isPostModalVisible} hideModal={hidePostModal} />
      <AnnouncementModal isVisible={isAnnouncementModalVisible} hideModal={hideAnnouncementModal} />
    </>
  );
}

const PostScreenStyles = StyleSheet.create({
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
import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card, Text, IconButton, Button } from "react-native-paper";
import { responsive } from "../../utils/responsive";
import { COLORS } from "../../themes/colors";

// Modals:
import JoinCommunityModal from "../../components/Modals/JoinCommunityModal";
import CreateCommunityModal from "../../components/Modals/CreateCommunityModal";
import ManageCommunitiesModal from "../../components/Modals/ManageCommunitiesModal";

export default function CommunityScreen() {
  const [isJoinModalVisible, setJoinModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isManageModalVisible, setManageModalVisible] = useState(false);

  const showJoinModal = () => setJoinModalVisible(true);
  const hideJoinModal = () => setJoinModalVisible(false);

  const showCreateModal = () => setCreateModalVisible(true);
  const hideCreateModal = () => setCreateModalVisible(false);

  const showManageModal = () => setManageModalVisible(true);
  const hideManageModal = () => setManageModalVisible(false);

  return (
    <>
      <KeyboardAwareScrollView style={CommunityScreenStyles.screen}>
        <ScrollView>
          <View style={CommunityScreenStyles.mainContainer}>

            {/* Join Community Card */}
            <Card style={CommunityScreenStyles.card}>
              <Card.Title
                title="Join Community"
                left={(props) => (
                  <IconButton
                    {...props}
                    style={{ paddingRight: responsive.number(15) }}
                    icon="account-multiple-plus"
                  />
                )}
              />
              <Card.Cover />
              <Card.Content>
                <Text variant="bodyLarge">
                  Meet, chat, and collaborate — your next great community starts here.
                </Text>
              </Card.Content>
              <Card.Actions style={CommunityScreenStyles.cardActions}>
                <Button
                  textColor={COLORS.primaryText}
                  style={CommunityScreenStyles.cardButton}
                  mode="contained"
                  onPress={showJoinModal}
                >
                  Join Community
                </Button>
              </Card.Actions>
            </Card>

            {/* Create Community Card */}
            <Card style={CommunityScreenStyles.card}>
              <Card.Title
                title="Create Community"
                left={(props) => (
                  <IconButton
                    {...props}
                    style={{ paddingRight: responsive.number(15) }}
                    icon="plus-box-multiple"
                  />
                )}
              />
              <Card.Cover />
              <Card.Content>
                <Text variant="bodyLarge">
                  Lead the way — create a community and inspire others to join your mission!
                </Text>
              </Card.Content>
              <Card.Actions style={CommunityScreenStyles.cardActions}>
                <Button
                  textColor={COLORS.primaryText}
                  style={CommunityScreenStyles.cardButton}
                  mode="contained"
                  onPress={showCreateModal}
                >
                  Create Community
                </Button>
              </Card.Actions>
            </Card>

            {/* Manage Communities Card */}
            <Card style={CommunityScreenStyles.card}>
              <Card.Title
                title="Manage Communities"
                left={(props) => (
                  <IconButton
                    {...props}
                    style={{ paddingRight: responsive.number(15) }}
                    icon="tune"
                  />
                )}
              />
              <Card.Cover />
              <Card.Content>
                <Text variant="bodyLarge">
                  View all your joined communities — explore, manage, or leave anytime.
                </Text>
              </Card.Content>
              <Card.Actions style={CommunityScreenStyles.cardActions}>
                <Button
                  textColor={COLORS.primaryText}
                  style={CommunityScreenStyles.cardButton}
                  mode="contained"
                  onPress={showManageModal}
                >
                  Manage
                </Button>
              </Card.Actions>
            </Card>

          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      {/* Join Community Modal */}
      <JoinCommunityModal
        isVisible={isJoinModalVisible}
        hideModal={hideJoinModal}
      />

      {/* Create Community Modal */}
      <CreateCommunityModal
        isVisible={isCreateModalVisible}
        hideModal={hideCreateModal}
      />

      {/* Manage Communities Modal */}
      <ManageCommunitiesModal
        isVisible={isManageModalVisible}
        hideModal={hideManageModal}
      />
    </>
  );
}

const CommunityScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
    gap: responsive.number(20),
    alignItems: "center",
    justifyContent: "center",
    paddingTop: responsive.number(25),
    paddingBottom: responsive.number(25),
  },
  card: {
    width: responsive.number(325),
    height: "auto",
  },
  cardActions: {
    marginTop: responsive.number(20),
    marginBottom: responsive.number(10),
    justifyContent: "center",
  },
  cardButton: {
    backgroundColor: COLORS.primary,
  },
});

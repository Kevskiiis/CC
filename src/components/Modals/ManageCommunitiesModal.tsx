import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Modal, Button, Text, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ServerRoute } from "../../routes/ServerRoute";
import { responsive } from "../../utils/responsive";
import { Ionicons } from '@expo/vector-icons';

type Community = {
  community_id: number;
  community_name: string;
  community_bio: string;
  community_public_url?: string;
  role_name: string;
  join_code?: string;
};

type JoinRequest = {
  profile_id: string;
  displayname: string;
  date_requested: string;
};

type ManageCommunitiesModalProps = {
  isVisible: boolean;
  hideModal: () => void;
};

export default function ManageCommunitiesModal({ isVisible, hideModal }: ManageCommunitiesModalProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [joinQueues, setJoinQueues] = useState<{ [id: number]: JoinRequest[] }>({});
  const [loadingQueues, setLoadingQueues] = useState<{ [id: number]: boolean }>({});
  const tokenKey = "access_token";

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync(tokenKey);
      const res = await axios.get(`${ServerRoute}/get-user-communities`, {
        headers: { Authorization: String(token) },
      });
      setCommunities(res.data.communities || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinQueue = async (communityID: number) => {
    setLoadingQueues(prev => ({ ...prev, [communityID]: true }));
    try {
      const token = await SecureStore.getItemAsync(tokenKey);
      const res = await axios.get(
        `${ServerRoute}/get-community-join-queue?communityID=${communityID}`,
        { headers: { Authorization: String(token) } }
      );
      setJoinQueues(prev => ({ ...prev, [communityID]: res.data.joinQueue || [] }));
    } catch (err) {
      console.log(err);
      setJoinQueues(prev => ({ ...prev, [communityID]: [] }));
    } finally {
      setLoadingQueues(prev => ({ ...prev, [communityID]: false }));
    }
  };

  const approveRequest = async (communityID: number, profileID: string) => {
    const token = await SecureStore.getItemAsync(tokenKey);
    try {

        console.log(communityID);
        console.log(profileID); 
      await axios.post(
        `${ServerRoute}/approve-join-request`,
        { newUserID: profileID, communityID: communityID },
        { headers: { Authorization: String(token) } }
      );
      fetchJoinQueue(communityID);
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            console.log(err.response?.data);
            console.log(err.response?.status);
        } else {
            console.log(err);
        }
    }
  };

  const declineRequest = async (communityID: number, profileID: string) => {
    const token = await SecureStore.getItemAsync(tokenKey);
    try {
      await axios.delete(`${ServerRoute}/decline-join-request`, {
        headers: { Authorization: String(token) },
        data: { userID: profileID, communityID: communityID },
      });
      fetchJoinQueue(communityID);
    } catch (err) {
      console.log(err);
    }
  };

  const changeJoinCode = async (communityID: number) => {
    const token = await SecureStore.getItemAsync(tokenKey);
    try {
      await axios.patch(
        `${ServerRoute}/change-join-code`,
        { communityID },
        { headers: { Authorization: String(token) } }
      );
      fetchCommunities(); // Refresh to get new code
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isVisible) fetchCommunities();
  }, [isVisible]);

  return (
    <Modal visible={isVisible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
        <Ionicons name="close-circle" size={responsive.number(30)} color="#333" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator animating size="large" />
      ) : communities.length === 0 ? (
        <Text style={styles.noCommunitiesText}>No communities found.</Text>
      ) : (
        <ScrollView>
          {communities.map(c => (
            <View key={c.community_id} style={styles.communityCard}>
              {/* Community Name */}
              <Text style={styles.communityName}>{c.community_name}</Text>

              {/* Community Bio */}
              <Text style={styles.bio}>{c.community_bio}</Text>

              {/* Community Image */}
              {c.community_public_url && (
                <Image source={{ uri: c.community_public_url }} style={styles.image} />
              )}

              {/* Role */}
              <Text style={styles.role}>{c.role_name.toUpperCase()}</Text>

              {/* Join Code (for admin) */}
              {c.role_name === "admin" && (
                <Text style={styles.joinCodeText}>Join Code: {c.join_code}</Text>
              )}

              {/* Action Buttons */}
              <View style={styles.actions}>
                {c.role_name === "admin" && (
                  <>
                    <Button
                      mode="contained"
                      onPress={() => fetchJoinQueue(c.community_id)}
                      style={styles.actionButton}
                    >
                      View Join Requests
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => changeJoinCode(c.community_id)}
                      style={styles.actionButton}
                    >
                      Change Join Code
                    </Button>
                  </>
                )}
                <Button
                  mode="contained"
                  onPress={() => console.log("Leave Community pressed")}
                  style={styles.actionButton}
                >
                  Leave Community
                </Button>
              </View>

              {/* Join Queue */}
              {loadingQueues[c.community_id] && <ActivityIndicator />}
              {joinQueues[c.community_id] &&
                joinQueues[c.community_id].map(j => (
                  <View key={j.profile_id} style={styles.queueItem}>
                    <Text>{j.displayname}</Text>
                    <View style={styles.queueActions}>
                      <Button
                        mode="contained"
                        onPress={() => approveRequest(c.community_id, j.profile_id)}
                        style={styles.queueButton}
                      >
                        Approve
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => declineRequest(c.community_id, j.profile_id)}
                        style={styles.queueButton}
                      >
                        Decline
                      </Button>
                    </View>
                  </View>
                ))}
            </View>
          ))}
        </ScrollView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    margin: responsive.number(20),
    padding: responsive.number(15),
    borderRadius: responsive.number(10),
    maxHeight: "90%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: responsive.number(10),
    right: responsive.number(10),
    zIndex: 10,
  },
  noCommunitiesText: {
    textAlign: "center",
    marginTop: responsive.number(20),
    fontSize: responsive.number(16),
  },
  communityCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: responsive.number(10),
    padding: responsive.number(15),
    marginBottom: responsive.number(15),
    backgroundColor: "#f9f9f9",
    alignItems: "center", // center everything vertically
  },
  communityName: {
    fontSize: responsive.number(20),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: responsive.number(10),
  },
  bio: {
    paddingHorizontal: responsive.number(10),
    textAlign: "center",
    marginBottom: responsive.number(10),
    fontSize: responsive.number(14),
    color: "#333",
  },
  image: {
    width: "100%",
    height: responsive.number(150),
    marginBottom: responsive.number(10),
    borderRadius: responsive.number(5),
  },
  role: {
    fontSize: responsive.number(16),
    fontWeight: "600",
    color: "#0066cc",
    textAlign: "center",
    marginBottom: responsive.number(5),
  },
  joinCodeText: {
    fontSize: responsive.number(16),
    fontWeight: "700",
    color: "#cc6600",
    textAlign: "center",
    marginBottom: responsive.number(10),
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // center buttons
    gap: responsive.number(5),
    marginBottom: responsive.number(10),
  },
  actionButton: {
    marginHorizontal: responsive.number(5),
    marginBottom: responsive.number(5),
  },
  queueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: responsive.number(5),
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: "100%",
    paddingHorizontal: responsive.number(10),
  },
  queueActions: {
    flexDirection: "row",
    gap: responsive.number(5),
  },
  queueButton: {
    marginLeft: responsive.number(5),
  },
});

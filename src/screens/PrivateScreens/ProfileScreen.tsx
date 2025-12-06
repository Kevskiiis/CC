import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Avatar, IconButton, Text, Divider, Button } from "react-native-paper";
import { responsive } from "../../utils/responsive";
import { COLORS } from "../../themes/colors";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ServerRoute } from "../../routes/ServerRoute";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PrivateRoutesStackParams } from "../../routes/PrivateRoutes";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<PrivateRoutesStackParams>>();

  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
    //   console.log(token);
      const res = await axios.get(`${ServerRoute}/get-own-account`, {
        headers: { Authorization: String(token) },
      });
      setUser(res.data.userObject);
      setBioText(res.data.userObject.bio || "");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const mimeType = asset.mimeType ?? "image/jpeg";
      const fileName =
        asset.fileName ??
        `avatar_${Date.now()}.${mimeType.split("/")[1] ?? "jpg"}`;

      setUploadingAvatar(true);
      setErrorMessage(null);

      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (!token) {
          setErrorMessage("You need to sign in to update your profile picture.");
          setUploadingAvatar(false);
          return;
        }

        const formData = new FormData();
        formData.append("newProfileImage", {
          uri,
          name: fileName,
          type: mimeType,
        } as any);

        const res = await axios.patch(
          `${ServerRoute}/update-profile-picture`,
          formData,
          {
            headers: {
              Authorization: String(token),
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const newImageUrl = res.data?.newImageUrl ?? uri;
        setUser((prev: any) => ({ ...prev, avatar_public_url: newImageUrl }));
      } catch (err) {
        setErrorMessage("Could not update profile picture. Please try again.");
        console.log("update-profile-picture error:", err);
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const saveBio = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        setErrorMessage("You need to sign in to update your bio.");
        return;
      }
      if (!bioText.trim()) {
        setErrorMessage("Bio cannot be empty.");
        return;
      }
      await axios.patch(
        `${ServerRoute}/update-bio`,
        { newBio: bioText },
        { headers: { Authorization: String(token) } }
      );
      setUser((prev: any) => ({ ...prev, bio: bioText }));
      setEditingBio(false);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage("Could not update bio. Please try again.");
      console.log("update-bio error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={ProfileScreenStyles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={ProfileScreenStyles.loadingContainer}>
        <Text>Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ProfileScreenStyles.container}>
      {/* Top Nav */}
      <View style={ProfileScreenStyles.TopNavContainer}>
        <Text style={ProfileScreenStyles.navTitle}>Profile</Text>
        <IconButton
          icon="cog"
          size={30}
          onPress={() => navigation.navigate("Settings")}
        />
      </View>

      {/* Profile Section */}
      <View style={ProfileScreenStyles.profileContainer}>
        {/* Editable Avatar */}
        <TouchableOpacity onPress={pickImage}>
          {user.avatar_public_url ? (
            <Avatar.Image
              size={responsive.number(120)}
              source={{ uri: user.avatar_public_url }}
              style={ProfileScreenStyles.avatar}
            />
          ) : (
            <Avatar.Icon
              size={responsive.number(120)}
              icon="account"
              style={ProfileScreenStyles.avatarPlaceholder}
            />
          )}
        <Text style={ProfileScreenStyles.editAvatarText}>
          {uploadingAvatar ? "Updating..." : "Change Picture"}
        </Text>
        </TouchableOpacity>

        {/* Display Name */}
        <Text style={ProfileScreenStyles.displayName}>{user.display_name}</Text>

        {/* Editable Bio */}
        <View style={ProfileScreenStyles.bioContainer}>
          {!!errorMessage && <Text style={ProfileScreenStyles.errorText}>{errorMessage}</Text>}
          {editingBio ? (
            <>
              <TextInput
                style={ProfileScreenStyles.bioInput}
                multiline
                value={bioText}
                onChangeText={setBioText}
                placeholder="Enter your bio..."
              />
              <Button
                mode="contained"
                onPress={saveBio}
                style={ProfileScreenStyles.saveBioButton}
                labelStyle={ProfileScreenStyles.saveBioButtonLabel}
              >
                Save Bio
              </Button>
            </>
          ) : (
            <>
              <Text style={ProfileScreenStyles.bio}>
                {user.bio || "You haven’t added a bio yet."}
              </Text>
              <Button
                mode="outlined"
                onPress={() => setEditingBio(true)}
                style={ProfileScreenStyles.editBioButton}
                labelStyle={ProfileScreenStyles.editBioButtonLabel}
              >
                Edit Bio
              </Button>
            </>
          )}
        </View>
      </View>

      <Divider style={ProfileScreenStyles.divider} />
    </ScrollView>
  );
}

const ProfileScreenStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  TopNavContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: responsive.number(65),
    paddingHorizontal: responsive.number(15),
    backgroundColor: COLORS.primary,
  },
  navTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: "bold",
    color: COLORS.onPrimary,
  },
  profileContainer: {
    marginTop: responsive.number(20),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsive.number(15),
    gap: responsive.number(15),
  },
  avatar: {
    borderWidth: responsive.number(2),
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.surface,
  },
  editAvatarText: {
    textAlign: "center",
    color: COLORS.primary,
    marginTop: responsive.number(5),
    fontWeight: "bold",
  },
  displayName: {
    fontSize: responsive.fontSize(22),
    fontWeight: "bold",
    color: COLORS.primaryText,
    textAlign: "center",
  },
  bioContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: responsive.number(10),
  },
  bio: {
    fontSize: responsive.fontSize(14),
    color: COLORS.text,
    textAlign: "center",
    marginBottom: responsive.number(10),
  },
  bioInput: {
    width: "100%",
    minHeight: responsive.number(80),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: responsive.number(8),
    padding: responsive.number(10),
    textAlignVertical: "top",
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: responsive.fontSize(14),
    marginBottom: responsive.number(10),
  },
  editBioButton: {
    borderColor: COLORS.primary,
    width: responsive.number(120),
    justifyContent: "center",
  },
  editBioButtonLabel: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  saveBioButton: {
    backgroundColor: COLORS.primary,
    width: responsive.number(120),
    justifyContent: "center",
  },
  saveBioButtonLabel: {
    color: COLORS.onPrimary,
    fontWeight: "bold",
  },
  divider: {
    marginTop: responsive.number(20),
    backgroundColor: COLORS.border,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#b00020",
    marginBottom: responsive.number(8),
    textAlign: "center",
  },
});

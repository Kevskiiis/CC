import { Button, IconButton, TextInput, Modal, Portal, ActivityIndicator, MD2Colors, Menu, Text } from "react-native-paper";
import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { responsive } from "../../utils/responsive";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import ErrorBox from "../ErrorBox";
import SuccessBox from "../SuccessBox";
import { COLORS } from "../../themes/colors";

type CreateCommunityModalProps = {
  isVisible: boolean;
  hideModal: () => void;
};

type PickedImage = {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string;
  type?: string;
};

export default function CreateCommunityModal({
  isVisible,
  hideModal,
}: CreateCommunityModalProps) {
  const [communityName, setCommunityName] = useState("");
  const [communityBio, setCommunityBio] = useState("");
  const [selectedImage, setSelectedImage] = useState<PickedImage | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setCommunityName("");
    setCommunityBio("");
    setSelectedImage(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("Permission to access media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type ?? "image/jpeg",
        fileName: asset.fileName ?? "communityImage.jpg",
      });
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        setErrorMessage("You are not signed in.");
        setLoading(false);
        return;
      }

      const form = new FormData();
      form.append("communityName", communityName);
      form.append("communityBio", communityBio);

      if (selectedImage) {
      console.log(selectedImage);

      // Make sure type is a valid MIME type
      let mimeType = selectedImage.type;
      if (!mimeType || !mimeType.includes("/")) {
        const ext = selectedImage.fileName?.split(".").pop() || "jpeg";
        mimeType = `image/${ext}`;
      }

      form.append("communityImage", {
        uri: selectedImage.uri,
        name: selectedImage.fileName || "communityImage.jpg",
        type: mimeType,
      } as any);
    }

      const response = await axios.post('https://ccbackend-production-5adb.up.railway.app/create-community',
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: String(token),
          },
        }
      );
      console.log(response.data);
      console.log(response.data.success); 

      if (response.data.success) {
        setTimeout(() => {
          setSuccessMessage(response.data.message || "Community created successfully!");
        }, 3000);
        resetForm();
      } else {
        setErrorMessage(response.data.message || "Could not create community.");
      }
    } catch (err: any) {
        console.log(err);
        // console.log(err?.response?.data?.message );
        setErrorMessage(
            err?.response?.data?.message ||
            "An unexpected error occurred while creating the community."
        );
    }

    setLoading(false);
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={() => {
          resetForm();
          hideModal();
        }}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.header}>Create Community</Text>

        {errorMessage ? <ErrorBox message={errorMessage} /> : null}
        {successMessage ? <SuccessBox message={successMessage} /> : null}

        <TextInput
          label="Community Name"
          value={communityName}
          onChangeText={setCommunityName}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Community Bio"
          value={communityBio}
          onChangeText={setCommunityBio}
          style={styles.input}
          mode="outlined"
          multiline
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
          ) : (
            <Text style={{ color: COLORS.primary }}>Select Image</Text>
          )}
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            animating={true}
            color={MD2Colors.blue500}
            style={{ marginTop: responsive.number(30) }}
          />
        ) : (
          <Button mode="contained" textColor={COLORS.primaryText} style={styles.submitButton} onPress={handleCreate}>
            Create Community
          </Button>
        )}

        <Button
          mode="text"
          textColor={COLORS.primaryText}
          style={{backgroundColor: COLORS.primary}}
          onPress={() => {
            resetForm();
            hideModal();
          }}
        >
          Close
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.textOnDark,
    padding: responsive.number(20),
    margin: responsive.number(20),
    borderRadius: responsive.number(12),
  },
  header: {
    fontSize: responsive.number(20),
    fontWeight: "600",
    marginBottom: responsive.number(15),
    color: COLORS.primaryText,
  },
  input: {
    marginBottom: responsive.number(15),
  },
  imagePicker: {
    height: responsive.number(150),
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    borderRadius: responsive.number(10),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsive.number(20),
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: responsive.number(10),
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    marginBottom: responsive.number(15),
  },
});
import { Button, IconButton, TextInput, Modal, Portal, ActivityIndicator, MD2Colors, Menu, Text } from "react-native-paper";
import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { responsive } from "../utils/responsive";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import ErrorBox from "./ErrorBox";
import SuccessBox from "./SuccessBox";
import { COLORS } from "../themes/colors";

type Announcement = {
  communityID: number | null; 
  communityName: string | null;
  announcementTitle: string;
  announcementDescription: string;
  announcementRole: string; 
  announcementImage: string | null;
}

const roles = ["Alert", "Reminder", "Event"]; 

function AnnouncementModal({ isVisible, hideModal }: { isVisible: boolean, hideModal: () => void }) {
  const [announcementForm, setAnnouncementForm] = useState<Announcement>({
    communityID: null,
    communityName: null,
    announcementTitle: '',
    announcementDescription: '',
    announcementRole: '',
    announcementImage: null
  });

  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState({ errorState: false, message: '' });
  const [success, setSuccess] = useState({ successState: false, message: '' });

  const [communityMenuVisible, setCommunityMenuVisible] = useState(false);
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);

  useEffect(() => {
    if (isVisible) getCommunities();
  }, [isVisible]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAnnouncementForm(prev => ({ ...prev, announcementImage: result.assets[0].uri }));
    }
  }

  const getCommunities = async () => {
    try {
      setIsLoading(true);
      setError({ errorState: false, message: '' });

      const accessToken = await SecureStore.getItemAsync('access_token');
      const result = await axios.get('https://ccbackend-production-5adb.up.railway.app/get-user-communities', { 
        headers: { Authorization: accessToken }
      });

      const data = result.data;

      if (data.success) setCommunities(data.communities || []);
      else setError({ errorState: true, message: data.message });

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError({ errorState: true, message: err.response?.data?.message || 'Unexpected error' });
    }
  }

  const handleCommunitySelect = (community: any) => {
    setAnnouncementForm(prev => ({
      ...prev,
      communityID: community.community_id,
      communityName: community.community_name
    }));
    setCommunityMenuVisible(false);
  }

  const handleRoleSelect = (role: string) => {
    setAnnouncementForm(prev => ({ ...prev, announcementRole: role }));
    setRoleMenuVisible(false);
  }

  const handleChange = (inputName: string, newText: string) => {
    setAnnouncementForm(prev => ({ ...prev, [inputName]: newText }));
  }

  const createAnnouncement = async () => {
    if (!announcementForm.communityID || !announcementForm.announcementTitle || !announcementForm.announcementDescription || !announcementForm.announcementRole) {
      setError({ errorState: true, message: 'Please fill all required fields' });
      return;
    }

    try {
      setIsLoading(true);
      setError({ errorState: false, message: '' });
      setSuccess({ successState: false, message: '' });

      const accessToken = await SecureStore.getItemAsync('access_token');
      const formData = new FormData();

      formData.append("communityID", String(announcementForm.communityID));
      formData.append("communityName", String(announcementForm.communityName));
      formData.append("announcementTitle", announcementForm.announcementTitle);
      formData.append("announcementDescription", announcementForm.announcementDescription);
      formData.append("announcementRole", announcementForm.announcementRole);

      if (announcementForm.announcementImage) {
        const fileName = announcementForm.announcementImage.split("/").pop();
        const match = /\.(\w+)$/.exec(fileName ?? "");
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("announcementImage", {
          uri: announcementForm.announcementImage,
          name: fileName,
          type: type,
        } as any);
      }

      const response = await fetch("https://ccbackend-production-5adb.up.railway.app/create-announcement", { 
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: String(accessToken)
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsLoading(false);
        setSuccess({ successState: true, message: "Announcement created successfully!" });
        // Reset form
        setAnnouncementForm({
          communityID: null,
          communityName: null,
          announcementTitle: '',
          announcementDescription: '',
          announcementRole: '',
          announcementImage: null
        });
      } else {
        setIsLoading(false);
        setError({ errorState: true, message: data.message });
      }
    } catch (err: any) {
      setIsLoading(false);
      setError({ errorState: true, message: err.response?.data?.message || 'Unexpected error' });
    }
  }

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={hideModal} contentContainerStyle={postModalStyles.modal}>
        <ScrollView contentContainerStyle={{ paddingBottom: responsive.number(20) }} showsVerticalScrollIndicator>
          {error.errorState && <ErrorBox message={error.message} width={297}/>}
          {success.successState && <SuccessBox message={success.message} width={297}/>}
          {isLoading && <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size={responsive.number(60)}/>}

          {/* Community Dropdown */}
          <View style={{ marginBottom: responsive.number(10) }}>
            <Menu
              visible={communityMenuVisible}
              onDismiss={() => setCommunityMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setCommunityMenuVisible(prev => !prev)}>
                  {announcementForm.communityName || "Select Community"}
                </Button>
              }
            >
              {communities.length > 0 ? communities.map((community) => (
                <Menu.Item
                  key={community.community_id}
                  onPress={() => handleCommunitySelect(community)}
                  title={community.community_name}
                />
              )) : <Text style={{ padding: 10 }}>No communities found</Text>}
            </Menu>
          </View>

          {/* Announcement Role Dropdown */}
          <View style={{ marginBottom: responsive.number(10) }}>
            <Menu
              visible={roleMenuVisible}
              onDismiss={() => setRoleMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setRoleMenuVisible(prev => !prev)}>
                  {announcementForm.announcementRole || "Select Role"}
                </Button>
              }
            >
              {roles.map((role) => (
                <Menu.Item key={role} title={role} onPress={() => handleRoleSelect(role)} />
              ))}
            </Menu>
          </View>

          {/* Announcement Title */}
          <TextInput
            label="Announcement Title"
            value={announcementForm.announcementTitle}
            onChangeText={text => handleChange('announcementTitle', text)}
            style={{ marginBottom: responsive.number(10) }}
          />

          {/* Announcement Description */}
          <TextInput
            label="Announcement Description"
            value={announcementForm.announcementDescription}
            onChangeText={text => handleChange('announcementDescription', text)}
            multiline
            numberOfLines={4}
            style={{ marginBottom: responsive.number(10) }}
          />

          {/* Announcement Image */}
          {announcementForm.announcementImage && (
            <Image
              source={{ uri: announcementForm.announcementImage }}
              style={{ width: responsive.number(297), height: responsive.number(120), marginBottom: 10 }}
            />
          )}

          <TouchableOpacity
            style={{
              padding: responsive.number(10),
              backgroundColor: '#ddd',
              alignItems: 'center',
              borderRadius: responsive.number(5),
              marginBottom: responsive.number(10)
            }}
            onPress={pickImage}
          >
            <Text>Select Image</Text>
          </TouchableOpacity>

          <Button textColor={COLORS.primaryText} style={{backgroundColor: COLORS.primary}} mode="contained" onPress={createAnnouncement}>
            Submit Announcement
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  )
}

export default AnnouncementModal;

const postModalStyles = StyleSheet.create({
  modal: {
    borderRadius: responsive.number(15),
    padding: responsive.number(15),
    width: responsive.number(320),
    maxHeight: responsive.number(520),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignSelf: 'center'
  },
});

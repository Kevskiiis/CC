import { Button, TextInput, Modal, Portal, ActivityIndicator, MD2Colors, Text } from "react-native-paper";
import { StyleSheet, ScrollView, View } from "react-native";
import { useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { responsive } from "../../utils/responsive";
import ErrorBox from "../ErrorBox";
import SuccessBox from "../SuccessBox";
import { COLORS } from "../../themes/colors";

interface JoinCommunityModalProps {
  isVisible: boolean;
  hideModal: () => void;
}

function JoinCommunityModal({ isVisible, hideModal }: JoinCommunityModalProps) {
  const [communityCode, setCommunityCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState({ errorState: false, message: '' });
  const [success, setSuccess] = useState({ successState: false, message: '' });

  const handleSubmit = async () => {
    if (!communityCode.trim()) {
      setError({ errorState: true, message: "Please enter a community code." });
      return;
    }

    try {
      setIsLoading(true);
      setError({ errorState: false, message: '' });
      setSuccess({ successState: false, message: '' });

      const accessToken = await SecureStore.getItemAsync('access_token');

      const response = await axios.post(
        "https://ccbackend-production-5adb.up.railway.app/join-community",
        { communityCode: communityCode.trim() },
        {
          headers: {
            Authorization: accessToken
          }
        }
      );

      const data = response.data;

      if (data.success) {
        setIsLoading(false);
        setSuccess({ successState: true, message: data.message });
        setCommunityCode(''); // Reset input
      } else {
        setIsLoading(false);
        setError({ errorState: true, message: data.message });
      }
    } catch (err: any) {
      setIsLoading(false);
      setError({ errorState: true, message: err.response?.data?.message || 'Unexpected error. Try again.' });
    }
  };

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
        <ScrollView contentContainerStyle={{ paddingBottom: responsive.number(20) }}>
          {error.errorState && <ErrorBox message={error.message} width={297} />}
          {success.successState && <SuccessBox message={success.message} width={297} />}
          {isLoading && <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size={responsive.number(60)} />}

          <TextInput
            label="Enter Community Code"
            value={communityCode}
            onChangeText={text => setCommunityCode(text)}
            style={{ marginBottom: responsive.number(10) }}
          />

          <Button
            mode="contained"
            textColor={COLORS.primaryText}
            style={{ backgroundColor: COLORS.primary }}
            onPress={handleSubmit}
          >
            Submit
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

export default JoinCommunityModal;

const styles = StyleSheet.create({
  modal: {
    borderRadius: responsive.number(15),
    padding: responsive.number(15),
    width: responsive.number(320),
    maxHeight: responsive.number(300),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignSelf: 'center'
  },
});

import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OpeningRoutesStackParams } from '../routes/OpeningRoutes';
import { useAuth } from '../context/AuthContext';

type props = NativeStackScreenProps<OpeningRoutesStackParams, 'LoginScreen'>;

export default function LoginScreen({ navigation }: props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  async function onLogin() {
    // TODO: call your real verify endpoint here with { email, password }.
    // If it succeeds and returns a user, do: signIn({ id, email, username });
    // For now, just flip auth so you can reach Home:
    signIn();
  }

  return (
    <KeyboardAwareScrollView enableOnAndroid>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          onChangeText={setEmail}
          style={styles.textInput}
          value={email}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          onChangeText={setPassword}
          style={styles.textInput}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    height: 400,
    width: 300,
  },
  textInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16,
    height: 50,
    width: 275,
    backgroundColor: '#ffffffff',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderRadius: 10,
    height: 50,
    width: 275,
    backgroundColor: '#000000ff',
  },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 20 },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderRadius: 15,
    width: 90,
    height: 50,
    backgroundColor: '#000000ff',
  },
  backButtonContainer: {
    position: 'relative',
    top: 85,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 275,
    height: 'auto',
  },
});
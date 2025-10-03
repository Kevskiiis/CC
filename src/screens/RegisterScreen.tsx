import { StyleSheet, View, Text, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import { useState, useRef } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OpeningRoutesStackParams } from '../routes/OpeningRoutes';

import { responsive } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';

type props = NativeStackScreenProps<OpeningRoutesStackParams, 'RegisterScreen'>;

export default function RegisterScreen({ navigation }: props) {
  // References:
  const firstName = useRef<TextInput>(null);
  const lastName  = useRef<TextInput>(null);
  const phoneRef  = useRef<PhoneInput>(null);
  const email     = useRef<TextInput>(null);
  const password  = useRef<TextInput>(null);

  // (Values not used yet; kept for future API)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const { signIn } = useAuth();

  async function onCreate() {
    // TODO: call your /auth/register with `form`. On success:
    console.log('Create pressed with:', form);
    signIn(); // <- this flips to Home (MainRoutes)
  }

  return (
    <KeyboardAwareScrollView
      style={styles.scrollViewOutside}
      contentContainerStyle={styles.scrollViewInside}
      enableOnAndroid={true}
      extraScrollHeight={responsive.number(100)}
      enableAutomaticScroll={true}
      keyboardOpeningTime={350}
    >
      <View style={styles.formContainer}>
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* New User Entries */}
        <View style={styles.inputsContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            ref={firstName}
            style={styles.textInput}
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(v) => setForm(s => ({ ...s, firstName: v }))}
            onSubmitEditing={() => lastName.current?.focus()}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            ref={lastName}
            style={styles.textInput}
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={(v) => setForm(s => ({ ...s, lastName: v }))}
            onSubmitEditing={() => email.current?.focus()}
          />

          <Text style={styles.label}>Phone Number</Text>
          <PhoneInput
            ref={phoneRef}
            initialCountry="us"
            autoFormat={true}
            style={styles.phoneInput}
            textStyle={{ fontSize: responsive.number(16) }}
            flagStyle={{ width: responsive.number(30), height: responsive.number(20) }}
            onChangePhoneNumber={(v) => setForm(s => ({ ...s, phone: v }))}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            ref={email}
            style={styles.textInput}
            placeholder="Email"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm(s => ({ ...s, email: v }))}
            onSubmitEditing={() => password.current?.focus()}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            ref={password}
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            value={form.password}
            onChangeText={(v) => setForm(s => ({ ...s, password: v }))}
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <TouchableOpacity style={styles.button} onPress={onCreate}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 20 },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: responsive.number(4),
    borderRadius: responsive.number(10),
    marginTop: responsive.number(10),
    height: responsive.number(50),
    width: responsive.number(275),
    backgroundColor: '#000000ff',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: responsive.number(4),
    borderRadius: responsive.number(15),
    width: responsive.number(100),
    height: responsive.number(50),
    backgroundColor: '#000000ff',
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: responsive.number(8),
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    height: responsive.number(30),
    width: '100%',
  },
  scrollViewOutside: {},
  scrollViewInside: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: responsive.number(50),
    paddingBottom: responsive.number(30),
    backgroundColor: '#4087d8ff',
  },
  formContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: responsive.number(15),
    paddingTop: responsive.number(10),
    paddingLeft: responsive.number(5),
    paddingRight: responsive.number(5),
    width: responsive.number(340),
    height: responsive.number(700),
    borderWidth: responsive.number(6),
    borderRadius: responsive.number(8),
    backgroundColor: '#D0F0C0',
  },
  backButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: responsive.number(60),
  },
  inputsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: responsive.number(10),
    paddingLeft: responsive.number(10),
    paddingRight: responsive.number(10),
    width: '100%',
    height: responsive.number(600),
  },
  phoneInput: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: responsive.number(10),
    borderWidth: responsive.number(4),
    fontSize: responsive.number(16),
    height: responsive.number(50),
    width: '100%',
    color: '#000000ff',
    backgroundColor: '#ffffff',
  },
  textInput: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: responsive.number(10),
    borderWidth: responsive.number(4),
    fontSize: responsive.number(16),
    height: responsive.number(50),
    width: '100%',
    color: '#000000ff',
    backgroundColor: '#ffffff',
  },
});
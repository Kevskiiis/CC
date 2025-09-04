import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import OpeningScreen from './src/screens/OpeningScreen';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <OpeningScreen /> */}
      <LoginScreen/> 
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import OpeningScreen from './src/screens/OpeningScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <OpeningScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image } from 'react-native';

export default function OpeningScreen() {
  return (
    <View style={styles.container}>
        <Image 
            source={{uri:'https://tse1.mm.bing.net/th/id/OIP.fssi_WH8r1e_i5oXsAmKYwHaEQ?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3'}}
                    style={{width: 150, height: 150}}
        ></Image>
        <Button title='Login'></Button>
        <Button title='Create Account'></Button>
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

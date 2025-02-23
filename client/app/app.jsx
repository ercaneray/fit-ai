import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import FrontPage from './src/screens/frontpage';
import ProgramScreen from './src/screens/workout-program';
import FormScreen from './src/screens/form';
import HomeScreen from './src/screens/tabs/main-page';
import { Buffer } from 'buffer';
import { ProgramProvider } from "./src/components/program-context";


global.Buffer = Buffer;

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false); // Font yükleme durumunu kontrol eden state

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        BebasNeue: require('./src/assets/fonts/BebasNeue-Regular.ttf'), // Font dosyası yolu
      });
      setFontsLoaded(true); // Fontlar yüklendikten sonra state'i güncelle
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    // Fontlar yüklenmeden önce yükleme göstergesi
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ProgramProvider>
      <HomeScreen />
      <ProgramScreen/>
      </ProgramProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Siyah bir arka plan
  },
});

export default App;
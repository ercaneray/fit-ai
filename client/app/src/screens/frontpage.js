import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles/frontpage.style';

const FrontPage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/src/screens/sign-up');
  };

  const handleLogin = () => {
    router.push('/src/screens/Login');
  };

  return (
    <ImageBackground
      source={require('../assets/photos/man.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.getStartedButton} 
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>
              HEMEN BAŞLA <MaterialCommunityIcons name="arrow-right" size={20} color="#000" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>GİRİŞ YAP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default FrontPage;
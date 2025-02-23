import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text } from "react-native-paper";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Kullanıcı ID'si için
import styles from './styles/Login.style';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:6000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Giriş başarısız.');
      }
  
      // Kullanıcı doküman ID'sini al
      const userId = data.user?.id;
      
      if (!userId) {
        throw new Error('Kullanıcı bilgileri alınamadı.');
      }
  
      // Kullanıcı bilgilerini kaydet
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userEmail', email);
  
      // Program kontrolü
      const programResponse = await fetch(`http://localhost:6000/get-program/${userId}`);
      const programData = await programResponse.json();
  
      if (!programResponse.ok) {
        throw new Error('Program bilgisi alınamadı.');
      }
  
      // Program varsa ana sayfaya, yoksa form sayfasına yönlendir
      if (programData.gymProgram) {
        router.push('/src/screens/tabs/main-page');
      } else {
        router.push('/src/screens/form');
      }
  
    } catch (error) {
      console.error('Giriş Hatası:', error);
      Alert.alert('Hata', error.message || 'Giriş yapılırken bir hata oluştu.');
    }
  };

  const handleForgotPassword = () => {
    router.push('/src/screens/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/src/screens/sign-up');
  };


  return (
    <LinearGradient
      colors={['#1a1a1a', '#000']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.background}>
              {/* Logo Container */}
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/photos/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Başlık */}
              <Text style={styles.title}>FIT AI</Text>
                <Text style={styles.subtitle}>Gücünü Keşfet</Text>

              {/* Giriş Formu */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="email"
                    size={24}
                    color="#BBF246"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    textColor="#FFF"
                    placeholder="Email"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    mode="flat"
                    underlineColor="transparent"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="lock"
                    size={24}
                    color="#BBF246"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Şifre"
                    textColor="#FFF"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="flat"
                    underlineColor="transparent"
                  />
                </View>

                <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Şifremi unuttum</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <LinearGradient
                    colors={['#BBF246', '#9CC840']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Hesabın yok mu? </Text>
                  <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.signupLink}>Kayıt Ol</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
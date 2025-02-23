import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,handleGoBack,SafeAreaView,KeyboardAvoidingView,Platform,ScrollView,Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles/forgot-password.style';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // İkon kütüphanesi


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen bir e-posta adresi girin!');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin!');
      return;
    }
    console.log('Password reset email sent to:', email);
    Alert.alert('Başarılı', 'Şifre sıfırlama bağlantısı gönderildi!');
  };

  return (
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
            {/* Başlık */}
            <Text style={[styles.title, { fontFamily: 'BebasNeue' }]}>Forgot Password</Text>

            {/* Email Giriş Alanı */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={24} color="#BBF246" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                textColor='#BBF246'
                placeholder="Email"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Şifre Sıfırlama Butonu */}
            <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
              <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default ForgotPassword;

import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { TextInput, Card, ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { ProgramContext } from "../components/program-context";
import styles from "./styles/form.style";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MultiStepFormScreen = () => {
  const [step, setStep] = useState(1); // Adım numarası
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [gender, setGender] = useState(""); // Kadın/Erkek seçimi için state
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu
  const router = useRouter();
  const { programData, setProgramData } = useContext(ProgramContext);

// Program varsa anasayfaya yönlendir
useEffect(() => {
  if (programData?.program) {
    router.push("/src/screens/main-page");
  }
}, [programData]);

  const totalSteps = 5; // Toplam adım sayısı

  const handleNextStep = () => {
    if (
      (step === 1 && !age) ||
      (step === 2 && !height) ||
      (step === 3 && !weight) ||
      (step === 4 && !gender)
    ) {
      Alert.alert("Hata", "Lütfen ilgili alanı doldurun!");
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  const handleSubmit = async () => {
    if (!age || !weight || !height || !gender) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    setIsLoading(true);
    try {
      // Kullanıcı ID'sini al
      const userId = await AsyncStorage.getItem('userId');
      const userEmail = await AsyncStorage.getItem('userEmail');

      if (!userId || !userEmail) {
        throw new Error('Kullanıcı bilgileri bulunamadı');
      }

      // Önce mevcut kullanıcı bilgilerini al
      const userResponse = await fetch(`http://localhost:6000/get-program/${userId}`);
      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      // Form verilerini kaydet
      const response = await fetch(`http://localhost:6000/update-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password: userData.password || '', // Mevcut şifreyi koru
          gymProgram: userData.gymProgram || null, // Mevcut spor programını koru
          dietProgram: userData.dietProgram || null, // Mevcut diyet programını koru
          age: parseInt(age),
          weight: parseInt(weight),
          height: parseInt(height),
          gender,
          daysPerWeek
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Form bilgileri kaydedilemedi');
      }

      // Verileri Context'e kaydet
      setProgramData({
        age,
        weight,
        height,
        gender,
        daysPerWeek,
        program: null,
      });

      // VotePage sayfasına yönlendir
      router.push("/src/screens/votepage");
    } catch (error) {
      console.error('Form Kaydetme Hatası:', error);
      Alert.alert("Hata", error.message || "Form bilgileri kaydedilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BBF246" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* İlerleme Çubuğu */}
      <ProgressBar
        progress={step / totalSteps}
        color="#BBF246"
        style={styles.progressBar}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{`Adım ${step} / ${totalSteps}`}</Text>
          <Card style={styles.card}>
            {/* Adım 1: Yaş */}
            {step === 1 && (
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={24}
                  color="#BBF246"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  textColor="#ccc"
                  placeholder="Yaşınızı Giriniz"
                  placeholderTextColor="#aaa"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Adım 2: Boy */}
            {step === 2 && (
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="human-male-height"
                  size={24}
                  color="#BBF246"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  textColor="#ccc"
                  placeholder="Boyunuzu Giriniz (Cm)"
                  placeholderTextColor="#aaa"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Adım 3: Kilo */}
            {step === 3 && (
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="weight-kilogram"
                  size={24}
                  color="#BBF246"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  textColor="#ccc"
                  placeholder="Kilonuzu Giriniz (Kg)"
                  placeholderTextColor="#aaa"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Adım 4: Cinsiyet */}
            {step === 4 && (
              <View style={styles.genderContainer}>
                <Text style={styles.sliderText}>Cinsiyetinizi Seçiniz</Text>
                <View style={styles.genderOptions}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "Women" && styles.selectedGenderButton,
                    ]}
                    onPress={() => setGender("Women")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "Women" && styles.selectedGenderButtonText,
                      ]}
                    >
                      Women
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "Man" && styles.selectedGenderButton,
                    ]}
                    onPress={() => setGender("Man")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "Man" && styles.selectedGenderButtonText,
                      ]}
                    >
                      Man
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Adım 5: Haftalık Gün Sayısı */}
            {step === 5 && (
              <>
                <Text style={styles.sliderText}>Haftalık Gün Sayısı: {daysPerWeek}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={7}
                  step={1}
                  value={daysPerWeek}
                  onValueChange={(value) => setDaysPerWeek(value)}
                  minimumTrackTintColor="#BBF246"
                  maximumTrackTintColor="#ccc"
                  thumbTintColor="#BBF246"
                />
              </>
            )}

            {/* Adım Butonları */}
            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity style={styles.neonButton} onPress={handlePreviousStep}>
                  <Text style={styles.neonButtonText}>Geri</Text>
                </TouchableOpacity>
              )}
              {step < totalSteps ? (
                <TouchableOpacity style={styles.neonButton} onPress={handleNextStep}>
                  <Text style={styles.neonButtonText}>İleri</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.neonButton} onPress={handleSubmit}>
                  <Text style={styles.neonButtonText}>Kaydet</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MultiStepFormScreen;
import React, { useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-paper";
import { ProgramContext } from "../components/program-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/program.style';

const ProgramScreen = () => {
  const params = useLocalSearchParams() || {};
  const router = useRouter();
  const { programData, setProgramData } = useContext(ProgramContext);

  const handleGoBack = () => {
    router.push('/src/screens/form');
  };

  const handleSaveAndNavigate = () => {
    // Ana sayfaya yönlendir
    router.push('/src/screens/tabs/main-page');
  };

  useEffect(() => {
    if (params.program) {
      try {
        const parsedProgram = JSON.parse(params.program);
        if (Array.isArray(parsedProgram)) {
          setProgramData(parsedProgram);
        } else {
          Alert.alert("Hata", "Program verisi geçersiz!");
        }
      } catch (error) {
        console.error("JSON Parse Hatası:", error);
        Alert.alert("Hata", "Program verisi doğru bir formatta değil!");
      }
    }
  }, [params.program]);

  if (!programData) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Program verisi yükleniyor...</Text>
      </View>
    );
  }

  if (!Array.isArray(programData)) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>
          Program verisi bulunamadı veya geçersiz formatta.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backLink} onPress={handleGoBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#BBF246" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: 'BebasNeue' }]}>Workout Program</Text>
        <FlatList
          data={programData}
          keyExtractor={(item) => `day-${item.gün}`}
          renderItem={({ item }) => (
            <View style={styles.dayContainer}>
              <Text style={styles.dayTitle}>Day {item.gün}</Text>
              {item.hareketler.map((hareket, index) => (
                <View key={`hareket-${index}`} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseText}>
                    {hareket.adı} - {hareket.set} Set x {hareket.tekrar} Reps
                  </Text>
                  <Divider style={styles.divider} />
                </View>
              ))}
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveAndNavigate}
        >
          <Text style={styles.saveButtonText}>Programı Onayla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProgramScreen;
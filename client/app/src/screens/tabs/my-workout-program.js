import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MyWorkoutProgram = () => {
  const [workoutProgram, setWorkoutProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutProgram();
  }, []);

  const fetchWorkoutProgram = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('Kullanıcı ID bulunamadı');
      }

      const response = await fetch(`http://localhost:6000/get-program/${userId}`);
      const data = await response.json();
      

      if (!response.ok) {
        throw new Error(data.message || 'Program alınamadı');
      }

      if (data.gymProgram) {
        setWorkoutProgram(data.gymProgram);
      } else {
        console.log('Program bulunamadı');
      }
    } catch (error) {
      console.error('Program Yükleme Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Program yükleniyor...</Text>
      </View>
    );
  }

  if (!workoutProgram) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Henüz bir program oluşturulmamış.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Workout Program</Text>
        <FlatList
          data={workoutProgram}
          keyExtractor={(item, index) => `day-${index}`}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BBF246',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: -50,
  },
  dayContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF246',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BBF246',
    marginBottom: 15,
  },
  exerciseContainer: {
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  divider: {
    backgroundColor: '#333',
    marginVertical: 8,
  },
  loadingText: {
    color: '#BBF246',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    color: '#BBF246',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default MyWorkoutProgram;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MyDietProgram = () => {
  const [dietProgram, setDietProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietProgram();
  }, []);

  const fetchDietProgram = async () => {
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

      if (data.dietProgram) {
        setDietProgram(data.dietProgram);
      } else {
        console.log('Diyet programı bulunamadı');
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

  if (!dietProgram) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Henüz bir diyet programı oluşturulmamış.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Diet Program</Text>
        <FlatList
          data={dietProgram}
          keyExtractor={(item) => `day-${item.gün}`}
          renderItem={({ item }) => (
            <View style={styles.dayContainer}>
              <Text style={styles.dayTitle}>Gün {item.gün}</Text>
              {item.öğünler.map((meal, index) => (
                <View key={`meal-${index}`} style={styles.mealContainer}>
                  <Text style={styles.mealTitle}>{meal.adı}</Text>
                  <Text style={styles.foodText}>{meal.yemek}</Text>
                  <View style={styles.nutritionInfo}>
                    <Text style={styles.nutritionText}>Kalori: {meal.kalori} kcal</Text>
                    <Text style={styles.nutritionText}>Protein: {meal.protein}g</Text>
                    <Text style={styles.nutritionText}>Yağ: {meal.yağ}g</Text>
                    <Text style={styles.nutritionText}>Karbonhidrat: {meal.karbonhidrat}g</Text>
                  </View>
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
  mealContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BBF246',
    marginBottom: 10,
  },
  foodText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  nutritionInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
  },
  nutritionText: {
    fontSize: 14,
    color: '#ccc',
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

export default MyDietProgram;

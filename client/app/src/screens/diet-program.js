import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from "react-native-paper";
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DietProgramScreen = () => {
  const [dietProgram, setDietProgram] = useState(null);
  const params = useLocalSearchParams() || {};
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/src/screens/tabs/main-page');
  };

  useEffect(() => {
    if (params.program) {
      try {
        const parsedProgram = JSON.parse(params.program);
        setDietProgram(parsedProgram);
      } catch (error) {
        console.error("JSON Parse Hatası:", error);
        Alert.alert("Hata", "Program verisi doğru bir formatta değil!");
      }
    }
  }, [params.program]);

  if (!dietProgram) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Program yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backLink} onPress={handleGoBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#BBF246" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Diet Program</Text>
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
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleGoBack}
        >
          <Text style={styles.saveButtonText}>Programı Onayla</Text>
        </TouchableOpacity>
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
  backLink: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BBF246',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
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
  listContainer: {
    paddingBottom: 20,
  },
  saveButton: {
    backgroundColor: '#BBF246',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DietProgramScreen;
import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ProgramContext } from "../components/program-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VotePage = () => {
  const { programData, setProgramData } = useContext(ProgramContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleWorkoutProgram = async () => {
    if (!programData.age || !programData.weight || !programData.height || !programData.gender) {
      Alert.alert("Hata", "Eksik bilgiler. Lütfen formu doldurun ve tekrar deneyin.");
      return;
    }

    setIsLoading(true);
    try {
      // AI'dan program al
      const aiResponse = await fetch("http://localhost:6000/api/chat/gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `yaş:${programData.age}, kilo:${programData.weight}, gün sayısı:${programData.daysPerWeek}, boy:${programData.height}, cinsiyet:${programData.gender}`,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI Response Error:', errorText);
        throw new Error("Program oluşturulurken bir hata oluştu!");
      }

      const aiData = await aiResponse.json();
      console.log('AI Response:', aiData);

      if (!aiData || !aiData.reply || !aiData.reply.program) {
        throw new Error("AI yanıtı alınamadı");
      }

      const workoutProgram = aiData.reply.program;
      console.log('Workout Program:', workoutProgram);

      // Kullanıcı bilgilerini al
      const userId = await AsyncStorage.getItem('userId');
      const userEmail = await AsyncStorage.getItem('userEmail');

      if (!userId || !userEmail) {
        throw new Error('Kullanıcı bilgileri bulunamadı');
      }

      // Mevcut kullanıcı bilgilerini al
      const userResponse = await fetch(`http://localhost:6000/get-program/${userId}`);
      
      if (!userResponse.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      const userData = await userResponse.json();

      // Programı güncelle
      const updateData = {
        email: userEmail,
        password: userData.password || '',
        gymProgram: workoutProgram,
        dietProgram: userData.dietProgram || null,
        age: parseInt(programData.age),
        weight: parseInt(programData.weight),
        height: parseInt(programData.height),
        gender: programData.gender,
        daysPerWeek: programData.daysPerWeek
      };

      console.log('Update Data:', updateData);

      const updateResponse = await fetch(`http://localhost:6000/update-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const updateResult = await updateResponse.json();
      console.log('Update Result:', updateResult);

      if (!updateResponse.ok) {
        throw new Error(updateResult.message || 'Program kaydedilemedi');
      }

      // Başarılı mesajı göster
      Alert.alert('Başarılı', 'Program oluşturuldu ve kaydedildi!', [
        {
          text: 'Programı Görüntüle',
          onPress: () => {
            router.push({
              pathname: "/src/screens/workout-program",
              params: { program: JSON.stringify(workoutProgram) },
            });
          },
        },
      ]);

      // Programı context'e kaydet
      setProgramData(prev => ({ ...prev, program: workoutProgram }));

    } catch (error) {
      console.error('Program Oluşturma Hatası:', error);
      Alert.alert("Hata", error.message || "Program oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDietProgram = async () => {
    setIsLoading(true);
    try {
      // AI'dan diyet programı al
      const aiResponse = await fetch("http://localhost:6000/api/chat/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `yaş:${programData.age}, kilo:${programData.weight}, boy:${programData.height}, cinsiyet:${programData.gender}`,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI Response Error:', errorText);
        throw new Error("Program oluşturulurken bir hata oluştu!");
      }

      const aiData = await aiResponse.json();
      console.log('AI Request:', {
        age: programData.age,
        weight: programData.weight,
        height: programData.height,
        gender: programData.gender
      });
      console.log('AI Raw Response:', aiData);

      if (!aiData || !aiData.reply) {
        throw new Error("AI yanıtı alınamadı");
      }

      const dietProgram = aiData.reply.program;
      console.log('Diet Program:', dietProgram);

      // Kullanıcı bilgilerini al
      const userId = await AsyncStorage.getItem('userId');
      const userEmail = await AsyncStorage.getItem('userEmail');

      if (!userId || !userEmail) {
        throw new Error('Kullanıcı bilgileri bulunamadı');
      }

      // Mevcut kullanıcı bilgilerini al
      const userResponse = await fetch(`http://localhost:6000/get-program/${userId}`);
      
      if (!userResponse.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      const userData = await userResponse.json();

      // Programı güncelle
      const updateData = {
        email: userEmail,
        password: userData.password || '',
        gymProgram: userData.gymProgram || null,
        dietProgram: dietProgram,
        age: programData.age,
        weight: programData.weight,
        height: programData.height,
        gender: programData.gender,
        daysPerWeek: programData.daysPerWeek
      };

      console.log('Update Data:', updateData);

      const updateResponse = await fetch(`http://localhost:6000/update-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error('Update Error:', errorData);
        throw new Error(errorData.message || 'Program kaydedilemedi');
      }

      // Başarılı mesajı göster
      Alert.alert('Başarılı', 'Diyet programı oluşturuldu ve kaydedildi!', [
        {
          text: 'Programı Görüntüle',
          onPress: () => {
            router.push({
              pathname: "/src/screens/diet-program",
              params: { program: JSON.stringify(dietProgram) },
            });
          },
        },
      ]);

      // Programı context'e kaydet
      setProgramData(prev => ({ ...prev, dietProgram: dietProgram }));

    } catch (error) {
      console.error('Diyet Programı Hatası:', error);
      console.log('Program Data:', programData);
      Alert.alert("Hata", error.message || "Diyet programı oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safecontainer}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#BBF246" />
          <Text style={styles.loadingText}>Program oluşturuluyor...</Text>
        </View>
      )}
      <Text style={[styles.title, { fontFamily: "BebasNeue" }]}>Select Your Program</Text>
      <View style={styles.container}>
        <TouchableOpacity style={styles.card} onPress={handleDietProgram}>
          <MaterialCommunityIcons name="food-apple" size={64} color="#BBF246" />
          <Text style={styles.cardText}>Diet Program</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleWorkoutProgram}>
          <MaterialCommunityIcons name="dumbbell" size={64} color="#BBF246" />
          <Text style={styles.cardText}>Workout Program</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VotePage;

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#BBF246",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    height: 180,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BBF246",
    marginTop: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#BBF246",
  },
});
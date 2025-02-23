import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, Modal } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment"; // Tarih işlemleri için
import { Card, ProgressBar, IconButton, Switch } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgramContext } from "../../components/program-context";

const HomeScreen = () => {
  const [daysInMonth, setDaysInMonth] = useState([]); // Takvim verisi
  const [selectedDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD")); // Varsayılan gün
  const [userName, setUserName] = useState(""); // Kullanıcı adı
  const [progress, setProgress] = useState(0.5); // Örnek ilerleme verisi (0-1)
  const [quote, setQuote] = useState('');
  const [todaysStats, setTodaysStats] = useState({
    calories: 320,
    duration: 60,
    workouts: 9
  });
  const router = useRouter();
  const flatListRef = useRef(null); // `FlatList` referansı
  const { programData } = useContext(ProgramContext);
  const [dailyProgress, setDailyProgress] = useState({
    workoutCompletion: 0,
    waterIntake: 0,
    caloriesBurned: 0
  });

  // Ayarlar modalı için state
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    soundEffects: true,
    metricSystem: true,
  });

  

  useEffect(() => {
    const days = [];
    const today = moment();
    const startOfMonth = today.clone().startOf("month");
    const endOfMonth = today.clone().endOf("month");

    let currentDay = startOfMonth;
    while (currentDay <= endOfMonth) {
      days.push({
        date: currentDay.clone(),
        dayName: currentDay.format("ddd"),
      });
      currentDay = currentDay.clone().add(1, "day");
    }
    setDaysInMonth(days);

    // Kullanıcı adı örneği (AsyncStorage ile alınabilir)
    AsyncStorage.getItem("userName").then((name) => {
      setUserName(name || "User");
    });

    // Bugünkü tarihi bulup o tarihe kaydır
    const scrollToToday = () => {
      const todayIndex = days.findIndex((day) => 
        day.date.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      );
      
      if (flatListRef.current && todayIndex !== -1) {
        try {
          flatListRef.current.scrollToIndex({ 
            index: todayIndex, 
            animated: true,
            viewPosition: 0.5 // Elemanı ortala
          });
        } catch (error) {
          console.log("Scroll error:", error);
          // Alternatif scroll yöntemi
          flatListRef.current.scrollToOffset({
            offset: todayIndex * 70, // Her öğenin genişliği
            animated: true
          });
        }
      }
    };

    // FlatList'in yüklenmesi için biraz bekle
    const timer = setTimeout(scrollToToday, 500);

    return () => clearTimeout(timer); // Cleanup

  }, [programData]); // programData değiştiğinde tekrar hesapla

  const handleProgramNavigation = () => {
    router.push("/src/screens/form");
  };

  const handleEditProfile = () => {
    router.push("/src/screens/profile");
  };

  // Ayarları kaydetme fonksiyonu
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
      setSettingsVisible(false);
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
    }
  };

  // Ayarları yükleme fonksiyonu
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('userSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Ayarlar yüklenemedi:', error);
      }
    };
    
    loadSettings();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <View style={styles.profileSection}>
          <Image source={require("../../assets/photos/woman.png")} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>Merhaba,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        <View style={styles.iconButtons}>
          <IconButton
            icon="cog"
            iconColor="#BBF246"
            size={24}
            style={styles.iconButton}
            onPress={() => setSettingsVisible(true)}
          />
          <IconButton
            icon="account-edit"
            iconColor="#BBF246"
            size={24}
            style={styles.iconButton}
            onPress={handleEditProfile}
          />
        </View>
      </View>

      {/* Aktivite Özeti Kartları */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <MaterialCommunityIcons name="fire" size={24} color="#FF6B6B" />
          <Text style={styles.statValue}>{todaysStats.calories}</Text>
          <Text style={styles.statLabel}>Kalori</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#4ECDC4" />
          <Text style={styles.statValue}>{todaysStats.duration}</Text>
          <Text style={styles.statLabel}>Dakika</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <MaterialCommunityIcons name="dumbbell" size={24} color="#FFE66D" />
          <Text style={styles.statValue}>{todaysStats.workouts}</Text>
          <Text style={styles.statLabel}>Antrenman</Text>
        </Card>
      </View>

      {/* Takvim */}
      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>Aylık Takvim</Text>
        <FlatList
          ref={flatListRef} // `FlatList` referansı
          data={daysInMonth}
          horizontal
          keyExtractor={(item) => item.date.format("YYYY-MM-DD")}
          contentContainerStyle={styles.listContainer}
          getItemLayout={(data, index) => ({
            length: 70, // Her bir öğenin genişliği
            offset: 70 * index, // Genişlik x index
            index,
          })}
          onScrollToIndexFailed={(info) => {
            console.warn("scrollToIndexFailed:", info);
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          renderItem={({ item }) => {
            const isSelected = item.date.format("YYYY-MM-DD") === selectedDay;
            const isToday = item.date.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD");
            return (
              <TouchableOpacity
                style={[
                  styles.dayItem,
                  isSelected && styles.selectedDayItem,
                  isToday && styles.todayItem
                ]}
                onPress={() => setSelectedDay(item.date.format("YYYY-MM-DD"))}
              >
                <Text style={[styles.dayName, isSelected && styles.selectedDayText]}>
                  {item.dayName}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.selectedDayText]}>
                  {item.date.format("D")}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Günlük Hedefler */}
      <Card style={styles.goalsCard}>
        <Text style={styles.cardTitle}>Günlük Hedefler</Text>
        <View style={styles.goalItem}>
          <Text style={styles.goalText}>Antrenman Tamamlama</Text>
          <ProgressBar progress={0.7} color="#BBF246" style={styles.progressBar} />
          <Text style={styles.progressText}>70%</Text>
        </View>
        <View style={styles.goalItem}>
          <Text style={styles.goalText}>Su Tüketimi</Text>
          <ProgressBar progress={0.5} color="#4ECDC4" style={styles.progressBar} />
          <Text style={styles.progressText}>50%</Text>
        </View>
        <View style={styles.goalItem}>
          <Text style={styles.goalText}>Kalori Hedefi</Text>
          <ProgressBar progress={0.3} color="#FF6B6B" style={styles.progressBar} />
          <Text style={styles.progressText}>30%</Text>
        </View>
      </Card>

      {/* Program Butonu */}
      <TouchableOpacity style={styles.programButton} onPress={handleProgramNavigation}>
        <MaterialCommunityIcons name="dumbbell" size={24} color="#000" />
        <Text style={styles.programButtonText}>  Program Oluştur   </Text>
        <MaterialCommunityIcons name="food-apple" size={24} color="000" />
      </TouchableOpacity>

      {/* Ayarlar Modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ayarlar</Text>
              <IconButton
                icon="close"
                iconColor="#FFF"
                size={24}
                onPress={() => setSettingsVisible(false)}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Bildirimler</Text>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => 
                  setSettings({...settings, notifications: value})
                }
                color="#BBF246"
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Karanlık Mod</Text>
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => 
                  setSettings({...settings, darkMode: value})
                }
                color="#BBF246"
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Ses Efektleri</Text>
              <Switch
                value={settings.soundEffects}
                onValueChange={(value) => 
                  setSettings({...settings, soundEffects: value})
                }
                color="#BBF246"
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Metrik Sistem</Text>
              <Switch
                value={settings.metricSystem}
                onValueChange={(value) => 
                  setSettings({...settings, metricSystem: value})
                }
                color="#BBF246"
              />
            </View>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveSettings}
            >
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconButton: {
    margin: 0,
    padding: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BBF246',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 12,
    width: '31%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#BBF246",
    marginBottom: 10,
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayItem: {
    width: 55,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
  },
  selectedDayItem: {
    backgroundColor: '#BBF246',
  },
  todayItem: {
    borderWidth: 1,
    borderColor: '#BBF246',
  },
  selectedDayText: {
    color: '#000',
  },
  dayName: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  card: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BBF246",
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: "#FFF",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  programButton: {
    backgroundColor: '#BBF246',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  programButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  quoteText: {
    fontSize: 14,
    color: "#FFF",
    marginTop: 10,
  },
  goalsCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  goalItem: {
    marginBottom: 15,
  },
  goalText: {
    color: '#FFF',
    marginBottom: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalValue: {
    color: '#BBF246',
    fontSize: 14,
    fontWeight: 'bold',
  },
  topBarButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BBF246',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    fontSize: 16,
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#BBF246',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
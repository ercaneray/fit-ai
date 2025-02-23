import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'rgba(187, 242, 70, 0.2)', // Fosforlu yeşil transparent
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#BBF246',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'BebasNeue',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#BBF246',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333',
    height: 60,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  genderContainer: {
    marginBottom: 20,
  },
  sliderText: {
    fontSize: 20,
    color: '#BBF246',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'BebasNeue',
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  genderButton: {
    backgroundColor: '#222',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    width: '45%',
  },
  selectedGenderButton: {
    backgroundColor: '#BBF246',
    borderColor: '#BBF246',
    transform: [{ scale: 1.05 }],
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'BebasNeue',
  },
  selectedGenderButtonText: {
    color: '#000',
  },
  slider: {
    height: 40,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  neonButton: {
    flex: 1,
    backgroundColor: '#BBF246',
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 5,
    shadowColor: '#BBF246',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  neonButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'BebasNeue',
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#BBF246',
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'BebasNeue',
  },
  // Yeni animasyon efektleri için stiller
  inputFocus: {
    borderColor: '#BBF246',
    transform: [{ scale: 1.02 }],
  },
  buttonShadow: {
    shadowColor: '#BBF246',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  activeStepDot: {
    backgroundColor: '#BBF246',
    transform: [{ scale: 1.2 }],
  }
});
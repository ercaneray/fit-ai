import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#BBF246',
    textAlign: 'center',
    marginVertical: 30,
    fontFamily: 'BebasNeue',
    letterSpacing: 2,
    textShadowColor: 'rgba(187, 242, 70, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
  signUpButton: {
    backgroundColor: '#BBF246',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#BBF246',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  signUpButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'BebasNeue',
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  accountText: {
    color: '#666',
    fontSize: 16,
    marginRight: 5,
    fontFamily: 'BebasNeue',
  },
  goBackText: {
    color: '#BBF246',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'BebasNeue',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 5,
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
  }
});
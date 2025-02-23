import { StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // SafeAreaView'in beyaz kalmasını önlemek için siyah
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    marginTop:30,
  },
  backLink: {
    position: "absolute", // Geri butonu pozisyonu
    top: 50,
    left: 15,
    zIndex: 10,
  },
  title: {
    fontSize: '40',
    color: '#BBF246',
    marginBottom: 20,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  listContainer: {
    padding: 20,
    backgroundColor: '#121212',
  },
  dayContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#121212',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#BBF246',
    borderWidth: 1,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#BBF246',
  },
  exerciseContainer: {
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    color: '#ccc',
  },
  divider: {
    marginVertical: 10,
    color: '#BBF246'
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

})
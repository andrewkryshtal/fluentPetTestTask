import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 50 },
  searchInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  formContainer: { marginBottom: 16 },
  input: { borderWidth: 1, padding: 8, borderRadius: 5, marginBottom: 10 },
  textArea: { height: 80, textAlignVertical: "top" },
  button: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", textAlign: "center" },
  listContainer: { flex: 1 },
  petItem: { padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
  buttonContainer: { flexDirection: "row", marginTop: 10 },
  editButton: {
    backgroundColor: "#2196F3",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: { backgroundColor: "#f44336", padding: 5, borderRadius: 5 },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});

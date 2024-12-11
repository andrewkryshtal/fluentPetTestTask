import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Pet } from "../types";
import { usePetContext } from "../context/PetContext";

interface IRenderPetItem {
  item: Pet;
  setEditingPet: (pet: Pet | null) => void;
  reset: (pet: Pet) => void;
}

export const RenderPetItem = ({
  item,
  setEditingPet,
  reset,
}: IRenderPetItem) => {
  const { deletePet } = usePetContext();

  return (
    <View style={styles.petItem}>
      {item.photo && (
        <Image
          source={{ uri: item.photo }}
          style={styles.photo} // Add styles for the image
        />
      )}
      <Text>Name: {item.name}</Text>
      <Text>Age: {item.age}</Text>
      {item.description && <Text>Description: {item.description}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setEditingPet(item);
            reset({
              name: item.name,
              age: item.age,
              description: item.description || "",
              photo: item.photo || "",
            });
          }}
          style={styles.editButton}
        >
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            item.id && deletePet(item.id);
          }}
          style={styles.deleteButton}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  petItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#2196F3",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 5,
    borderRadius: 5,
  },
});

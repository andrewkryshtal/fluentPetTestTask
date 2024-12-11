import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePetContext } from "../../context/PetContext";
import { Pet } from "../../types";
import { validationSchema } from "./validationSchema";
import { RenderPetItem } from "../../components/RenderPetItem";
import { SearchComponent } from "../../components/SearchComponent";

const MainScreen: React.FC = () => {
  const { addPet, updatePet, pets } = usePetContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWithDescription, setFilterWithDescription] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [filterAgeRange, setFilterAgeRange] = useState<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: 100,
  });
  const [photoUri, setPhotoUri] = useState<string | null>(null); // Photo URI state

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      age: undefined,
      description: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri); // Set the selected photo URI
    }
  };

  const onSubmit = useCallback(
    (data: { name: string; age: string | number; description?: string }) => {
      const petData: Pet = {
        id: editingPet?.id || Date.now().toString(),
        name: data.name,
        age: Number(data.age),
        description: data.description,
        photo: photoUri || undefined, // Save photo URI
      };

      if (editingPet) {
        updatePet(petData);
        setEditingPet(null);
      } else {
        addPet(petData);
      }

      reset();
      setPhotoUri(null); // Reset the photo state
    },
    [editingPet, updatePet, addPet, reset, photoUri]
  );

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearchQuery = pet.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesAgeRange =
        pet.age &&
        pet.age >= filterAgeRange.min &&
        pet.age <= filterAgeRange.max;
      const matchesDescription = !filterWithDescription || pet.description;

      return matchesSearchQuery && matchesAgeRange && matchesDescription;
    });
  }, [pets, searchQuery, filterAgeRange, filterWithDescription]);

  return (
    <View style={styles.container}>
      {/* Filter Component */}
      <SearchComponent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterAgeRange={filterAgeRange}
        setFilterAgeRange={setFilterAgeRange}
        filterWithDescription={filterWithDescription}
        setFilterWithDescription={setFilterWithDescription}
      />

      {/* Form */}
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Pet Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <Controller
          control={control}
          name="age"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Pet Age"
              onBlur={onBlur}
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              value={value ? value.toString() : ""}
              keyboardType="numeric"
            />
          )}
        />
        {errors.age && (
          <Text style={styles.errorText}>{errors.age.message}</Text>
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Pet Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}

        {/* Photo Selection */}
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>
            {photoUri ? "Change Photo" : "Add Photo"}
          </Text>
        </TouchableOpacity>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.selectedPhoto} />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>
            {editingPet ? "Update Pet" : "Add Pet"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pet List */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <RenderPetItem
              item={item}
              setEditingPet={setEditingPet}
              reset={reset}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  formContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  photoButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  photoButtonText: {
    color: "white",
    textAlign: "center",
  },
  selectedPhoto: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});

export default MainScreen;

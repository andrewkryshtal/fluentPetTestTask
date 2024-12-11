import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pet } from "../types";
import { Alert } from "react-native";

type PetContextType = {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  searchPets: (query: string) => Pet[];
};

const PET_STORAGE_KEY = "@pets";

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const storedPets = await AsyncStorage.getItem(PET_STORAGE_KEY);
        console.log({ storedPets });
        if (storedPets) {
          setPets(JSON.parse(storedPets));
        }
      } catch (error) {
        console.error("Failed to load pets from storage:", error);
      }
    };
    loadPets();
  }, []);

  useEffect(() => {
    console.log({ pets });
    const savePets = async () => {
      try {
        await AsyncStorage.setItem(PET_STORAGE_KEY, JSON.stringify(pets));
      } catch (error) {
        console.error("Failed to save pets to storage:", error);
      }
    };
    savePets();
  }, [pets]);

  const addPet = (pet: Pet) => {
    const isDuplicate = pets.some(
      (existingPet) => existingPet.name.toLowerCase() === pet.name.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert("Duplicate pet detected. Pet not added.");
      return;
    }
    const newPets = [...pets, pet];
    setPets(newPets);
  };

  const updatePet = (updatedPet: Pet) => {
    const newPets = pets.map((pet) =>
      pet.id === updatedPet.id ? updatedPet : pet
    );
    setPets(newPets);
  };

  const deletePet = (id: string) => {
    const updatedPets = pets.filter((pet) => pet.id !== id);
    setPets(updatedPets);
  };

  const searchPets = (query: string): Pet[] => {
    return pets.filter((pet) =>
      pet.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <PetContext.Provider
      value={{ pets, addPet, updatePet, deletePet, searchPets }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used within a PetProvider");
  }
  return context;
};

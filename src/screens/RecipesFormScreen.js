import { View,Text,TextInput,TouchableOpacity,Image,StyleSheet,} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(
    recipeToEdit ? recipeToEdit.description : ""
  );

  const saverecipe = async () => {
    // Basic validation
    if (!title.trim()) {
      alert("Please enter a recipe title");
      return;
    }

    try {
      const newrecipe = { title: title.trim(), image: image.trim(), description: description.trim() };
      const storedRecipes = await AsyncStorage.getItem("customrecipes");
      let recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      if (recipeToEdit && typeof recipeIndex === "number") {
        // Edit existing recipe
        recipes[recipeIndex] = newrecipe;
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
        if (onrecipeEdited) onrecipeEdited();
      } else {
        // Add new recipe
        recipes.push(newrecipe);
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
      }
      navigation.goBack();
    } catch (error) {
      console.log("Error saving recipe:", error);
      alert("Failed to save recipe. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {recipeToEdit ? "Edit Recipe" : "Add New Recipe"}
      </Text>
      
      <TextInput
        placeholder="Recipe Title *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL (optional)"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No image preview</Text>
        </View>
      )}
      <TextInput
        placeholder="Recipe Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.descriptionInput]}
      />
      <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>
          {recipeToEdit ? "Update Recipe" : "Save Recipe"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "#F9FAFB",
    paddingTop: hp(6),
  },
  header: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#111827",
    marginBottom: hp(3),
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: wp(3),
    marginVertical: hp(1),
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    fontSize: hp(2),
  },
  descriptionInput: {
    height: hp(20),
    textAlignVertical: "top",
  },
  image: {
    width: "100%",
    height: hp(25),
    borderRadius: 8,
    marginVertical: hp(1),
  },
  imagePlaceholder: {
    height: hp(15),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: hp(1.8),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(4),
    alignItems: "center",
    borderRadius: 8,
    marginTop: hp(3),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: hp(2.2),
  },
});

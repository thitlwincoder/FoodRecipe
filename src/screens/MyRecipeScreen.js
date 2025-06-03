import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    StatusBar,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useNavigation, useFocusEffect } from "@react-navigation/native";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  
  export default function MyRecipeScreen() {
    const navigation = useNavigation();
    const [recipes, setrecipes] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchrecipes = async () => {
      try {
        setLoading(true);
        const storedRecipes = await AsyncStorage.getItem("customrecipes");
        if (storedRecipes) {
          setrecipes(JSON.parse(storedRecipes));
        } else {
          setrecipes([]);
        }
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    // Refresh recipes when screen comes into focus
    useFocusEffect(
      React.useCallback(() => {
        fetchrecipes();
      }, [])
    );
  
    const handleAddrecipe = () => {
      navigation.navigate("RecipesFormScreen");
    };
  
    const handlerecipeClick = (recipe) => {
      navigation.navigate("CustomRecipesScreen", { recipe });
    };
  
    const deleterecipe = async (index) => {
      try {
        const updatedrecipes = [...recipes];
        updatedrecipes.splice(index, 1);
        await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedrecipes));
        setrecipes(updatedrecipes);
      } catch (error) {
        console.error("Failed to delete recipe:", error);
      }
    };
  
    const editrecipe = (recipe, index) => {
      navigation.navigate("RecipesFormScreen", { recipeToEdit: recipe, recipeIndex: index });
    };
  
  const renderRecipeItem = ({ item: recipe, index }) => (
    <View style={styles.recipeCard} testID="recipeCard">
      <TouchableOpacity testID="handlerecipeBtn" onPress={() => handlerecipeClick(recipe)}>
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        ) : null}
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.recipeDescription} testID="recipeDescp">
          {recipe.description ?
            recipe.description.length > 50
              ? recipe.description.substring(0, 50) + "..."
              : recipe.description
            : ""}
        </Text>
      </TouchableOpacity>

      {/* Edit and Delete Buttons */}
      <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
        <TouchableOpacity style={styles.editButton} onPress={() => editrecipe(recipe, index)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleterecipe(index)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <Text style={styles.norecipesText}>No recipes added yet.</Text>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"← Back"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAddrecipe} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New recipe</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContainer}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: wp(4),
      backgroundColor: "#F9FAFB",
      paddingTop: hp(6), // Add padding to avoid status bar
    },
    backButton: {
      marginBottom: hp(1.5),
      marginTop: hp(1), // Additional margin for better spacing
    },
    backButtonText: {
      fontSize: hp(2.2),
      color: "#4F75FF",
    },
    addButton: {
      backgroundColor: "#4F75FF",
      padding: wp(3),
      alignItems: "center",
      borderRadius: 8,
      marginHorizontal: wp(4),
      marginBottom: hp(2),
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",    fontSize: hp(2.2),
  },
  flatListContainer: {
    paddingBottom: hp(2),
    paddingHorizontal: wp(2),
    flexGrow: 1,
  },
    norecipesText: {
      textAlign: "center",
      fontSize: hp(2),
      color: "#6B7280",
      marginTop: hp(5),
    },
    recipeCard: {
      backgroundColor: "#fff",
      padding: wp(4),
      borderRadius: 12,
      marginBottom: hp(2),
      marginHorizontal: wp(2),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    recipeImage: {
      width: "100%",
      height: hp(20),
      borderRadius: 8,
      marginBottom: hp(1),
    },
    recipeTitle: {
      fontSize: hp(2),
      fontWeight: "600",
      color: "#111827",
      marginBottom: hp(0.5),
    },
    recipeDescription: {
      fontSize: hp(1.8),
      color: "#6B7280",
      marginBottom: hp(1.5),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
    },
    editButton: {
      backgroundColor: "#34D399",
      padding: wp(3),
      borderRadius: 8,
      flex: 1,
      marginRight: wp(2),
      alignItems: "center",
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
    deleteButton: {
      backgroundColor: "#EF4444",
      padding: wp(3),
      borderRadius: 8,
      flex: 1,
      alignItems: "center",
    },
    deleteButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
  });

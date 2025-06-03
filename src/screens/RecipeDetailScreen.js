import {View,Text,FlatList,TouchableOpacity,Image,StyleSheet,} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { toggleFavorite } from "../redux/favoritesSlice"; // Redux action

export default function RecipeDetailScreen(props) {
  const recipe = props.route.params.recipe; // recipe passed from previous screen

  const dispatch = useDispatch();
  const favoriterecipes = useSelector(
    (state) => state.favorites.favoriterecipes
  );
  
  // Check if recipe is favorite - handle both regular and custom recipes
  const isFavourite = favoriterecipes?.some(
    (favrecipe) => {
      if (recipe.idFood && favrecipe.idFood) {
        return favrecipe.idFood === recipe.idFood;
      } else if (recipe.title && favrecipe.title) {
        return favrecipe.title === recipe.title;
      }
      return false;
    }
  );

  const navigation = useNavigation();

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe)); // Dispatch the recipe to favorites
  };

  // Prepare data for FlatList sections
  const sections = [
    {
      type: 'header',
      data: {
        image: recipe.recipeImage || recipe.image,
        title: recipe.recipeName || recipe.title,
        category: recipe.recipeCategory || recipe.category || "Custom Recipe"
      }
    },
    {
      type: 'misc',
      data: {
        mins: recipe.mins ? `${recipe.mins} Mins` : "35 Mins",
        servings: recipe.servings ? `${String(recipe.servings).padStart(2, '0')} Servings` : "03 Servings",
        calories: recipe.calories ? `${recipe.calories} Cal` : "103 Cal",
        type: recipe.type || "Medium"
      }
    },
    {
      type: 'ingredients',
      data: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 
        ? recipe.ingredients 
        : []
    },
    {
      type: 'instructions',
      data: recipe.recipeInstructions || recipe.description || "No instructions provided."
    }
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'header':
        return (
          <View>
            {/* recipe Image */}
            <View style={styles.imageContainer} testID="imageContainer">
              <Image
                source={{ uri: item.data.image }}
                style={styles.recipeImage}
                resizeMode="cover"
              />
            </View>

            {/* Back Button and Favorite Button */}
            <View style={styles.topButtonsContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={styles.favoriteButton}
              >
                <Text style={styles.favoriteButtonText}>{isFavourite ? "♥" : "♡"}</Text>
              </TouchableOpacity>
            </View>

            {/* recipe Description */}
            <View style={styles.contentContainer}>
              {/* Title and Category */}
              <View
                style={styles.recipeDetailsContainer}
                testID="recipeDetailsContainer"
              >
                <Text style={styles.recipeTitle} testID="recipeTitle">
                  {item.data.title}
                </Text>
                <Text style={styles.recipeCategory} testID="recipeCategory">
                  {item.data.category}
                </Text>
              </View>
            </View>
          </View>
        );

      case 'misc':
        return (
          <View style={styles.miscContainer} testID="miscContainer">
            <View style={styles.miscItem}>
              <Text style={styles.miscIcon}>🕒</Text>
              <Text style={styles.miscText}>{item.data.mins}</Text>
            </View>
            <View style={styles.miscItem}>
              <Text style={styles.miscIcon}>👥</Text>
              <Text style={styles.miscText}>{item.data.servings}</Text>
            </View>
            <View style={styles.miscItem}>
              <Text style={styles.miscIcon}>🔥</Text>
              <Text style={styles.miscText}>{item.data.calories}</Text>
            </View>
            <View style={styles.miscItem}>
              <Text style={styles.miscIcon}>🎚️</Text>
              <Text style={styles.miscText}>{item.data.type}</Text>
            </View>
          </View>
        );

      case 'ingredients':
        return (
          <View style={styles.sectionContainer} testID="sectionContainer">
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList} testID="ingredientsList">
              {item.data.length > 0 ? (
                item.data.map((ingredient, idx) => (
                  <View key={idx} style={styles.ingredientItem}>
                    <View style={styles.ingredientBullet} />
                    <Text style={styles.ingredientText}>
                      {ingredient.ingredientName} {ingredient.measure ? `- ${ingredient.measure}` : ""}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.ingredientText}>No ingredients listed.</Text>
              )}
            </View>
          </View>
        );

      case 'instructions':
        return (
          <View style={styles.sectionContainer} testID="sectionContainer">
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>
              {item.data}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={sections}
      renderItem={renderSection}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  flatListContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  recipeImage: {
    width: wp(98),
    height: hp(40),
    borderRadius: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginTop: 4,
  },
  topButtonsContainer: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(4),
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginLeft: wp(5),
  },
  backButtonText: {
    fontSize: hp(2),
    color: "#333",
    fontWeight: "bold",
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: wp(5),
  },
  favoriteButtonText: {
    fontSize: hp(2),
    color: "red",
  },
  contentContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
  },
  recipeDetailsContainer: {
    marginBottom: hp(2),
  },
  recipeTitle: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#4B5563",
  },
  recipeCategory: {
    fontSize: hp(2),
    fontWeight: "500",
    color: "#9CA3AF",
  },
  miscContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: wp(4),
  },
  miscItem: {
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 3,
  },
  miscIcon: {
    fontSize: hp(3.5),
    marginBottom: 5,
  },
  miscText: {
    fontSize: hp(2),
    fontWeight: "600",
    fontFamily: "Lato",
  },
  sectionContainer: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 10,
  },
  ingredientsList: {
    marginLeft: wp(4),
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
    padding: 10,
    backgroundColor: "#FFF9E1",
    borderRadius: 8,
    elevation: 2,
  },
  ingredientBullet: {
    backgroundColor: "#FFD700",
    borderRadius: 50,
    height: hp(1.5),
    width: hp(1.5),
    marginRight: wp(2),
  },
  ingredientText: {
    fontSize: hp(1.9),
    color: "#333",
    fontFamily: "Lato",
  },
  instructionsText: {
    fontSize: hp(2),
    color: "#444",
    lineHeight: hp(3),
    textAlign: "justify",
    fontFamily: "Lato",
  },
});

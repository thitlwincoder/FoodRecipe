import { View, Text, Pressable, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export default function Recipe({ categories, foods }) {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => (
<RecipeCard item={item} index={index} navigation={navigation} />
  );

  // Show empty state if no recipes are found
  if (!foods || foods.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>No Recipes Found</Text>
          <Text style={styles.emptyDescription}>
            There are no recipes available for this category yet.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View testID="recipesDisplay">
        <FlatList
          data={foods}
          numColumns={2}
          keyExtractor={(item) => item.idFood?.toString() || item.recipeName}
          renderItem={renderItem}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const RecipeCard = ({ item, index, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      style={[{ flex: 2, margin: 4 }]} // Add margin for spacing
      testID="recipeDisplay"
    >
      <Image
        source={{ uri: item.recipeImage }}
        style={[styles.recipeImage, { aspectRatio: 1 }]} // Square image
        resizeMode="cover"
      />
      <Text style={styles.recipeText} numberOfLines={1}>{item.recipeName}</Text>
      <Text style={styles.recipeDescription} numberOfLines={2}>{item.recipeInstructions}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4), // mx-4 equivalent
    marginTop: hp(2),
  },
  title: {
    fontSize: hp(3),
    fontWeight: "600", // font-semibold
    color: "#52525B", // text-neutral-600
    marginBottom: hp(1.5),
  },
  loading: {
    marginTop: hp(20),
  },
  cardContainer: {
    justifyContent: "center",
    marginBottom: hp(1.5),
    flex: 1, // Allows cards to grow and fill space evenly
  },
  recipeImage: {
    width: "100%",
   
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.05)", // bg-black/5
  },
  recipeText: {
    fontSize: hp(1.5),
    fontWeight: "600", // font-semibold
    color: "#52525B", // text-neutral-600
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
  recipeDescription: {
    fontSize: hp(1.2),
    color: "#6B7280", // gray-500
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
  row: {
    justifyContent: "space-between", // Align columns evenly
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(10),
    paddingHorizontal: wp(8),
  },
  emptyIcon: {
    fontSize: hp(8),
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: hp(1),
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: hp(1.8),
    color: "#6B7280",
    textAlign: "center",
    lineHeight: hp(2.5),
  },
});

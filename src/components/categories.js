import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
  } from "react-native";
  import React from "react";
  import { useNavigation } from "@react-navigation/native"; // Import navigation
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import Animated, { FadeInDown } from "react-native-reanimated";
  
  export default function Categories({
    categories,
    activeCategory,
    handleChangeCategory,
  }) {
    const navigation = useNavigation(); // Use navigation
  
    const specialCategories = [
      {
        id: 'my-food',
        name: 'My Food',
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        onPress: () => navigation.navigate("MyFood")
      },
      {
        id: 'favorites',
        name: 'My Favorites',
        image: 'https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?q=80&w=1900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        onPress: () => navigation.navigate("FavoriteScreen")
      }
    ];

    const allCategories = [...specialCategories, ...categories.map(cat => ({
      id: cat.strCategory,
      name: cat.strCategory,
      image: cat.strCategoryThumb,
      isCategory: true,
      category: cat
    }))];

    const renderCategoryItem = ({ item }) => {
      if (item.isCategory) {
        const isActive = item.category.strCategory === activeCategory;
        const activeButtonStyle = isActive
          ? styles.activeButton
          : styles.inactiveButton;
        
        return (
          <TouchableOpacity
            onPress={() => handleChangeCategory(item.category.strCategory)}
            style={styles.categoryContainer}
          >
            <View style={[styles.imageContainer, activeButtonStyle]}>
              <Image
                source={{ uri: item.image }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={item.onPress}
            style={styles.categoryContainer}
          >
            <View style={[styles.imageContainer, styles.myFoodButton]}>
              <Image
                source={{ uri: item.image }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        );
      }
    };
  
    return (
      <Animated.View entering={FadeInDown.duration(500).springify()}>
        <FlatList
          data={allCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
        />
      </Animated.View>
    );
  }
  
  const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: wp(4),
  },
  categoryContainer: {
    alignItems: "center",
    marginRight: wp(4)
  },
    imageContainer: {
      borderRadius: 9999,
      padding: 6,
    },
    activeButton: {
      backgroundColor: "#F59E0B",
    },
    inactiveButton: {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    categoryImage: {
      width: hp(6),
      height: hp(6),
      borderRadius: 9999,
    },
    categoryText: {
      fontSize: hp(1.6),
      color: "#52525B",
      marginTop: hp(0.5),
    },
    // Styles for "My Food" category
    myFoodButton: {
      backgroundColor: "#4ADE80",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
    },
    myFoodText: {
      color: "white",
      fontWeight: "bold",
      fontSize: hp(1.5),
    },
  });
  
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [], // Updated to handle favorite recipes
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const recipe = action.payload;
      
      // Handle custom recipes (they have 'title' instead of 'idFood')
      if (recipe.title && !recipe.idFood) {
        const existingIndex = state.favoriterecipes.findIndex(
          (favRecipe) => favRecipe.title === recipe.title
        );
        if (existingIndex >= 0) {
          // Recipe is already in favorites, remove it
          state.favoriterecipes.splice(existingIndex, 1);
        } else {
          // Recipe is not in favorites, add it
          state.favoriterecipes.push(recipe);
        }
      } else {
        // Handle regular recipes (they have 'idFood')
        const existingIndex = state.favoriterecipes.findIndex(
          (favRecipe) => favRecipe.idFood === recipe.idFood
        );
        if (existingIndex >= 0) {
          // Recipe is already in favorites, remove it
          state.favoriterecipes.splice(existingIndex, 1);
        } else {
          // Recipe is not in favorites, add it
          state.favoriterecipes.push(recipe);
        }
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

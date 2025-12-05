import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Game {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  banner?: string;
  images?: string[];
  minEntry: number;
  maxEntry: number;
}

interface GameState {
  games: Game[];
}

const initialState: GameState = {
  games: [],
};

const gameSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setGames(state, action: PayloadAction<Game[]>) {
      state.games = action.payload;
    },
  },
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;

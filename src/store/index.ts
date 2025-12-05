"use client";

import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slices/gameSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    games: gameReducer,
  },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom Hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

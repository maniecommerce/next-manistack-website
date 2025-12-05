"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { gameActions } from "@/store/slices/gameSlice";

export function useGames() {
  const dispatch = useAppDispatch();

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await axios.get("/api/games");

        const fetchedGames = res.data.data || res.data;

        // Local state update
        setGames(fetchedGames);

        // Redux store update
        dispatch(gameActions.setGames(fetchedGames));

      } catch (error) {
        console.log("❌ Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, [dispatch]);

  return { games, loading };
}

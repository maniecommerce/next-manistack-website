import dbConnect from "@/lib/dbConnect";
import GameModel from "@/model/(game-model)/Game.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const games = await GameModel.find();

    return NextResponse.json(
      { success: true, data: games },
      { status: 200 }
    );
    
  } catch (err) {
    console.error("GET /api/games ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

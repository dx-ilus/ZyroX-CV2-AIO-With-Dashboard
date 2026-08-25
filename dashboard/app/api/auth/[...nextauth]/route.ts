/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                                                                  ║
 * ║    ░█▀▀░█▀█░█▀▄░█▀▀░█░█    ░█▀▄░█▀▀░█░█░█▀▀                       ║
 * ║    ░█░░░█░█░█░█░█▀▀░▄▀▄    ░█░█░█▀▀░▀▄▀░▀▀█                       ║
 * ║    ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀    ░▀▀░░▀▀▀░░▀░░▀▀▀                       ║
 * ║                                                                  ║
 * ║            © 2026 CodeX Devs — All Rights Reserved               ║
 * ║                                                                  ║
 * ║    discord  ──  https://discord.gg/codexdev                      ║
 * ║    youtube  ──  https://youtube.com/@CodeXDevs                   ║
 * ║    github   ──  https://github.com/RayExo                        ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch guilds from Discord API");
    }

    const guilds = await response.json();
    return NextResponse.json(guilds);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

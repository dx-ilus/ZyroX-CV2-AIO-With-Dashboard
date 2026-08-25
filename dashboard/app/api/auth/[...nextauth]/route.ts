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

    // Filter to servers where the user has Administrator permission (0x8) or is the Owner
    const manageableGuilds = guilds.filter((guild: any) => {
      const permissions = BigInt(guild.permissions);
      const isAdmin = (permissions & 0x8n) === 0x8n;
      return guild.owner || isAdmin;
    });

    return NextResponse.json(manageableGuilds);
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    // 1. Fetch user's guilds from Discord
    const userGuildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!userGuildsRes.ok) {
      throw new Error("Failed to fetch user guilds");
    }

    const userGuilds = await userGuildsRes.json();

    // 2. Fetch the bot's guilds using the Bot Token
    const botGuildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (!botGuildsRes.ok) {
      throw new Error("Failed to fetch bot guilds");
    }

    const botGuilds = await botGuildsRes.json();
    const botGuildIds = new Set(botGuilds.map((g: any) => g.id));

    // 3. Map servers: user must be Admin/Owner, and we can tag if the bot is in it or not
    const processedGuilds = userGuilds
      .filter((guild: any) => {
        const permissions = BigInt(guild.permissions);
        const isAdmin = (permissions & 0x8n) === 0x8n;
        return guild.owner || isAdmin;
      })
      .map((guild: any) => ({
        ...guild,
        botPresent: botGuildIds.has(guild.id),
      }));

    return NextResponse.json(processedGuilds);
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @file loader.ts
 * @description  A file loader that logs messages while loading components or steps.
 * @version 1.0.0
 */

import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { logger } from "./logger.js";
import { config } from "@/config.js";
import { registerEvents } from "./events.js";
import Event from "@/events/index.js";
import type { GuildConfig } from "@/cache/guilds.js";
import { DatabaseType, db } from "./database.js";
import CACHE from "@/cache/guilds.js";
import { command_handler } from "@/events/interactionCreate.js";

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, // Required for guild-related events
		GatewayIntentBits.GuildMembers, // Required for member-related events
		GatewayIntentBits.GuildMessages, // Required for message-related events
		GatewayIntentBits.MessageContent, // Required for reading message content
		GatewayIntentBits.GuildPresences, // Required for presence-related events
		GatewayIntentBits.GuildVoiceStates, // Required for voice state events
	],
});

interface GuildRow {
	id: number
	guild_id: string
	guild_name: string
	owner_id: string
	joined_at: number
	automod_feature?: string
	automod_enabled?: number
	channel_type?: string
	channel_id?: string
}

class Loader {
	constructor() { }

	/**
	 * Starts the boot process
	 */
	public static async init() {
		await this.initGuilds();
		await this.initBot();
	}

	/**
	 * Initializes the bot and registers events
	 */
	private static async initBot() {
		logger.debug("Initializing bot..");

		client.login(config.token).catch((e) => {
			logger.error(e);
			process.exit(1);
		});

		await logger.success("Successfully initialized bot core.");
		await this.initEvents();
	}

	/**
	 * Initializes and registers events
	 */
	private static async initEvents() {
		logger.info(`
                ===========================================
                              LOADING EVENTS
                ===========================================`);

		await registerEvents(client, Event);
		await this.initCommands();
	}

	private static async initCommands() {
		logger.info(`
            ===========================================
                          LOADING COMMANDS
            ===========================================`);

		await command_handler.load_all_commds();

		const rest = new REST({ version: "10" }).setToken(config.token);
		const commands = command_handler.commands.map((command) => ({
			name: command.name,
			description: command.description,
			options: command.get_options ? command.get_options() : [],
		}));

		try {
			await rest.put(Routes.applicationCommands(config.bot_id), { body: commands });
			logger.success("All commands loaded successfully.");
		}
		catch (error) {
			console.error(error);
		}
	}

	private static async initGuilds() {
		logger.info(`
                ===========================================
                              LOADING GUILDS
                ===========================================`);

		try {
			const rows = await db.query<GuildRow[]>(
				DatabaseType.DISOBEY,
				`SELECT 
					g.id, g.guild_id, g.guild_name, g.owner_id, g.joined_at,
					a.feature AS automod_feature, a.enabled AS automod_enabled,
					c.channel_type, c.channel_id
				FROM bot_guilds g
				LEFT JOIN bot_guild_automod a ON g.guild_id = a.guild_id
				LEFT JOIN bot_guild_channels c ON g.guild_id = c.guild_id
			`);

			const temp: Record<number, GuildConfig> = {};

			for (const row of rows) {
				const id = row.id as number;

				if (!temp[id]) {
					temp[id] = {
						id,
						guildId: row.guild_id,
						guildName: row.guild_name,
						ownerId: row.owner_id,
						joinedAt: row.joined_at,
						automod: {
							anti_link: false,
							anti_invite: false,
							anti_badwords: false
						},
						channels: {}
					};
				}

				if (row.automod_feature && row.automod_enabled !== undefined)
					temp[id].automod[row.automod_feature as keyof GuildConfig["automod"]] = !!row.automod_enabled;

				type ChannelType = keyof GuildConfig["channels"];

				if (row.channel_type && row.channel_id)
					temp[id].channels[row.channel_type as ChannelType] = row.channel_id;
			}

			for (const [id, config] of Object.entries(temp))
				CACHE[Number(id)] = config;

			/* Debug */
			/*for (const [id, config] of Object.entries(CACHE)) {
				logger.info(`📦 GUILD CACHE #${id}`);
				logger.info(`  • Guild ID: ${config.guildId}`);
				logger.info(`  • Name: ${config.guildName}`);
				logger.info(`  • Owner ID: ${config.ownerId}`);
				logger.info(`  • Joined At: ${new Date(config.joinedAt).toISOString()}`);

				logger.info("  • Automod:");
				for (const [key, value] of Object.entries(config.automod))
					logger.info(`     - ${key}: ${value}`);

				logger.info("  • Channels:");
				for (const [key, value] of Object.entries(config.channels))
					logger.info(`     - ${key}: ${value || "None"}`);

				logger.info("--------------------------------------------------");
			}*/

			logger.success(`Guild configs carregadas com sucesso (${Object.keys(CACHE).length} guilds).`);
		}
		catch (err) {
			logger.error("Erro ao carregar guild configs:", err);
		}
	}
}

export const loader = Loader;
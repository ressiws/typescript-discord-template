import { ActivityType } from "discord.js";
import { event, Events } from "../utils/events.js";
import { config } from "@/config.js";
import { logger } from "@/utils/logger.js";

export default event(Events.ClientReady, async (client) => {
	if (!client.user) {
		logger.error("Client user is not defined. Cannot set presence.");
		return;
	}

	if (config.maintenance !== true)
		client.user.setPresence({ activities: [{ name: "🌐 Online", type: ActivityType.Watching }], status: "online" });
	else
		client.user.setPresence({ activities: [{ name: "🚧 Under maintenance", type: ActivityType.Custom }], status: "idle" });

	let total_users = 0;
	const total_servers = client.guilds.cache.size;

	client.guilds.cache.forEach((guild) => {
		total_users += guild.memberCount;
	});

	logger.debug("Bot is online. Setting presence and logging in...");
	logger.info(`Logged in as '${client.user.username}' (${client.user.id}). Ready to serve ${total_users} users in ${total_servers} server(s). Bot Version: ${config.version}`);
});
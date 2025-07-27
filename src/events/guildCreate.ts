import { ApplicationCommandType, ChannelType, EmbedBuilder, TextChannel } from "discord.js";
import { event, Events } from "../utils/events.js";
import { logger } from "@/utils/logger.js";
import { Colors } from "@/constants.js";
import SetupCommand from "@/commands/setup.js";

export default event(Events.GuildCreate, async (client, guild) => {
	if (!guild.available) {
		logger.warn(`Guild ${guild.name} (${guild.id}) is not available, skipped setup.`);
		return;
	}

	logger.info(`Joined guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members.`);

	const commandInstance = new SetupCommand();

	try {
		await client.application?.commands.create(
			{
				name: commandInstance.name,
				description: commandInstance.description,
				type: ApplicationCommandType.ChatInput,
				default_member_permissions: "0x00000008",
				options: commandInstance.get_options()
			},
			guild.id
		);

		logger.success(`Created /setup command in "${guild.name}" (${guild.id})`);
	}
	catch (err) {
		logger.error(`Failed to create /setup command in "${guild.name}" (${guild.id}):\n${err}`);
		return;
	}

	const fallbackChannel = guild.channels.cache.find(
		channel =>
			channel.type === ChannelType.GuildText &&
			channel.permissionsFor(guild.members.me!)?.has("SendMessages")
	) as TextChannel | undefined;

	if (!fallbackChannel) {
		logger.warn(`Couldn't send welcome message in "${guild.name}" — no accessible text channels.`);
		return;
	}

	const embed = new EmbedBuilder()
		.setTitle("🌟 Welcome to the family!")
		.setColor(Colors.BLURPLE)
		.setDescription(
			`I'm here to make your server smoother, smarter & cooler. 😎

			Run **/setup** to get started — it only takes a minute! ⚙️✨

			Need help? We're just a message away. 💬
			Join our [Support Server](https://discord.com/invite/2pMEpXdUp8) if you get stuck! 🛟`
		);

	await fallbackChannel.send({ content: `Heil, <@${guild.ownerId}>! 👋`, embeds: [embed] });
});
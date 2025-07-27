import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits } from "discord.js";
import { Command } from "@/structures/commands.js";

export default class SetupCommand extends Command {
	constructor() {
		super();
		this.name = "setup";
		this.description = "Starts the initial bot configuration.";
		this.enabled = true;
	}

	public get_options() {
		return [];
	}

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
			await interaction.reply({ content: "❌ Only server administrators can use this command.", flags: MessageFlags.Ephemeral });
			return;
		}

		const guild = interaction.guild;
		if (!guild) {
			await interaction.reply({ content: "❌ This command can only be used in a server.", flags: MessageFlags.Ephemeral });
			return;
		}

		const guildInfo = {
			id: guild.id,
			name: guild.name,
			owner_id: guild.ownerId,
			joined_at: Math.floor((guild.members.me?.joinedTimestamp ?? Date.now()) / 1000),
		};

		const embed = new EmbedBuilder()
			.setTitle("🎉 Welcome to my setup! 🎉")
			.setColor("#5865F2")
			.setDescription(
				`Hey there, **${interaction.user.username}**! 👋 Thanks a bunch for inviting me to your server! 🥳
				I'm here to make your community management easier and more fun! 😎✨

				Here’s a quick peek at your server info:
				• **Server Name:** ${guild.name} (${guild.id})
				• **Owner:** <@${guild.ownerId}>
				• **I Joined here:** <t:${guildInfo.joined_at}:R>
				
				Ready to get started? Just follow the steps below to set me up! 🚀`
			)
			.setFooter({ text: "always watching out for you 👀" })
			.setTimestamp();

		await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
	}
}

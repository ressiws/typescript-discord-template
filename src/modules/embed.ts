import { EmbedBuilder, ColorResolvable, TextChannel } from "discord.js";

export class embed {
	public static async create(title: string, description: string, color: ColorResolvable, channel: TextChannel): Promise<void> {
		const embed = new EmbedBuilder()
			.setTitle(title)
			.setDescription(description)
			.setColor(color);

		await channel.send({ embeds: [embed] });
	}
}

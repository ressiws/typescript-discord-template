import { ChatInputCommandInteraction } from "discord.js";

export abstract class Command {
	public name: string;
	public description: string;
	public enabled?: boolean;

	constructor() {
		this.name = "";
		this.description = "";
		this.enabled = true;
	}

	public abstract get_options(): {
		type: number;
		name: string;
		description: string;
		required: boolean;
	}[];

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply("This command doesn't have any implementation yet.");
	}
}
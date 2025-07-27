import { Collection } from "discord.js";
import { event, Events } from "../utils/events.js";
import { join } from "path";
import { Command } from "@/structures/commands.js";
import { readdirSync, statSync } from "fs";
import { pathToFileURL } from "url";
import { logger } from "@/utils/logger.js";
import { __dirname } from "@/utils/utils.js";

export class commandhandler {
	public commands: Collection<string, Command> = new Collection();

	public async load_all_commds(): Promise<void> {
		this.commands = await load_commands(join(__dirname, "../commands"));
	}

	public get_command(name: string): Command | undefined {
		return this.commands.get(name);
	}
}

export async function load_commands(directory: string): Promise<Collection<string, Command>> {
	const commands = new Collection<string, Command>();
	const files = readdirSync(directory);

	for (const file of files) {
		const full_path = join(directory, file);

		if (statSync(full_path).isDirectory()) {
			const sub_commands = load_commands(full_path);
			(await sub_commands).forEach((cmd, key) => commands.set(key, cmd));
		}
		else if (file.endsWith(".ts") || file.endsWith(".js")) {
			const module = await import(pathToFileURL(full_path).href);
			const CommandClass = module.default as { new(): Command };
			const command = new CommandClass();

			if (!command.enabled) {
				logger.warn(`Command ${command.name} is hidden and will not be registered.`);
				continue;
			}

			commands.set(command.name, command);

			logger.info(`successfully registered command: ${command.name}`);
		}
	}

	return commands;
}

export const command_handler = new commandhandler();
export default event(Events.InteractionCreate, async (_client, interaction) => {
	if (!interaction.isChatInputCommand())
		return;

	const command = command_handler.get_command(interaction.commandName);
	if (!command)
		return;

	if (!command.enabled) {
		await interaction.reply({ content: `❌ This command is currently disabled.`, ephemeral: true });
		return;
	}

	logger.info(`${interaction.user.tag} executed ${interaction.commandName}`);

	try {
		await command.execute(interaction);
	}
	catch (error) {
		logger.error(`error executing command: ${interaction.commandName}`, error);
		await interaction.reply({ content: `there was an error while executing this command!`, ephemeral: true });
	}
});
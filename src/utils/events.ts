/**
 * Event system for handling Discord.js events in a structured way.
 * Provides utilities to define, register, and log events dynamically.
 * 
 * Copyright (c) 2024 swisser https://github.com/ressiws
 */

import type { ClientEvents, Awaitable, Client } from "discord.js";
import { logger } from "./logger.js";
export { Events } from "discord.js";

export type LogMethod = (...args: unknown[]) => void;
export type EventKeys = keyof ClientEvents;

export interface EventProps {
	client: Client; // Discord client instance
	log: LogMethod; // Logger for the event
}

export type EventCallback<T extends EventKeys> = (
	// props: EventProps,
	client: Client,
	...args: ClientEvents[T]
) => Awaitable<unknown>;

export interface Event<T extends EventKeys = EventKeys> {
	key: T; // Event name
	callback: EventCallback<T>; // Event handler
}

// Creates an event object
export function event<T extends EventKeys>(
	key: T,
	callback: EventCallback<T>
): Event<T> {
	return { key, callback };
}

// Registers events to the Discord client
export function registerEvents(client: Client, events: Event[]): void {
	let success = 0;
	let failed = 0;

	for (const { key, callback } of events) {
		try {
			client.on(key, (...args) => {
				callback(client, ...args);
			});

			success++;
			logger.info(`Successfully loaded event: ${key}..`);
		}
		catch (error) {
			failed++;
			logger.error(`An error occurred while loading the event ${key}: ${error}`);
		}
	}

	logger.success(`Successfully loaded ${success}/${success + failed} events.`);
}
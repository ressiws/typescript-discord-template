import { Event } from "../utils/events.js";
import guildCreate from "./guildCreate.js";
import interactionCreate from "./interactionCreate.js";
import ready from "./ready.js";

export default [
	ready,
	guildCreate,
	interactionCreate,
] as Event[];

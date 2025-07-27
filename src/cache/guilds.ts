export interface GuildConfig {
	id: number
	guildId: string
	guildName: string
	ownerId: string
	joinedAt: number
	automod: {
		anti_link: boolean
		anti_invite: boolean
		anti_badwords: boolean
	}
	channels: {
		punishment_logs?: string
		warn_logs?: string
		general_logs?: string
	}
}

const _CACHE: Record<GuildConfig["id"], GuildConfig> = {};
export default _CACHE;
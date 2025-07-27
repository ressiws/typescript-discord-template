import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { config } from "@/config.js";
import { logger } from "@/utils/logger.js";

export enum DatabaseType {
	DISOBEY = "disobey",
}

class Database {
	private pools: Map<DatabaseType, Pool>;

	constructor() {
		this.pools = new Map();

		Object.entries(config.database).forEach(([name, dbConfig]) => {
			const key = name as keyof typeof config.database;
			dbConfig.host ??= config.maintenance ? "sql.server1.swisser.pt" : "192.168.1.62";
			this.pools.set(key as DatabaseType, mysql.createPool(dbConfig));
		});
	}

	public async query<T>(database: DatabaseType, sql: string, values?: unknown[]): Promise<T> {
		const pool = this.pools.get(database);
		if (!pool)
			throw new Error(`Database ${database} not configured`);

		let connection: PoolConnection | null = null;

		try {
			connection = await pool.getConnection();
			const [results] = await connection.query(sql, values);
			return results as T;
		}
		catch (error) {
			logger.error(`Query error on DB "${database}":`, error);
			throw error;
		}
		finally {
			connection?.release();
		}
	}
}

export const db = new Database();

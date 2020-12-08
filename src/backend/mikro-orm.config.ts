import "dotenv/config";
import type { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { Entities } from "./db/entities";

export default {
	migrations: {
		path: "./db/migrations",
		tableName: "migrations",
		transactional: true,
	},
	tsNode: process.env.NODE_ENV === "development",
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	dbName: process.env.DB_NAME,
	debug: true,
	highlighter: new SqlHighlighter(),
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	entities: Entities,
	entitiesTs: Entities,
	type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];

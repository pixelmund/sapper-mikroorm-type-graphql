/* eslint-disable import/no-mutable-exports */
import {
	Connection,
	EntityManager,
	IDatabaseDriver,
	MikroORM,
} from "@mikro-orm/core";
import ormConfig from "../mikro-orm.config";

export let orm: MikroORM<IDatabaseDriver<Connection>>;
export let em: EntityManager;
export async function initializeMikroOrm() : Promise<MikroORM<IDatabaseDriver<Connection>>> {
	orm = await MikroORM.init<IDatabaseDriver<Connection>>(ormConfig);
	em = orm.em;
	return orm;
}

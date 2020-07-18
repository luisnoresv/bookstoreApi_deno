// import { MongoClient } from 'https://deno.land/x/mongo@v0.8.0/mod.ts';
import { MongoClient } from '../../utils/deps.ts';

import {
	MONGO_DB_NAME,
	MONGO_HOST_URL,
} from '../../api/configuration/appSettings.ts';

class MongoDbContext {
	public client: MongoClient;

	/**
	 *
	 */
	constructor(public dbHostUrl: string, public dbName: string) {
		this.client = {} as MongoClient;
	}

	connect = () => {
		const client = new MongoClient();
		client.connectWithUri(this.dbHostUrl);
		this.client = client;
	};

	get database() {
		return this.client.database(this.dbName);
	}
}

const dbContext = new MongoDbContext(MONGO_HOST_URL, MONGO_DB_NAME);
dbContext.connect();

export default dbContext;

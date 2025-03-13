import mongoose from 'mongoose';
import { User } from './user.js';

const models = [User];

const loadDb = async () => {
	const dbConnection = await mongoose.connect(process.env.DATABASE_URL!);

	for (const model of Object.values(models)) {
		// eslint-disable-next-line no-await-in-loop
		await model.createCollection();
	}

	return dbConnection;
};

export default loadDb;

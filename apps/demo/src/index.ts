import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import loadDb from '@monorepo/database';
import { User } from '@monorepo/database/user';

const app = new Hono();

app.get('/users', async (c) => {
	const users = await User.find();
	return c.json({ users });
});
app.post('/users', async (c) => {
	const { email, name } = await c.req.json();
	const user = await User.create({ email, name });
	return c.json({ user });
});
app.delete('/users', async (c) => {
	await User.deleteMany();
	return c.text('Done');
});

const port = 3000;
// eslint-disable-next-line no-console
console.log(`Server is running on port ${port}`);

void loadDb();
serve({
	fetch: app.fetch,
	port,
});

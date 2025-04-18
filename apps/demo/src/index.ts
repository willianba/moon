import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import loadDb from '@monorepo/database';
import { User } from '@monorepo/database/user';

const app = new Hono();

app.get('/users', async (c) => {
	const users = await User.find();
	return c.json({ users });
});

app.get('/users/:id', async (c) => {
	const { id } = c.req.param();
	const user = await User.findById(id);
	if (!user) {
		return c.notFound();
	}
	return c.json({ user });
});

app.post('/users', async (c) => {
	const { email, name } = await c.req.json();
	const user = await User.create({ email, name });
	return c.json({ user }, 201);
});

app.delete('/users/:id', async (c) => {
	const { id } = c.req.param();
	const user = await User.findByIdAndDelete(id);
	if (!user) {
		return c.notFound();
	}
	return c.json({ user });
});

app.put('/users/:id', async (c) => {
	const { id } = c.req.param();
	const { email, name } = await c.req.json();
	const user = await User.findByIdAndUpdate(id, { email, name }, { new: true });
	if (!user) {
		return c.notFound();
	}
	return c.json({ user });
});

const port = 3000;
// eslint-disable-next-line no-console
console.log(`Server is running on port ${port}`);

void loadDb();
serve({
	fetch: app.fetch,
	port,
});

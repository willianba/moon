import path from 'node:path';
import connectLiveReload from 'connect-livereload';
import express from 'express';
import livereload from 'livereload';

const app = express();
const PORT = 3001;

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
	setTimeout(() => {
		liveReloadServer.refresh('/');
	}, 100);
});

app.use(connectLiveReload());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, '../views'));

// Task array to simulate database
let tasks = [
	{ id: 1, name: 'Task 1' },
	{ id: 2, name: 'Task 2' },
];

// Variable to store the current ID
// This is unnecessary, but I wanted to maintain the correct IDs
let currentID = 3;

// Define home route at '/' which renders our "index" ejs file in the "views" directory.
app.get('/', (_, res) => {
	res.render('index', { tasks });
});

app.post('/tasks', (req, res) => {
	const task = { id: currentID, name: req.body.name };
	tasks.push(task);
	currentID += 1;

	res.render('partials/task', { task });
});

app.delete('/tasks/:id', (req, res) => {
	const id = Number(req.params.id);
	tasks = tasks.filter((task) => task.id !== id);
	res.send('');
});

app.put('/tasks/:id', (req, res) => {
	const id = Number(req.params.id);
	const updatedTask = { id, ...req.body };
	tasks = tasks.map((task) => (task.id === id ? updatedTask : task));

	res.render('partials/task', { task: updatedTask });
});

app.get('/html/edit-form/:id', (req, res) => {
	const id = Number(req.params.id);
	const task = tasks.find((task) => task.id === id);

	res.render('partials/edit-form', { task });
});

app.get('/html/add-form', (_, res) => {
	res.render('partials/add-form');
});

// Start the server
app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on port ${PORT}`);
});

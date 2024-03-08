import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

import cp from 'child_process';

async function shell(command) {
	return new Promise((resolve, reject) => {
		const childProcess = cp.spawn(command, { shell: true, stdio: 'pipe', env: process.env });
		let output = '';

		if (childProcess.stdout) {
			childProcess.stdout.on('data', (data) => {
				output += data.toString();
			});
		}

		if (childProcess.stderr) {
			childProcess.stderr.on('data', (data) => {
				output += data.toString();
			});
		}

		childProcess.on('close', (code) => {
			if (code === 0) {
				resolve(output);
			} else {
				reject(new Error(`Command failed with exit code ${code}, output: ${output}`));
			}
		});

		childProcess.on('error', (error) => {
			reject(new Error(`Spawn error: ${error}`));
		});
	});
}

dotenv.config(path.resolve(path.join(process.cwd(), '.env')));

const PORT = process.env.PORT || 8080;
const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(path.join(process.cwd(), 'public')), { maxAge: '24h' }));

app.post('/clean', async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ error: 'Missing username or password' });
	}

	const indexDotPy = path.resolve(path.join(process.cwd(), 'src', 'index.py'));
	try {
		const result = await shell(`python3 ${indexDotPy} ${username} ${password}`);
		return res.status(200).json({ result: result.trim() });
	} catch (error) {
		if (error.message.includes('Authentication failed')) {
			return res
				.status(401)
				.json({ error: 'Authentication failed. Please check your credentials.' });
		}
		next(error);
	}
});

app.get('/healthz', (req, res) => res.json({ message: 'ok' }));

app.use((req, res, _next) => res.status(404).json({ message: 'not found' }));

app.use((err, req, res, _next) => res.status(500).json({ message: err.message }));

const server = app.listen(PORT, () => {
	console.log(`Server was started on http://localhost:${PORT}`);
});

function gracefulShutdown() {
	console.log('Received kill signal, shutting down gracefully.');
	server.close(() => {
		console.log('HTTP server closed.');
		process.exit(0);
	});
}

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at: ', promise, ' reason: ', reason);
});

export { app };

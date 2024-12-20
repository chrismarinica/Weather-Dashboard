import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Define route to serve index.html
router.get('/', (_req, res) => {
  const indexPath = path.join(__dirname, 'index.html'); // Path to the index.html file
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Failed to load the index.html file');
    }
  });
});

export default router;

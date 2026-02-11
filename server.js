const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3456;
const DATA_DIR = path.join(__dirname, 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');

// Ensure progress.json exists (gitignored, created from template on first run)
if (!fs.existsSync(PROGRESS_FILE)) {
  fs.copyFileSync(path.join(DATA_DIR, 'progress.default.json'), PROGRESS_FILE);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SSE clients
let sseClients = [];

// API: Get skills definitions
app.get('/api/skills', (req, res) => {
  res.sendFile(SKILLS_FILE);
});

// API: Get progress
app.get('/api/progress', (req, res) => {
  res.sendFile(PROGRESS_FILE);
});

// API: Toggle a skill manually
app.post('/api/toggle/:skillId', (req, res) => {
  const { skillId } = req.params;
  const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));

  if (progress.skills[skillId]?.completed) {
    delete progress.skills[skillId];
  } else {
    progress.skills[skillId] = {
      completed: true,
      timestamp: new Date().toISOString(),
      detected_by: 'manual'
    };
  }

  progress.totalCompleted = Object.values(progress.skills).filter(s => s.completed).length;
  progress.lastUpdated = new Date().toISOString();

  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  res.json(progress);
});

// API: Reset all progress
app.post('/api/reset', (req, res) => {
  const fresh = { skills: {}, figma_node_ids: [], totalCompleted: 0, lastUpdated: null };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(fresh, null, 2));
  res.json(fresh);
});

// SSE: Real-time updates
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send current state immediately
  const progress = fs.readFileSync(PROGRESS_FILE, 'utf8');
  res.write(`data: ${progress}\n\n`);

  sseClients.push(res);
  req.on('close', () => {
    sseClients = sseClients.filter(c => c !== res);
  });
});

// Push SSE updates to all connected browsers
function broadcastProgress() {
  try {
    const content = fs.readFileSync(PROGRESS_FILE, 'utf8');
    sseClients.forEach(client => {
      client.write(`data: ${content}\n\n`);
    });
  } catch (e) {
    // ignore
  }
}

// API: Hook notification endpoint — called by skill-tracker.sh after unlocking a skill
app.post('/api/notify', (req, res) => {
  broadcastProgress();
  res.json({ ok: true });
});

// Also watch the file as a fallback for manual edits
fs.watchFile(PROGRESS_FILE, { interval: 1000 }, () => {
  broadcastProgress();
});

app.listen(PORT, () => {
  console.log(`\n  Skill Tree running at http://localhost:${PORT}\n`);
});

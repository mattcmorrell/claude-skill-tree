// Claude Code Skill Tree — Client
(async function() {
  const NODE_RADIUS = 24;
  const BRANCH_COLORS = {
    foundations: '#c0c0c0',
    git: '#00ff88',
    figma: '#a855f7',
    features: '#ff8800',
    deploy: '#3b82f6',
    mastery: '#ffd700'
  };
  const BRANCH_LABELS = {
    foundations: 'Foundations',
    git: 'Git & GitHub',
    figma: 'Figma to Code',
    features: 'Building Features',
    deploy: 'Deployment',
    mastery: 'Claude Mastery'
  };
  const GLOW_IDS = {
    foundations: 'glow-silver',
    git: 'glow-green',
    figma: 'glow-purple',
    features: 'glow-orange',
    deploy: 'glow-blue',
    mastery: 'glow-gold'
  };

  let skills = [];
  let progress = { skills: {}, totalCompleted: 0 };
  let previousCompleted = new Set();
  let selectedSkill = null;

  // Fetch data
  async function fetchSkills() {
    const res = await fetch('/api/skills');
    skills = await res.json();
  }

  async function fetchProgress() {
    const res = await fetch('/api/progress');
    progress = await res.json();
  }

  // Determine node state
  function getNodeState(skill) {
    if (progress.skills[skill.id]?.completed) return 'completed';
    const prereqsMet = skill.prerequisites.every(
      pid => progress.skills[pid]?.completed
    );
    return prereqsMet ? 'available' : 'locked';
  }

  // Draw connection lines
  function drawConnections() {
    const connectionsGroup = document.getElementById('connections');
    connectionsGroup.innerHTML = '';

    skills.forEach(skill => {
      skill.prerequisites.forEach(prereqId => {
        const prereq = skills.find(s => s.id === prereqId);
        if (!prereq) return;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', prereq.position.x);
        line.setAttribute('y1', prereq.position.y);
        line.setAttribute('x2', skill.position.x);
        line.setAttribute('y2', skill.position.y);
        line.classList.add('connection-line');
        line.dataset.from = prereqId;
        line.dataset.to = skill.id;

        const fromState = getNodeState(prereq);
        const toState = getNodeState(skill);

        if (fromState === 'completed' && toState === 'completed') {
          line.classList.add('completed');
          line.style.stroke = skill.color;
          line.style.strokeOpacity = '0.5';
        } else if (fromState === 'completed') {
          line.classList.add('active');
          line.style.stroke = skill.color;
          line.style.strokeOpacity = '0.2';
        } else {
          line.style.stroke = '#1a1a2e';
        }

        connectionsGroup.appendChild(line);
      });
    });
  }

  // Draw nodes
  function drawNodes() {
    const nodesGroup = document.getElementById('nodes');
    nodesGroup.innerHTML = '';

    skills.forEach((skill, index) => {
      const state = getNodeState(skill);
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.classList.add('node-group', `node-${state}`);
      g.dataset.skillId = skill.id;
      g.setAttribute('transform', `translate(0,0)`);

      // Main circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', skill.position.x);
      circle.setAttribute('cy', skill.position.y);
      circle.setAttribute('r', NODE_RADIUS);
      circle.classList.add('node-circle');

      if (state === 'completed') {
        circle.style.fill = '#0d0d1a';
        circle.style.stroke = skill.color;
        circle.style.strokeWidth = '2.5';
        circle.style.filter = `url(#${GLOW_IDS[skill.branch]})`;
      }

      g.appendChild(circle);

      // Skill number
      const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      numText.setAttribute('x', skill.position.x);
      numText.setAttribute('y', skill.position.y);
      numText.classList.add('node-number');
      numText.textContent = index + 1;
      g.appendChild(numText);

      // Checkmark (hidden unless completed)
      const check = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      check.setAttribute('x', skill.position.x);
      check.setAttribute('y', skill.position.y);
      check.classList.add('node-check');
      check.textContent = '\u2713';
      if (state === 'completed') {
        check.style.fill = skill.color;
      }
      g.appendChild(check);

      // Label below node
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', skill.position.x);
      label.setAttribute('y', skill.position.y + NODE_RADIUS + 14);
      label.classList.add('node-label');

      // Wrap long names
      const words = skill.name.split(' ');
      if (words.length > 3) {
        const mid = Math.ceil(words.length / 2);
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        line1.setAttribute('x', skill.position.x);
        line1.setAttribute('dy', '0');
        line1.textContent = words.slice(0, mid).join(' ');
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        line2.setAttribute('x', skill.position.x);
        line2.setAttribute('dy', '12');
        line2.textContent = words.slice(mid).join(' ');
        label.appendChild(line1);
        label.appendChild(line2);
      } else {
        label.textContent = skill.name;
      }

      g.appendChild(label);

      // Click handler
      g.addEventListener('click', () => openDetail(skill));

      nodesGroup.appendChild(g);
    });
  }

  // Update progress bar
  function updateProgressBar() {
    const total = skills.length;
    const completed = progress.totalCompleted || 0;
    const pct = (completed / total) * 100;

    document.getElementById('progressFill').style.width = `${pct}%`;
    document.getElementById('progressText').textContent = `${completed} / ${total}`;

    // Check for full completion
    if (completed === total) {
      showCompletion();
    }
  }

  // Full render
  function render() {
    drawConnections();
    drawNodes();
    updateProgressBar();

    // Update detail panel if open
    if (selectedSkill) {
      updateDetailPanel(selectedSkill);
    }
  }

  // Detail panel
  function openDetail(skill) {
    selectedSkill = skill;
    updateDetailPanel(skill);
    document.getElementById('detailPanel').classList.add('open');
  }

  function updateDetailPanel(skill) {
    const state = getNodeState(skill);
    const branchEl = document.getElementById('detailBranch');
    const nameEl = document.getElementById('detailName');
    const descEl = document.getElementById('detailDesc');
    const statusEl = document.getElementById('detailStatus');
    const toggleEl = document.getElementById('detailToggle');

    branchEl.textContent = BRANCH_LABELS[skill.branch];
    branchEl.style.color = BRANCH_COLORS[skill.branch];
    nameEl.textContent = skill.name;
    descEl.textContent = skill.description;

    statusEl.className = `detail-status ${state}`;
    if (state === 'completed') {
      const ts = progress.skills[skill.id]?.timestamp;
      const method = progress.skills[skill.id]?.detected_by;
      statusEl.textContent = `Completed${method === 'hook' ? ' (auto-detected)' : ''}`;
    } else if (state === 'available') {
      statusEl.textContent = 'Available';
    } else {
      const prereqNames = skill.prerequisites
        .map(pid => skills.find(s => s.id === pid)?.name)
        .filter(Boolean)
        .join(', ');
      statusEl.textContent = `Locked — requires: ${prereqNames}`;
    }

    toggleEl.textContent = state === 'completed' ? 'Unmark' : 'Mark Complete';
    toggleEl.onclick = () => toggleSkill(skill.id);
  }

  document.getElementById('detailClose').addEventListener('click', () => {
    document.getElementById('detailPanel').classList.remove('open');
    selectedSkill = null;
  });

  // Toggle skill manually
  async function toggleSkill(skillId) {
    const res = await fetch(`/api/toggle/${skillId}`, { method: 'POST' });
    progress = await res.json();
    render();
  }

  // Toast notification
  function showToast(skillName) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-title">Skill Unlocked</div>
      <div class="toast-skill">${skillName}</div>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // Unlock animation on a node
  function animateUnlock(skillId) {
    const node = document.querySelector(`[data-skill-id="${skillId}"]`);
    if (!node) return;
    node.classList.add('node-unlocking');
    setTimeout(() => node.classList.remove('node-unlocking'), 600);
  }

  // Completion screen
  function showCompletion() {
    if (document.querySelector('.completion-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
      <div class="completion-message">
        <h2>ALL SKILLS UNLOCKED</h2>
        <p>You've mastered Claude Code. Now go build something amazing.</p>
      </div>
    `;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  }

  // Poll for updates every 2 seconds
  function startPolling() {
    setInterval(async () => {
      try {
        const res = await fetch('/api/progress');
        const newProgress = await res.json();

        // Find newly completed skills
        const newlyCompleted = Object.entries(newProgress.skills)
          .filter(([id, s]) => s.completed && !previousCompleted.has(id))
          .map(([id]) => id);

        if (newlyCompleted.length === 0) return;

        progress = newProgress;

        // Update tracked set
        previousCompleted = new Set(
          Object.entries(progress.skills)
            .filter(([, s]) => s.completed)
            .map(([id]) => id)
        );

        render();

        // Animate and toast newly unlocked skills
        newlyCompleted.forEach(id => {
          const skill = skills.find(s => s.id === id);
          if (skill) {
            animateUnlock(id);
            showToast(skill.name);
          }
        });
      } catch (e) {
        // server might be down, ignore
      }
    }, 2000);
  }

  // Initialize
  await fetchSkills();
  await fetchProgress();

  // Build initial completed set
  previousCompleted = new Set(
    Object.entries(progress.skills)
      .filter(([, s]) => s.completed)
      .map(([id]) => id)
  );

  render();
  startPolling();
})();

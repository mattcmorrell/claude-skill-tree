// Claude Code Skill Tree — Client
(async function() {
  const BRANCH_COLORS = {
    foundations: '#2dd4bf',
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

  const SKILL_ICONS = {
    'create-project': 'M4 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm7 1v4h4M10 10v6M7 13h6',
    'run-dev-server': 'M6 3l12 7-12 7V3z',
    'use-screenshots': 'M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm4 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM2 14l4-4 3 3 4-4 5 5',
    'setup-github': 'M10 1C5 1 1 5 1 10c0 4 2.5 7.3 6 8.5.4.1.6-.2.6-.4v-1.5c-2.4.5-3-1.2-3-1.2-.4-1-1-1.3-1-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.3 2 1 2.5.7.1-.6.3-1 .5-1.2-2-.2-4-1-4-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.1.1-2.4 0 0 .7-.2 2.5 1a8.4 8.4 0 014.4 0c1.7-1.2 2.5-1 2.5-1 .5 1.3.2 2.2.1 2.4.5.6.9 1.4.9 2.4 0 3.4-2 4.2-4 4.4.3.3.6.8.6 1.7v2.5c0 .3.2.5.6.4 3.5-1.2 6-4.5 6-8.5 0-5-4-9-9-9z',
    'use-branch': 'M5 3v10M15 3v4a4 4 0 01-4 4H5M15 3l-3-2M15 3l-3 2',
    'push-to-main': 'M10 18V4M10 4l-5 5M10 4l5 5',
    'connect-figma': 'M7 2h3a3 3 0 010 6H7V2zM7 8h3a3 3 0 010 6H7V8zM7 14h3a3 3 0 110 6H7v-6zM13 8a3 3 0 110 6 3 3 0 010-6zM4 5a3 3 0 110 6 3 3 0 010-6z',
    'build-from-figma': 'M4 7l4-4 4 4M4 13l4 4 4-4M14 4l2 6-2 6',
    'iterate-with-screenshots': 'M2 10a8 8 0 0114-5.3M18 10a8 8 0 01-14 5.3M2 10l2-2 2 2M18 10l-2 2-2-2',
    'build-multiple-screens': 'M3 4h14v10H3zM5 2h14v10M7 6h6M7 8h4',
    'create-chatbot': 'M3 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 4v-4H5a2 2 0 01-2-2V4zm4 3h6M7 9h4',
    'generate-mockups': 'M2 3h7v6H2V3zM11 3h7v6h-7V3zM2 11h7v6H2v-6zM11 11h7v6h-7v-6z',
    'use-playwright': 'M6 2v6a4 4 0 004 4 4 4 0 004-4V2M4 6h12M10 12v6M7 18h6',
    'deploy': 'M10 18V6M10 2l-1 4h2l-1-4zM6 10l4-4 4 4M4 14c0 2 2.7 4 6 4s6-2 6-4',
    'edit-claude-md': 'M3 17.5V14l10-10 3.5 3.5L6.5 17.5H3zM11 6l3.5 3.5',
    'create-intent-md': 'M5 2h8l4 4v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zm7 1v4h4M7 10h6M7 13h6M7 16h3',
    'create-skill': 'M10 1l2.5 6H19l-5.3 4 2 6.3L10 13.5l-5.7 3.8 2-6.3L1 7h6.5L10 1z',
    'describe-and-build': 'M3 3h14v14H3V3zm3 4h8M6 9h8M6 11h5',
    'clone-and-modify': 'M6 2v6l-4 4 4 4v4h2v-3l4-4-4-4V4h6v6l4 4-4 4v2h2v-1l4-4-4-4V2H6z',
    'download-bhr': 'M10 2v10M6 8l4 4 4-4M3 14v2a2 2 0 002 2h10a2 2 0 002-2v-2'
  };

  let skills = [];
  let progress = { skills: {}, totalCompleted: 0 };
  let previousCompleted = new Set();
  let selectedSkill = null;

  async function fetchSkills() {
    const res = await fetch('/api/skills');
    skills = await res.json();
  }

  async function fetchProgress() {
    const res = await fetch('/api/progress');
    progress = await res.json();
  }

  // Locked if the previous level isn't fully completed
  function getNodeState(skill) {
    if (progress.skills[skill.id]?.completed) return 'completed';
    const skillLevel = skill.level || 1;
    if (skillLevel === 1) return 'available';
    const prevLevelSkills = skills.filter(s => s.level === skillLevel - 1);
    const prevLevelDone = prevLevelSkills.every(s => progress.skills[s.id]?.completed);
    return prevLevelDone ? 'available' : 'locked';
  }

  // Group skills array by level field
  function groupByLevel(skillsArr) {
    const map = {};
    skillsArr.forEach(skill => {
      const lvl = skill.level || 1;
      if (!map[lvl]) map[lvl] = [];
      map[lvl].push(skill);
    });
    return map;
  }

  // Get recommended next skill
  function getRecommendedNext() {
    const available = skills.filter(s => getNodeState(s) === 'available');
    if (available.length === 0) return null;
    if (available.length === 1) return available[0].id;

    function countDownstream(skillId, visited = new Set()) {
      if (visited.has(skillId)) return 0;
      visited.add(skillId);
      const children = skills.filter(s => s.prerequisites.includes(skillId));
      let count = children.length;
      children.forEach(c => { count += countDownstream(c.id, visited); });
      return count;
    }

    let best = available[0];
    let bestCount = countDownstream(best.id);
    for (let i = 1; i < available.length; i++) {
      const c = countDownstream(available[i].id);
      if (c > bestCount) { bestCount = c; best = available[i]; }
    }
    return best.id;
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Build a card DOM element
  function createCard(skill, state, isRecommended) {
    const card = document.createElement('div');
    card.className = `skill-card ${state}`;
    if (isRecommended) card.classList.add('recommended');
    card.dataset.skillId = skill.id;

    if (state === 'completed') {
      card.style.background = hexToRgba(skill.color, 0.12);
      card.style.borderColor = hexToRgba(skill.color, 0.45);
      card.style.boxShadow = `0 0 20px ${hexToRgba(skill.color, 0.15)}, inset 0 0 30px ${hexToRgba(skill.color, 0.06)}`;
    }

    // Color accent bar at top
    const accent = document.createElement('div');
    accent.className = 'card-accent';
    accent.style.background = state === 'locked' ? '#333' : skill.color;
    card.appendChild(accent);

    if (state === 'locked') {
      // Redacted placeholder content
      const lockedContent = document.createElement('div');
      lockedContent.className = 'card-locked-content';
      for (let i = 0; i < 4; i++) {
        const bar = document.createElement('div');
        bar.className = 'redacted-line';
        if (i === 0) bar.style.width = '40px';
        else if (i === 1) bar.style.width = '90%';
        else if (i === 2) bar.style.width = '70%';
        else bar.style.width = '50%';
        lockedContent.appendChild(bar);
      }
      card.appendChild(lockedContent);
    } else {
      // Icon
      if (SKILL_ICONS[skill.id]) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'card-icon';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', SKILL_ICONS[skill.id]);
        path.setAttribute('stroke', state === 'completed' ? skill.color : '#00d4ff');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
        iconWrap.appendChild(svg);
        card.appendChild(iconWrap);
      }

      // Name
      const name = document.createElement('div');
      name.className = 'card-name';
      name.textContent = skill.name;
      card.appendChild(name);

      // Branch label
      const branch = document.createElement('div');
      branch.className = 'card-branch';
      branch.textContent = BRANCH_LABELS[skill.branch] || skill.branch;
      branch.style.color = skill.color;
      card.appendChild(branch);

      // Checkmark for completed
      if (state === 'completed') {
        const check = document.createElement('div');
        check.className = 'card-check';
        check.textContent = '✓';
        check.style.color = skill.color;
        card.appendChild(check);
      }

      // Click handler
      card.addEventListener('click', () => openDetail(skill));
    }

    return card;
  }

  // Update progress bar
  function updateProgressBar() {
    const total = skills.length;
    const completed = progress.totalCompleted || 0;
    const pct = (completed / total) * 100;
    document.getElementById('progressFill').style.width = `${pct}%`;
    document.getElementById('progressText').textContent = `${completed} / ${total}`;
    if (completed === total && total > 0) showCompletion();
  }

  function renderLegend() {
    const legend = document.getElementById('legend');
    if (!legend || legend.dataset.built) return;
    legend.dataset.built = '1';
    Object.entries(BRANCH_LABELS).forEach(([key, label]) => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      const dot = document.createElement('div');
      dot.className = 'legend-dot';
      dot.style.background = BRANCH_COLORS[key];
      dot.style.boxShadow = `0 0 6px ${BRANCH_COLORS[key]}88`;
      const text = document.createElement('span');
      text.textContent = label;
      item.appendChild(dot);
      item.appendChild(text);
      legend.appendChild(item);
    });
  }

  // Full render — build level rows with cards
  function render() {
    renderLegend();
    const container = document.getElementById('levelsContainer');
    container.innerHTML = '';

    const recommendedId = getRecommendedNext();
    const byLevel = groupByLevel(skills);
    const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

    levels.forEach(lvl => {
      const row = document.createElement('div');
      row.className = 'level-row';

      const label = document.createElement('div');
      label.className = 'level-label';
      label.textContent = `Level ${lvl}`;
      row.appendChild(label);

      const cardsRow = document.createElement('div');
      cardsRow.className = 'level-cards';

      byLevel[lvl].forEach(skill => {
        const state = getNodeState(skill);
        const isRec = skill.id === recommendedId;
        const card = createCard(skill, state, isRec);
        cardsRow.appendChild(card);
      });

      row.appendChild(cardsRow);
      container.appendChild(row);
    });

    updateProgressBar();

    if (selectedSkill) {
      updateDetailPanel(selectedSkill);
    }
  }

  // Open detail panel — centered modal
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
    const tryItEl = document.getElementById('detailTryIt');
    const diffEl = document.getElementById('detailDifficulty');

    branchEl.textContent = BRANCH_LABELS[skill.branch];
    branchEl.style.color = BRANCH_COLORS[skill.branch];
    nameEl.textContent = skill.name;
    descEl.textContent = skill.description;

    diffEl.style.display = 'none';

    tryItEl.textContent = skill.tryIt || '';

    statusEl.className = `detail-status ${state}`;
    if (state === 'completed') {
      const method = progress.skills[skill.id]?.detected_by;
      statusEl.textContent = `Completed${method === 'hook' ? ' (auto-detected)' : ''}`;
    } else if (state === 'available') {
      statusEl.textContent = 'Available';
    } else {
      statusEl.textContent = `Locked — complete Level ${(skill.level || 1) - 1} first`;
    }

    toggleEl.textContent = state === 'completed' ? 'Unmark' : 'Mark Complete';
    toggleEl.onclick = () => toggleSkill(skill.id);
  }

  document.getElementById('detailClose').addEventListener('click', () => {
    document.getElementById('detailPanel').classList.remove('open');
    selectedSkill = null;
  });

  document.addEventListener('click', (e) => {
    const panel = document.getElementById('detailPanel');
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target)) return;
    if (e.target.closest('.skill-card')) return;
    panel.classList.remove('open');
    selectedSkill = null;
  });

  async function toggleSkill(skillId) {
    const res = await fetch(`/api/toggle/${skillId}`, { method: 'POST' });
    progress = await res.json();
    render();
  }

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

  function animateUnlock(skillId) {
    const card = document.querySelector(`[data-skill-id="${skillId}"]`);
    if (!card) return;
    card.classList.add('card-unlocking');
    setTimeout(() => card.classList.remove('card-unlocking'), 700);
  }

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

  function startPolling() {
    setInterval(async () => {
      try {
        const res = await fetch('/api/progress');
        const newProgress = await res.json();

        const newlyCompleted = Object.entries(newProgress.skills)
          .filter(([id, s]) => s.completed && !previousCompleted.has(id))
          .map(([id]) => id);

        if (newlyCompleted.length === 0) return;

        progress = newProgress;
        previousCompleted = new Set(
          Object.entries(progress.skills)
            .filter(([, s]) => s.completed)
            .map(([id]) => id)
        );

        render();

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

  await fetchSkills();
  await fetchProgress();

  previousCompleted = new Set(
    Object.entries(progress.skills)
      .filter(([, s]) => s.completed)
      .map(([id]) => id)
  );

  render();
  startPolling();
})();

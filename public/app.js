// Claude Code Skill Tree — Client
(async function() {
  const NODE_RADIUS = 24;
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
  const GLOW_IDS = {
    foundations: 'glow-silver',
    git: 'glow-green',
    figma: 'glow-purple',
    features: 'glow-orange',
    deploy: 'glow-blue',
    mastery: 'glow-gold'
  };

  // Feature 7: SVG icon paths (20x20 coordinate space, stroke-based)
  const SKILL_ICONS = {
    'create-project': 'M4 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm7 1v4h4M10 10v6M7 13h6', // folder+
    'run-dev-server': 'M6 3l12 7-12 7V3z', // play
    'use-screenshots': 'M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm4 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM2 14l4-4 3 3 4-4 5 5', // camera
    'setup-github': 'M10 1C5 1 1 5 1 10c0 4 2.5 7.3 6 8.5.4.1.6-.2.6-.4v-1.5c-2.4.5-3-1.2-3-1.2-.4-1-1-1.3-1-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.3 2 1 2.5.7.1-.6.3-1 .5-1.2-2-.2-4-1-4-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.1.1-2.4 0 0 .7-.2 2.5 1a8.4 8.4 0 014.4 0c1.7-1.2 2.5-1 2.5-1 .5 1.3.2 2.2.1 2.4.5.6.9 1.4.9 2.4 0 3.4-2 4.2-4 4.4.3.3.6.8.6 1.7v2.5c0 .3.2.5.6.4 3.5-1.2 6-4.5 6-8.5 0-5-4-9-9-9z', // github
    'use-branch': 'M5 3v10M15 3v4a4 4 0 01-4 4H5M15 3l-3-2M15 3l-3 2', // branch
    'push-to-main': 'M10 18V4M10 4l-5 5M10 4l5 5', // arrow up
    'connect-figma': 'M7 2h3a3 3 0 010 6H7V2zM7 8h3a3 3 0 010 6H7V8zM7 14h3a3 3 0 110 6H7v-6zM13 8a3 3 0 110 6 3 3 0 010-6zM4 5a3 3 0 110 6 3 3 0 010-6z', // figma
    'build-from-figma': 'M4 7l4-4 4 4M4 13l4 4 4-4M14 4l2 6-2 6', // code brackets
    'iterate-with-screenshots': 'M2 10a8 8 0 0114-5.3M18 10a8 8 0 01-14 5.3M2 10l2-2 2 2M18 10l-2 2-2-2', // refresh
    'build-multiple-screens': 'M3 4h14v10H3zM5 2h14v10M7 6h6M7 8h4', // stacked screens
    'create-chatbot': 'M3 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 4v-4H5a2 2 0 01-2-2V4zm4 3h6M7 9h4', // chat
    'generate-mockups': 'M2 3h7v6H2V3zM11 3h7v6h-7V3zM2 11h7v6H2v-6zM11 11h7v6h-7v-6z', // grid of 4 screens
    'use-playwright': 'M6 2v6a4 4 0 004 4 4 4 0 004-4V2M4 6h12M10 12v6M7 18h6', // flask
    'deploy': 'M10 18V6M10 2l-1 4h2l-1-4zM6 10l4-4 4 4M4 14c0 2 2.7 4 6 4s6-2 6-4', // rocket
    'edit-claude-md': 'M3 17.5V14l10-10 3.5 3.5L6.5 17.5H3zM11 6l3.5 3.5', // pencil
    'create-intent-md': 'M5 2h8l4 4v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zm7 1v4h4M7 10h6M7 13h6M7 16h3', // document
    'create-skill': 'M10 1l2.5 6H19l-5.3 4 2 6.3L10 13.5l-5.7 3.8 2-6.3L1 7h6.5L10 1z', // star/lightning
    'describe-and-build': 'M3 3h14v14H3V3zm3 4h8M6 9h8M6 11h5', // wireframe/layout
    'clone-and-modify': 'M6 2v6l-4 4 4 4v4h2v-3l4-4-4-4V4h6v6l4 4-4 4v2h2v-1l4-4-4-4V2H6z', // clone fork
    'download-bhr': 'M10 2v10M6 8l4 4 4-4M3 14v2a2 2 0 002 2h10a2 2 0 002-2v-2' // download arrow
  };

  // Feature 4: Zone definitions for colored backgrounds
  const ZONE_DEFS = [
    { branch: 'mastery', cx: 180, cy: 470, rx: 120, ry: 150 },
    { branch: 'git', cx: 370, cy: 370, rx: 160, ry: 250 },
    { branch: 'foundations', cx: 630, cy: 620, rx: 130, ry: 200 },
    { branch: 'deploy', cx: 630, cy: 370, rx: 50, ry: 50 },
    { branch: 'features', cx: 780, cy: 300, rx: 120, ry: 140 },
    { branch: 'figma', cx: 1000, cy: 370, rx: 140, ry: 250 }
  ];

  let skills = [];
  let progress = { skills: {}, totalCompleted: 0 };
  let previousCompleted = new Set();
  let selectedSkill = null;
  let zonesDrawn = false;

  // Fetch data
  async function fetchSkills() {
    const res = await fetch('/api/skills');
    skills = await res.json();
  }

  async function fetchProgress() {
    const res = await fetch('/api/progress');
    progress = await res.json();
  }

  // Determine node state — all skills are always available (no locked state)
  function getNodeState(skill) {
    if (progress.skills[skill.id]?.completed) return 'completed';
    return 'available';
  }

  // Helper: is a color "light" enough to need dark icon contrast?
  function isLightColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 160;
  }

  // Get recommended next skill — the available skill that unlocks the most downstream skills
  function getRecommendedNext() {
    const available = skills.filter(s => getNodeState(s) === 'available');
    if (available.length === 0) return null;
    if (available.length === 1) return available[0].id;

    // Count how many skills are downstream of each available skill
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
      if (c > bestCount) {
        bestCount = c;
        best = available[i];
      }
    }
    return best.id;
  }

  // Feature 4: Draw background zones (once)
  function drawZones() {
    if (zonesDrawn) return;
    zonesDrawn = true;
    const zonesGroup = document.getElementById('zones');

    const svg = document.getElementById('treeSvg');
    const defs = svg.querySelector('defs');

    ZONE_DEFS.forEach((zone, i) => {
      const color = BRANCH_COLORS[zone.branch];

      // Create radial gradient
      const gradId = `zone-grad-${zone.branch}`;
      const grad = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      grad.setAttribute('id', gradId);
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', color);
      stop1.setAttribute('stop-opacity', '0.18');
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', color);
      stop2.setAttribute('stop-opacity', '0');
      grad.appendChild(stop1);
      grad.appendChild(stop2);
      defs.appendChild(grad);

      // Create ellipse
      const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ellipse.setAttribute('cx', zone.cx);
      ellipse.setAttribute('cy', zone.cy);
      ellipse.setAttribute('rx', zone.rx);
      ellipse.setAttribute('ry', zone.ry);
      ellipse.setAttribute('fill', `url(#${gradId})`);
      ellipse.style.pointerEvents = 'none';
      zonesGroup.appendChild(ellipse);
    });
  }

  // Feature 2: Draw curved connection lines (cubic bezier)
  function drawConnections() {
    const connectionsGroup = document.getElementById('connections');
    connectionsGroup.innerHTML = '';

    skills.forEach(skill => {
      skill.prerequisites.forEach(prereqId => {
        const prereq = skills.find(s => s.id === prereqId);
        if (!prereq) return;

        const x1 = prereq.position.x;
        const y1 = prereq.position.y;
        const x2 = skill.position.x;
        const y2 = skill.position.y;

        // Cubic bezier control points — S-curve when offset, straight when aligned
        const dy = y1 - y2;
        const cp1x = x1;
        const cp1y = y1 - dy * 0.45;
        const cp2x = x2;
        const cp2y = y2 + dy * 0.45;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`);
        path.classList.add('connection-line');
        path.dataset.from = prereqId;
        path.dataset.to = skill.id;

        const fromState = getNodeState(prereq);
        const toState = getNodeState(skill);

        if (fromState === 'completed' && toState === 'completed') {
          path.classList.add('completed');
          path.style.stroke = skill.color;
          path.style.strokeOpacity = '0.5';
        } else if (fromState === 'completed') {
          // Feature 3: active connections get animated flowing dashes via CSS
          path.classList.add('active');
          path.style.stroke = skill.color;
        } else {
          path.style.stroke = '#5a5a80';
        }

        connectionsGroup.appendChild(path);
      });
    });
  }

  // Draw branch labels
  function drawBranchLabels() {
    document.querySelectorAll('.svg-branch-label').forEach(el => el.remove());

    const labelsGroup = document.getElementById('connections');
    const branches = [
      { name: 'CLAUDE MASTERY', color: '#ffd700', x: 170, y: 315 },
      { name: 'GIT & GITHUB', color: '#00ff88', x: 370, y: 110 },
      { name: 'FOUNDATIONS', color: '#2dd4bf', x: 630, y: 510 },
      { name: 'SHIP IT', color: '#3b82f6', x: 630, y: 315 },
      { name: 'FEATURES', color: '#ff8800', x: 780, y: 315 },
      { name: 'FIGMA TO CODE', color: '#a855f7', x: 1000, y: 110 }
    ];

    branches.forEach(b => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', b.x);
      text.setAttribute('y', b.y);
      text.classList.add('svg-branch-label');
      text.style.fill = b.color;
      text.style.fontSize = '11px';
      text.style.fontFamily = "'SF Mono', 'Fira Code', monospace";
      text.style.fontWeight = '700';
      text.style.letterSpacing = '2px';
      text.style.textAnchor = 'middle';
      text.style.opacity = '0.35';
      text.style.pointerEvents = 'none';
      text.textContent = b.name;
      labelsGroup.appendChild(text);
    });
  }

  // Feature 5: Draw per-branch progress indicators
  function drawBranchProgress() {
    document.querySelectorAll('.branch-progress').forEach(el => el.remove());

    const labelsGroup = document.getElementById('connections');
    const branchPositions = [
      { branch: 'mastery', x: 170, y: 327 },
      { branch: 'git', x: 370, y: 122 },
      { branch: 'foundations', x: 630, y: 522 },
      { branch: 'deploy', x: 630, y: 327 },
      { branch: 'features', x: 780, y: 327 },
      { branch: 'figma', x: 1000, y: 122 }
    ];

    branchPositions.forEach(bp => {
      const branchSkills = skills.filter(s => s.branch === bp.branch);
      const total = branchSkills.length;
      const done = branchSkills.filter(s => progress.skills[s.id]?.completed).length;

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', bp.x);
      text.setAttribute('y', bp.y);
      text.classList.add('branch-progress');
      text.style.fill = BRANCH_COLORS[bp.branch];
      text.style.opacity = done > 0 ? '0.6' : '0.2';
      text.textContent = `${done}/${total}`;
      labelsGroup.appendChild(text);
    });
  }

  // Feature 6: START HERE callout
  function drawStartHere() {
    // Remove any existing callout
    document.querySelectorAll('.start-here-group').forEach(el => el.remove());

    if (progress.totalCompleted > 0) return;

    // Find node 1 (first skill)
    const firstSkill = skills[0];
    if (!firstSkill) return;

    const nodesGroup = document.getElementById('nodes');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('start-here-group');
    g.style.pointerEvents = 'none';

    const cx = firstSkill.position.x;
    const cy = firstSkill.position.y;

    // Pulsing ring
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', NODE_RADIUS + 4);
    ring.classList.add('start-here-ring');
    g.appendChild(ring);

    // Second ring offset for layered effect
    const ring2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring2.setAttribute('cx', cx);
    ring2.setAttribute('cy', cy);
    ring2.setAttribute('r', NODE_RADIUS + 4);
    ring2.classList.add('start-here-ring');
    ring2.style.animationDelay = '0.75s';
    g.appendChild(ring2);

    // Bouncing arrow (pointing down toward node)
    const arrowY = cy - NODE_RADIUS - 28;
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrow.setAttribute('points', `${cx},${arrowY + 10} ${cx - 6},${arrowY} ${cx + 6},${arrowY}`);
    arrow.classList.add('start-here-arrow');
    g.appendChild(arrow);

    // "START HERE" text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cx);
    text.setAttribute('y', arrowY - 8);
    text.classList.add('start-here-text');
    text.textContent = 'START HERE';
    g.appendChild(text);

    nodesGroup.appendChild(g);
  }

  // Feature 7: Render SVG icon inside a node
  function renderNodeIcon(g, skill, state) {
    const iconPath = SKILL_ICONS[skill.id];
    if (!iconPath) return;

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    icon.classList.add('node-icon');
    icon.setAttribute('transform', `translate(${skill.position.x - 10}, ${skill.position.y - 10})`);

    // Split compound paths and render
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', iconPath);
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke-width', '1.5');
    pathEl.setAttribute('stroke-linecap', 'round');
    pathEl.setAttribute('stroke-linejoin', 'round');

    if (state === 'completed') {
      const dark = isLightColor(skill.color);
      pathEl.setAttribute('stroke', dark ? '#1a1a2e' : '#ffffff');
    } else if (state === 'available') {
      pathEl.setAttribute('stroke', '#00d4ff');
    } else {
      pathEl.setAttribute('stroke', '#b0b0c8');
    }

    icon.appendChild(pathEl);
    g.appendChild(icon);
  }

  // Draw nodes — Feature 1 (solid fills) + Feature 7 (icons)
  function drawNodes() {
    const nodesGroup = document.getElementById('nodes');
    nodesGroup.innerHTML = '';

    const recommendedId = getRecommendedNext();

    skills.forEach((skill, index) => {
      const state = getNodeState(skill);
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.classList.add('node-group', `node-${state}`);
      if (skill.id === recommendedId) g.classList.add('node-recommended');
      g.dataset.skillId = skill.id;
      g.setAttribute('transform', `translate(0,0)`);

      // Main circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', skill.position.x);
      circle.setAttribute('cy', skill.position.y);
      circle.setAttribute('r', NODE_RADIUS);
      circle.classList.add('node-circle');

      if (state === 'completed') {
        // Feature 1: Solid filled completed nodes
        circle.style.fill = skill.color;
        circle.style.stroke = skill.color;
        circle.style.strokeWidth = '2.5';
        circle.style.filter = `url(#${GLOW_IDS[skill.branch]})`;
      }

      g.appendChild(circle);

      // Feature 7: SVG icon instead of number
      if (SKILL_ICONS[skill.id]) {
        renderNodeIcon(g, skill, state);

        // Hidden number (keep for accessibility but don't display)
        const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        numText.setAttribute('x', skill.position.x);
        numText.setAttribute('y', skill.position.y);
        numText.classList.add('node-number');
        numText.style.fill = 'transparent';
        numText.textContent = index + 1;
        g.appendChild(numText);
      } else {
        // Fallback: show number if no icon defined
        const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        numText.setAttribute('x', skill.position.x);
        numText.setAttribute('y', skill.position.y);
        numText.classList.add('node-number');
        numText.textContent = index + 1;
        g.appendChild(numText);
      }

      // Checkmark — only show on completed nodes that have no icon
      if (!SKILL_ICONS[skill.id]) {
        const check = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        check.setAttribute('x', skill.position.x);
        check.setAttribute('y', skill.position.y);
        check.classList.add('node-check');
        check.textContent = '\u2713';
        if (state === 'completed') {
          check.style.fill = isLightColor(skill.color) ? '#1a1a2e' : '#ffffff';
        }
        g.appendChild(check);
      }

      // Label below node
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', skill.position.x);
      label.setAttribute('y', skill.position.y + NODE_RADIUS + 14);
      label.classList.add('node-label');

      const words = skill.name.split(' ');
      if (words.length > 3) {
        const mid = Math.ceil(words.length / 2);
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        line1.setAttribute('x', skill.position.x);
        line1.setAttribute('dy', '0');
        line1.textContent = words.slice(0, mid).join(' ');
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        line2.setAttribute('x', skill.position.x);
        line2.setAttribute('dy', '14');
        line2.textContent = words.slice(mid).join(' ');
        label.appendChild(line1);
        label.appendChild(line2);
      } else {
        label.textContent = skill.name;
      }

      g.appendChild(label);

      // Difficulty pip — small colored dot at top-right of node
      if (skill.difficulty) {
        const pip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const pipAngle = -Math.PI / 4; // top-right
        pip.setAttribute('cx', skill.position.x + Math.cos(pipAngle) * (NODE_RADIUS + 1));
        pip.setAttribute('cy', skill.position.y + Math.sin(pipAngle) * (NODE_RADIUS + 1));
        pip.setAttribute('r', 3.5);
        pip.classList.add('difficulty-pip', skill.difficulty);
        g.appendChild(pip);
      }

      // Click handler
      g.addEventListener('click', () => openDetail(skill));

      // Hover tooltip handlers
      g.addEventListener('mouseenter', (e) => {
        const tooltip = document.getElementById('hoverTooltip');
        document.getElementById('tooltipName').textContent = skill.name;
        document.getElementById('tooltipDesc').textContent = skill.description;
        const diffEl = document.getElementById('tooltipDifficulty');
        diffEl.textContent = skill.difficulty ? skill.difficulty.toUpperCase() : '';
        diffEl.className = 'tooltip-difficulty' + (skill.difficulty ? ` ${skill.difficulty}` : '');

        const svg = document.getElementById('treeSvg');
        const svgRect = svg.getBoundingClientRect();
        const scaleX = svgRect.width / 1200;
        const scaleY = svgRect.height / 850;
        const screenX = svgRect.left + skill.position.x * scaleX;
        const screenY = svgRect.top + skill.position.y * scaleY;

        let left = screenX + NODE_RADIUS * scaleX + 12;
        let top = screenY - 20;
        if (left + 240 > window.innerWidth - 16) {
          left = screenX - NODE_RADIUS * scaleX - 252;
        }
        top = Math.max(8, Math.min(top, window.innerHeight - 100));

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.classList.add('visible');
      });

      g.addEventListener('mouseleave', () => {
        document.getElementById('hoverTooltip').classList.remove('visible');
      });

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

    if (completed === total) {
      showCompletion();
    }
  }

  // Full render
  function render() {
    drawZones();
    drawConnections();
    drawBranchLabels();
    drawBranchProgress();
    drawNodes();
    drawStartHere();
    updateProgressBar();

    if (selectedSkill) {
      updateDetailPanel(selectedSkill);
    }
  }

  // Detail panel — position next to clicked node
  function openDetail(skill, event) {
    document.getElementById('hoverTooltip').classList.remove('visible');
    selectedSkill = skill;
    updateDetailPanel(skill);

    const panel = document.getElementById('detailPanel');
    const svg = document.getElementById('treeSvg');
    const svgRect = svg.getBoundingClientRect();

    const svgWidth = 1200;
    const svgHeight = 850;
    const scaleX = svgRect.width / svgWidth;
    const scaleY = svgRect.height / svgHeight;
    const screenX = svgRect.left + skill.position.x * scaleX;
    const screenY = svgRect.top + skill.position.y * scaleY;

    const panelWidth = 300;
    const gap = 20;
    let left = screenX + NODE_RADIUS * scaleX + gap;
    let top = screenY - 40;

    if (left + panelWidth > window.innerWidth - 16) {
      left = screenX - NODE_RADIUS * scaleX - gap - panelWidth;
    }
    top = Math.max(16, Math.min(top, window.innerHeight - 280));

    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.classList.add('open');
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

    // Difficulty badge
    if (skill.difficulty) {
      diffEl.textContent = skill.difficulty.toUpperCase();
      diffEl.className = `detail-difficulty ${skill.difficulty}`;
      diffEl.style.display = '';
    } else {
      diffEl.style.display = 'none';
    }

    // Try It prompt
    tryItEl.textContent = skill.tryIt || '';

    statusEl.className = `detail-status ${state}`;
    if (state === 'completed') {
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

  document.addEventListener('click', (e) => {
    const panel = document.getElementById('detailPanel');
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target)) return;
    if (e.target.closest('.node-group')) return;
    panel.classList.remove('open');
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

  // Feature 8: Better unlock animation — ring explosion + particle burst
  function animateUnlock(skillId) {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    const node = document.querySelector(`[data-skill-id="${skillId}"]`);
    if (!node) return;

    // CSS scale bounce
    node.classList.add('node-unlocking');
    setTimeout(() => node.classList.remove('node-unlocking'), 600);

    const svg = document.getElementById('treeSvg');
    const cx = skill.position.x;
    const cy = skill.position.y;
    const color = skill.color;

    // Expanding ring
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', NODE_RADIUS);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', color);
    ring.setAttribute('stroke-width', '2');
    ring.style.pointerEvents = 'none';
    svg.appendChild(ring);

    const ringStart = performance.now();
    function animateRing(now) {
      const elapsed = now - ringStart;
      const t = Math.min(elapsed / 600, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const r = NODE_RADIUS + (NODE_RADIUS * 2) * eased;
      const opacity = 1 - eased;
      ring.setAttribute('r', r);
      ring.setAttribute('stroke-opacity', opacity);
      if (t < 1) {
        requestAnimationFrame(animateRing);
      } else {
        ring.remove();
      }
    }
    requestAnimationFrame(animateRing);

    // Particle burst — 10 dots radiating outward
    const particles = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', cx);
      dot.setAttribute('cy', cy);
      dot.setAttribute('r', 2.5);
      dot.setAttribute('fill', color);
      dot.style.pointerEvents = 'none';
      svg.appendChild(dot);
      particles.push({ el: dot, angle });
    }

    const particleStart = performance.now();
    function animateParticles(now) {
      const elapsed = now - particleStart;
      const t = Math.min(elapsed / 700, 1);
      const eased = 1 - Math.pow(1 - t, 2); // ease-out quadratic

      particles.forEach(p => {
        const dist = (NODE_RADIUS * 2.5) * eased;
        const px = cx + Math.cos(p.angle) * dist;
        const py = cy + Math.sin(p.angle) * dist;
        p.el.setAttribute('cx', px);
        p.el.setAttribute('cy', py);
        p.el.setAttribute('r', 2.5 * (1 - eased));
        p.el.setAttribute('opacity', 1 - eased);
      });

      if (t < 1) {
        requestAnimationFrame(animateParticles);
      } else {
        particles.forEach(p => p.el.remove());
      }
    }
    requestAnimationFrame(animateParticles);
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

  // Initialize
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

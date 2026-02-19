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

  const LEVEL_SUBTITLES = {
    2: 'Basics',
    3: 'GitHub',
    4: 'Build from Figma',
    5: 'Claude Tricks',
    6: 'Phenomenal Cosmic Power',
    7: 'Smart Systems: The Final Frontier'
  };

  const SKILL_ICONS = {
    'install-claude-code': 'M10 2v10M6 8l4 4 4-4M3 14v2a2 2 0 002 2h10a2 2 0 002-2v-2',
    'create-project': 'M4 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm7 1v4h4M10 10v6M7 13h6',
    'describe-and-build': 'M3 3h14v14H3V3zm3 4h8M6 9h8M6 11h5',
    'run-dev-server': 'M6 3l12 7-12 7V3z',
    'use-screenshots': 'M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm4 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM2 14l4-4 3 3 4-4 5 5',
    'iterate-on-styling': 'M3 3h14v14H3V3zM7 7h2v2H7V7zM11 7h2v2h-2V7zM7 11h6v2H7v-2z',
    'change-claude-model': 'M10 2a8 8 0 100 16 8 8 0 000-16zM10 6v4l3 2',
    'setup-github': 'M10 1C5 1 1 5 1 10c0 4 2.5 7.3 6 8.5.4.1.6-.2.6-.4v-1.5c-2.4.5-3-1.2-3-1.2-.4-1-1-1.3-1-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.3 2 1 2.5.7.1-.6.3-1 .5-1.2-2-.2-4-1-4-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.1.1-2.4 0 0 .7-.2 2.5 1a8.4 8.4 0 014.4 0c1.7-1.2 2.5-1 2.5-1 .5 1.3.2 2.2.1 2.4.5.6.9 1.4.9 2.4 0 3.4-2 4.2-4 4.4.3.3.6.8.6 1.7v2.5c0 .3.2.5.6.4 3.5-1.2 6-4.5 6-8.5 0-5-4-9-9-9z',
    'clone-bhr-template': 'M10 2v10M6 8l4 4 4-4M3 14v2a2 2 0 002 2h10a2 2 0 002-2v-2',
    'create-branch': 'M5 3v10M15 3v4a4 4 0 01-4 4H5M15 3l-3-2M15 3l-3 2',
    'commit-and-push': 'M10 18V4M10 4l-5 5M10 4l5 5',
    'connect-figma': 'M7 2h3a3 3 0 010 6H7V2zM7 8h3a3 3 0 010 6H7V8zM7 14h3a3 3 0 110 6H7v-6zM13 8a3 3 0 110 6 3 3 0 010-6zM4 5a3 3 0 110 6 3 3 0 010-6z',
    'add-to-existing-screen': 'M3 3h14v14H3V3zM10 7v6M7 10h6',
    'build-new-page-from-figma': 'M4 7l4-4 4 4M4 13l4 4 4-4M14 4l2 6-2 6',
    'use-playwright': 'M6 2v6a4 4 0 004 4 4 4 0 004-4V2M4 6h12M10 12v6M7 18h6',
    'edit-claude-md': 'M3 17.5V14l10-10 3.5 3.5L6.5 17.5H3zM11 6l3.5 3.5',
    'use-plan-mode': 'M3 3h14v2H3V3zM3 8h10v2H3V8zM3 13h14v2H3v-2zM15 8l3 1-3 1',
    'create-skill': 'M10 1l2.5 6H19l-5.3 4 2 6.3L10 13.5l-5.7 3.8 2-6.3L1 7h6.5L10 1z',
    'generate-mockups': 'M2 3h7v6H2V3zM11 3h7v6h-7V3zM2 11h7v6H2v-6zM11 11h7v6h-7v-6z',
    'deploy': 'M10 18V6M10 2l-1 4h2l-1-4zM6 10l4-4 4 4M4 14c0 2 2.7 4 6 4s6-2 6-4',
    'run-multiple-instances': 'M2 3h7v5H2V3zM11 3h7v5h-7V3zM2 11h7v5H2v-5zM11 11h7v5h-7v-5z',
    'create-chatbot': 'M3 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 4v-4H5a2 2 0 01-2-2V4zm4 3h6M7 9h4'
  };

  const RANK_COLORS = ['#33334a', '#2dd4bf', '#3b82f6', '#a855f7', '#ff8800', '#ffd700', '#00d4ff'];

  // Thresholds align with completing each level (22 skills, levels 0-7)
  function getCurrentRankIndex(completed) {
    if (completed >= 22) return 6;
    if (completed >= 19) return 5;
    if (completed >= 15) return 4;
    if (completed >= 11) return 3;
    if (completed >= 6)  return 2;
    if (completed >= 1)  return 1;
    return 0;
  }

  function buildBadgeSvg(rankIdx) {
    const sz = 280;
    const c = 140; // center
    const vb = `0 0 ${sz} ${sz}`;

    switch (rankIdx) {

      // Level 1 — bare hexagon outline, dim, minimal. Just booted up.
      case 0: return `
        <svg viewBox="${vb}" width="${sz}" height="${sz}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="${c},20 ${c+68},55 ${c+68},145 ${c},180 ${c-68},145 ${c-68},55"
            fill="#0a0a14" stroke="#2a2a3a" stroke-width="1.5"/>
          <polygon points="${c},50 ${c+46},72 ${c+46},128 ${c},150 ${c-46},128 ${c-46},72"
            fill="none" stroke="#1e1e2e" stroke-width="1"/>
          <line x1="${c-68}" y1="${c}" x2="${c+68}" y2="${c}" stroke="#1a1a28" stroke-width="0.75"/>
          <line x1="${c}" y1="20" x2="${c}" y2="180" stroke="#1a1a28" stroke-width="0.75"/>
          <text x="${c}" y="${c+6}" text-anchor="middle" font-family="'SF Mono','Fira Code',monospace" font-size="32" font-weight="700" fill="#2a2a3a">1</text>
        </svg>`;

      // Level 2 — hexagon with scanlines, a center pip, teal glow starting
      case 1: return `
        <svg viewBox="${vb}" width="${sz}" height="${sz}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gf1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feFlood flood-color="#2dd4bf" flood-opacity="0.4"/>
              <feComposite in2="b" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <polygon points="${c},20 ${c+68},55 ${c+68},145 ${c},180 ${c-68},145 ${c-68},55"
            fill="#060f0e" stroke="#2dd4bf" stroke-width="1.5" filter="url(#gf1)"/>
          <line x1="72" y1="80" x2="208" y2="80" stroke="#2dd4bf" stroke-width="1" opacity="0.2"/>
          <line x1="72" y1="100" x2="208" y2="100" stroke="#2dd4bf" stroke-width="0.75" opacity="0.15"/>
          <line x1="72" y1="120" x2="208" y2="120" stroke="#2dd4bf" stroke-width="1" opacity="0.2"/>
          <line x1="72" y1="140" x2="208" y2="140" stroke="#2dd4bf" stroke-width="0.75" opacity="0.1"/>
          <line x1="72" y1="160" x2="208" y2="160" stroke="#2dd4bf" stroke-width="0.75" opacity="0.1"/>
          <circle cx="${c}" cy="${c}" r="8" fill="#2dd4bf" opacity="0.6" filter="url(#gf1)"/>
          <circle cx="${c}" cy="${c}" r="3" fill="#ffffff" opacity="0.7"/>
          <text x="${c}" y="210" text-anchor="middle" font-family="'SF Mono','Fira Code',monospace" font-size="14" fill="#2dd4bf" opacity="0.5" letter-spacing="6">SYS.ONLINE</text>
        </svg>`;

      // Level 3 — hexagon + inner hex + data lines radiating, blue
      case 2: return `
        <svg viewBox="${vb}" width="${sz}" height="${sz}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gf2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="b"/>
              <feFlood flood-color="#3b82f6" flood-opacity="0.5"/>
              <feComposite in2="b" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <polygon points="${c},16 ${c+72},54 ${c+72},148 ${c},186 ${c-72},148 ${c-72},54"
            fill="#06091a" stroke="#3b82f6" stroke-width="1.5" filter="url(#gf2)"/>
          <polygon points="${c},50 ${c+46},72 ${c+46},128 ${c},150 ${c-46},128 ${c-46},72"
            fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.3"/>
          <line x1="${c}" y1="16" x2="${c}" y2="50" stroke="#3b82f6" stroke-width="1" opacity="0.5"/>
          <line x1="${c}" y1="150" x2="${c}" y2="186" stroke="#3b82f6" stroke-width="1" opacity="0.5"/>
          <line x1="${c-72}" y1="100" x2="${c-46}" y2="100" stroke="#3b82f6" stroke-width="1" opacity="0.5"/>
          <line x1="${c+46}" y1="100" x2="${c+72}" y2="100" stroke="#3b82f6" stroke-width="1" opacity="0.5"/>
          <circle cx="${c}" cy="${c}" r="20" fill="none" stroke="#3b82f6" stroke-width="1.5" opacity="0.6" filter="url(#gf2)"/>
          <circle cx="${c}" cy="${c}" r="6" fill="#3b82f6" opacity="0.7" filter="url(#gf2)"/>
          <text x="${c}" y="${c+5}" text-anchor="middle" font-family="'SF Mono','Fira Code',monospace" font-size="28" font-weight="700" fill="#3b82f6" filter="url(#gf2)">3</text>
        </svg>`;

      // Level 4 — hexagon + wing brackets + inner rotating ring, purple
      case 3: return `
        <svg viewBox="${vb}" width="${sz}" height="${sz}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gf3" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feFlood flood-color="#a855f7" flood-opacity="0.5"/>
              <feComposite in2="b" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <polyline points="46,54 28,70 28,130 46,146" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.5" filter="url(#gf3)"/>
          <polyline points="234,54 252,70 252,130 234,146" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.5" filter="url(#gf3)"/>
          <polygon points="${c},16 ${c+72},54 ${c+72},148 ${c},186 ${c-72},148 ${c-72},54"
            fill="#0c0618" stroke="#a855f7" stroke-width="1.5" filter="url(#gf3)"/>
          <polygon points="${c},50 ${c+46},72 ${c+46},128 ${c},150 ${c-46},128 ${c-46},72"
            fill="none" stroke="#a855f7" stroke-width="1" opacity="0.25"/>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 ${c} ${c}" to="360 ${c} ${c}" dur="20s" repeatCount="indefinite"/>
            <circle cx="${c}" cy="${c}" r="36" fill="none" stroke="#a855f7" stroke-width="1" opacity="0.4" stroke-dasharray="8 12"/>
          </g>
          <circle cx="${c}" cy="${c}" r="14" fill="#a855f7" opacity="0.15"/>
          <circle cx="${c}" cy="${c}" r="14" fill="none" stroke="#a855f7" stroke-width="1.5" filter="url(#gf3)"/>
          <text x="${c}" y="${c+8}" text-anchor="middle" font-family="'SF Mono','Fira Code',monospace" font-size="22" font-weight="700" fill="#e0aaff" filter="url(#gf3)">4</text>
        </svg>`;

      // Level 5 — hex + data orbits + glowing core + pips, orange/gold
      case 4: return `
        <svg viewBox="${vb}" width="${sz}" height="${sz}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gf4" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feFlood flood-color="#ff8800" flood-opacity="0.6"/>
              <feComposite in2="b" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <polyline points="36,48 14,68 14,132 36,152" fill="none" stroke="#ff8800" stroke-width="2" opacity="0.4" filter="url(#gf4)"/>
          <polyline points="244,48 266,68 266,132 244,152" fill="none" stroke="#ff8800" stroke-width="2" opacity="0.4" filter="url(#gf4)"/>
          <line x1="14" y1="100" x2="0" y2="100" stroke="#ff8800" stroke-width="2" opacity="0.3"/>
          <line x1="266" y1="100" x2="280" y2="100" stroke="#ff8800" stroke-width="2" opacity="0.3"/>
          <polygon points="${c},12 ${c+76},52 ${c+76},148 ${c},188 ${c-76},148 ${c-76},52"
            fill="#0f0800" stroke="#ff8800" stroke-width="1.5" filter="url(#gf4)"/>
          <polygon points="${c},44 ${c+50},68 ${c+50},132 ${c},156 ${c-50},132 ${c-50},68"
            fill="none" stroke="#ff8800" stroke-width="1" opacity="0.2"/>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 ${c} ${c}" to="-360 ${c} ${c}" dur="16s" repeatCount="indefinite"/>
            <circle cx="${c}" cy="${c}" r="42" fill="none" stroke="#ff8800" stroke-width="0.75" opacity="0.35" stroke-dasharray="4 8"/>
            <circle cx="${c+42}" cy="${c}" r="3" fill="#ff8800" opacity="0.8"/>
            <circle cx="${c-42}" cy="${c}" r="3" fill="#ff8800" opacity="0.8"/>
          </g>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 ${c} ${c}" to="360 ${c} ${c}" dur="10s" repeatCount="indefinite"/>
            <circle cx="${c}" cy="${c}" r="28" fill="none" stroke="#ffa500" stroke-width="0.75" opacity="0.3" stroke-dasharray="6 10"/>
            <circle cx="${c}" cy="${c-28}" r="2.5" fill="#ffa500" opacity="0.9"/>
          </g>
          <circle cx="${c}" cy="${c}" r="12" fill="#ff8800" opacity="0.2"/>
          <circle cx="${c}" cy="${c}" r="12" fill="none" stroke="#ff8800" stroke-width="2" filter="url(#gf4)"/>
          <text x="${c}" y="${c+7}" text-anchor="middle" font-family="'SF Mono','Fira Code',monospace" font-size="20" font-weight="700" fill="#ffffff" filter="url(#gf4)">5</text>
        </svg>`;

      // Level 6 — hex + sunburst rays + golden star + pulsing ring, gold
      case 5: return `
        <svg viewBox="${vb}" width="${sz}" height="${sz}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gf5" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="b"/>
              <feFlood flood-color="#ffd700" flood-opacity="0.6"/>
              <feComposite in2="b" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <line x1="${c}" y1="0"   x2="${c}" y2="30"  stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" filter="url(#gf5)"/>
          <line x1="${c}" y1="170" x2="${c}" y2="200"  stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" filter="url(#gf5)"/>
          <line x1="270" y1="${c}" x2="240" y2="${c}"  stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" filter="url(#gf5)"/>
          <line x1="10"  y1="${c}" x2="40"  y2="${c}"  stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" filter="url(#gf5)"/>
          <line x1="232" y1="38"  x2="212" y2="58"  stroke="#ffd700" stroke-width="1.5" opacity="0.5"/>
          <line x1="232" y1="162" x2="212" y2="142" stroke="#ffd700" stroke-width="1.5" opacity="0.5"/>
          <line x1="48"  y1="162" x2="68"  y2="142" stroke="#ffd700" stroke-width="1.5" opacity="0.5"/>
          <line x1="48"  y1="38"  x2="68"  y2="58"  stroke="#ffd700" stroke-width="1.5" opacity="0.5"/>
          <polygon points="${c},12 ${c+76},52 ${c+76},148 ${c},188 ${c-76},148 ${c-76},52"
            fill="#100a00" stroke="#ffd700" stroke-width="2" filter="url(#gf5)"/>
          <polygon points="${c},44 ${c+50},68 ${c+50},132 ${c},156 ${c-50},132 ${c-50},68"
            fill="none" stroke="#ffd700" stroke-width="1" opacity="0.25"/>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 ${c} ${c}" to="360 ${c} ${c}" dur="30s" repeatCount="indefinite"/>
            <circle cx="${c}" cy="${c}" r="50" fill="none" stroke="#ffd700" stroke-width="0.75" opacity="0.3" stroke-dasharray="3 9"/>
          </g>
          <polygon points="${c},98 ${c+4},${c-4} ${c+18},${c-4} ${c+7},${c+4} ${c+11},${c+18} ${c},${c+10} ${c-11},${c+18} ${c-7},${c+4} ${c-18},${c-4} ${c-4},${c-4}"
            fill="#ffd700" opacity="0.85" filter="url(#gf5)"/>
          <circle cx="${c}" cy="${c}" r="46" fill="none" stroke="#ffd700" stroke-width="1.5" opacity="0">
            <animate attributeName="opacity" values="0;0.4;0" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="46;56;46" dur="2.5s" repeatCount="indefinite"/>
          </circle>
        </svg>`;

      // MAX LEVEL — all complete — full sci-fi terminal: hex + skull-circuit + rotating spike ring + pulsing aura, electric cyan
      case 6: return `
        <svg viewBox="${vb}" width="${sz}" height="${sz}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gf6" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="8" result="b"/>
              <feFlood flood-color="#00d4ff" flood-opacity="0.7"/>
              <feComposite in2="b" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="gf6w" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feFlood flood-color="#ffffff" flood-opacity="1"/>
              <feComposite in2="b" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <g filter="url(#gf6)">
            <animateTransform attributeName="transform" type="rotate" from="0 ${c} ${c}" to="360 ${c} ${c}" dur="14s" repeatCount="indefinite"/>
            <polygon points="${c},4 ${c+6},22 ${c-6},22"     fill="#00d4ff" opacity="0.9"/>
            <polygon points="${c+60},18 ${c+64},36 ${c+52},32"  fill="#00d4ff" opacity="0.6"/>
            <polygon points="${c+76},${c} ${c+62},${c+6} ${c+62},${c-6}" fill="#00d4ff" opacity="0.8"/>
            <polygon points="${c+60},182 ${c+52},168 ${c+64},164" fill="#00d4ff" opacity="0.6"/>
            <polygon points="${c},196 ${c-6},178 ${c+6},178"     fill="#00d4ff" opacity="0.9"/>
            <polygon points="${c-60},182 ${c-64},164 ${c-52},168" fill="#00d4ff" opacity="0.6"/>
            <polygon points="${c-76},${c} ${c-62},${c-6} ${c-62},${c+6}" fill="#00d4ff" opacity="0.8"/>
            <polygon points="${c-60},18 ${c-52},32 ${c-64},36"  fill="#00d4ff" opacity="0.6"/>
          </g>
          <polygon points="${c},12 ${c+76},52 ${c+76},148 ${c},188 ${c-76},148 ${c-76},52"
            fill="#020810" stroke="#00d4ff" stroke-width="2" filter="url(#gf6)"/>
          <polygon points="${c},40 ${c+52},66 ${c+52},134 ${c},160 ${c-52},134 ${c-52},66"
            fill="none" stroke="#00d4ff" stroke-width="0.75" opacity="0.2"/>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 ${c} ${c}" to="-360 ${c} ${c}" dur="20s" repeatCount="indefinite"/>
            <circle cx="${c}" cy="${c}" r="56" fill="none" stroke="#00d4ff" stroke-width="0.75" opacity="0.25" stroke-dasharray="5 10"/>
          </g>
          <ellipse cx="${c-22}" cy="${c-12}" rx="16" ry="14" fill="#020810"/>
          <ellipse cx="${c-22}" cy="${c-12}" rx="16" ry="14" fill="none" stroke="#00d4ff" stroke-width="1.5" filter="url(#gf6)"/>
          <ellipse cx="${c-22}" cy="${c-12}" rx="6" ry="6" fill="#00d4ff" opacity="0.5" filter="url(#gf6w)"/>
          <circle cx="${c-22}" cy="${c-12}" r="3" fill="#fff" filter="url(#gf6w)"/>
          <ellipse cx="${c+22}" cy="${c-12}" rx="16" ry="14" fill="#020810"/>
          <ellipse cx="${c+22}" cy="${c-12}" rx="16" ry="14" fill="none" stroke="#00d4ff" stroke-width="1.5" filter="url(#gf6)"/>
          <ellipse cx="${c+22}" cy="${c-12}" rx="6" ry="6" fill="#00d4ff" opacity="0.5" filter="url(#gf6w)"/>
          <circle cx="${c+22}" cy="${c-12}" r="3" fill="#fff" filter="url(#gf6w)"/>
          <polygon points="${c},${c+6} ${c-6},${c+20} ${c+6},${c+20}" fill="#020810" stroke="#00d4ff" stroke-width="1" opacity="0.7"/>
          <line x1="${c-30}" y1="${c+32}" x2="${c+30}" y2="${c+32}" stroke="#00d4ff" stroke-width="1" opacity="0.3"/>
          <line x1="${c-20}" y1="${c+32}" x2="${c-20}" y2="${c+42}" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" opacity="0.7" filter="url(#gf6)"/>
          <line x1="${c-10}" y1="${c+32}" x2="${c-10}" y2="${c+46}" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" opacity="0.85" filter="url(#gf6)"/>
          <line x1="${c}" y1="${c+32}" x2="${c}" y2="${c+48}" stroke="#00d4ff" stroke-width="3" stroke-linecap="round" filter="url(#gf6)"/>
          <line x1="${c+10}" y1="${c+32}" x2="${c+10}" y2="${c+46}" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" opacity="0.85" filter="url(#gf6)"/>
          <line x1="${c+20}" y1="${c+32}" x2="${c+20}" y2="${c+42}" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" opacity="0.7" filter="url(#gf6)"/>
          <circle cx="${c}" cy="${c}" r="68" fill="none" stroke="#00d4ff" stroke-width="1.5" opacity="0">
            <animate attributeName="opacity" values="0;0.3;0" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="r" values="68;80;68" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>`;

      default: return '';
    }
  }

  function renderRankBadge() {
    const container = document.getElementById('rankBadge');
    if (!container) return;
    const completed = progress.totalCompleted || 0;
    const rankIdx = getCurrentRankIndex(completed);
    const label = rankIdx === 6 ? 'MAX LEVEL' : `Level ${rankIdx}`;
    container.innerHTML = `
      <div class="rank-svg">${buildBadgeSvg(rankIdx)}</div>
      <div class="rank-name" style="color:${RANK_COLORS[rankIdx]}">${label}</div>
    `;
  }

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
    const skillLevel = skill.level ?? 1;
    if (skillLevel === 1) return 'available';
    const prevLevelSkills = skills.filter(s => s.level === skillLevel - 1);
    const prevLevelDone = prevLevelSkills.every(s => progress.skills[s.id]?.completed);
    return prevLevelDone ? 'available' : 'locked';
  }

  // Group skills array by level field
  function groupByLevel(skillsArr) {
    const map = {};
    skillsArr.forEach(skill => {
      const lvl = skill.level ?? 1;
      if (!map[lvl]) map[lvl] = [];
      map[lvl].push(skill);
    });
    return map;
  }

  // Get recommended next skill — first incomplete in the lowest available level
  function getRecommendedNext() {
    const available = skills.filter(s => getNodeState(s) === 'available');
    if (available.length === 0) return null;
    // Pick from the lowest level that has available skills
    const lowestLevel = Math.min(...available.map(s => s.level || 1));
    const candidates = available.filter(s => (s.level || 1) === lowestLevel);
    return candidates[0].id;
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
      path.setAttribute('stroke', state === 'completed' ? skill.color : state === 'locked' ? '#333' : '#00d4ff');
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
    branch.style.color = state === 'locked' ? '#333' : skill.color;
    card.appendChild(branch);

    // Lock icon for locked
    if (state === 'locked') {
      const lock = document.createElement('div');
      lock.className = 'card-lock';
      lock.textContent = '🔒';
      card.appendChild(lock);
    }

    // Checkmark for completed
    if (state === 'completed') {
      const check = document.createElement('div');
      check.className = 'card-check';
      check.textContent = '✓';
      check.style.color = skill.color;
      card.appendChild(check);
    }

    // Click handler (all states — locked shows locked detail)
    card.addEventListener('click', () => openDetail(skill));

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
    renderRankBadge();
    const container = document.getElementById('levelsContainer');
    container.innerHTML = '';

    const recommendedId = getRecommendedNext();
    const byLevel = groupByLevel(skills);
    const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

    levels.forEach((lvl, idx) => {
      // Connecting line between levels (except before the first)
      if (idx > 0) {
        const connector = document.createElement('div');
        connector.className = 'level-connector';
        container.appendChild(connector);
      }

      const row = document.createElement('div');
      row.className = 'level-row';

      // Determine if this level is the current active one
      const levelStates = byLevel[lvl].map(s => getNodeState(s));
      const hasAvailable = levelStates.includes('available');
      const allCompleted = levelStates.every(st => st === 'completed');
      const isCurrent = hasAvailable && !allCompleted;

      const label = document.createElement('div');
      label.className = 'level-label' + (isCurrent ? ' level-label-active' : '') + (allCompleted ? ' level-label-done' : '');
      const subtitle = LEVEL_SUBTITLES[lvl] ? `<span class="level-subtitle">${LEVEL_SUBTITLES[lvl]}</span>` : '';
      label.innerHTML = `<span class="level-dot${isCurrent ? ' level-dot-active' : ''}${allCompleted ? ' level-dot-done' : ''}"></span>Level ${lvl}${subtitle}`;
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

  // Open detail panel — positioned to the right of the clicked card
  function openDetail(skill) {
    // Remove previous selected state
    document.querySelectorAll('.skill-card.selected').forEach(c => c.classList.remove('selected'));

    selectedSkill = skill;
    updateDetailPanel(skill);

    const panel = document.getElementById('detailPanel');
    const card = document.querySelector(`[data-skill-id="${skill.id}"]`);
    if (card) card.classList.add('selected');
    const panelWidth = 320;
    const gap = 12;

    if (card) {
      const rect = card.getBoundingClientRect();
      let left = rect.right + gap;
      let top = rect.top;

      // Flip to left if overflowing right edge
      if (left + panelWidth > window.innerWidth - 16) {
        left = rect.left - panelWidth - gap;
      }
      // Clamp left to stay on screen
      left = Math.max(16, left);
      // Clamp top so panel doesn't overflow bottom
      const panelHeight = 420;
      top = Math.min(top, window.innerHeight - panelHeight - 16);
      top = Math.max(16, top);

      panel.style.top = top + 'px';
      panel.style.left = left + 'px';
    }

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

    diffEl.style.display = 'none';

    tryItEl.textContent = skill.tryIt || '';

    statusEl.className = `detail-status ${state}`;
    if (state === 'completed') {
      const method = progress.skills[skill.id]?.detected_by;
      statusEl.textContent = `Completed${method === 'hook' ? ' (auto-detected)' : ''}`;
    } else if (state === 'available') {
      statusEl.textContent = 'Available';
    } else {
      statusEl.textContent = `Locked — complete Level ${(skill.level ?? 1) - 1} first`;
    }

    toggleEl.textContent = state === 'completed' ? 'Unmark' : 'Mark Complete';
    toggleEl.onclick = () => toggleSkill(skill.id);
  }

  document.getElementById('detailClose').addEventListener('click', () => {
    document.getElementById('detailPanel').classList.remove('open');
    document.querySelectorAll('.skill-card.selected').forEach(c => c.classList.remove('selected'));
    selectedSkill = null;
  });

  document.addEventListener('click', (e) => {
    const panel = document.getElementById('detailPanel');
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target)) return;
    if (e.target.closest('.skill-card')) return;
    panel.classList.remove('open');
    document.querySelectorAll('.skill-card.selected').forEach(c => c.classList.remove('selected'));
    selectedSkill = null;
  });


  async function toggleSkill(skillId) {
    const res = await fetch(`/api/toggle/${skillId}`, { method: 'POST' });
    progress = await res.json();
    document.getElementById('detailPanel').classList.remove('open');
    document.querySelectorAll('.skill-card.selected').forEach(c => c.classList.remove('selected'));
    selectedSkill = null;
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
          if (skill) showToast(skill.name);
        });
      } catch (e) {
        // server might be down, ignore
      }
    }, 2000);
  }

  document.getElementById('resetBtn').addEventListener('click', async () => {
    if (!confirm('Reset all progress? This can\'t be undone.')) return;
    const res = await fetch('/api/reset', { method: 'POST' });
    progress = await res.json();
    previousCompleted = new Set();
    render();
  });

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

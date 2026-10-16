/**
 * THE COMPANY ARCHIVES // MASTER MULTI-JOURNAL CONTROLLER
 * Orchestrates 3D scene, Multi-Journal Navigation, Lore views, Character Dossier Modals,
 * Coffee dialogue player, Boss encounters, and procedural audio effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Cosmic Scene
  let cosmicScene = null;
  if (typeof CosmicScene !== 'undefined') {
    cosmicScene = new CosmicScene('canvas-container');
    window.cosmicScene = cosmicScene;
  }

  // 2. Setup Live Cosmic Clock
  setupCosmicClock();

  // 3. Setup Audio Control Toggle
  setupAudioControl();

  // 4. Setup 3D Scene HUD Dock Buttons
  setupSceneHUD();

  // 5. Setup Master Journal Switcher Tabs
  setupMasterJournalSwitcher();

  // 6. Render Journal 01: Fondasi Sejarah Semesta (Untouched & Pristine)
  renderTimelineAndChapters();
  renderFactions();
  renderHierarchy();
  renderCharacters();

  // 7. Render Journal 02: Jurnal Lanjutan Semesta (Charlie, Arkan, TurCerturis-17, 3 Labs)
  renderJournal02();

  // 8. Render Journal 03: Solo Vs Squad (5 Potential Gods, Kristen White, 2 Pedang & 2 Cincin)
  renderJournal03();

  // 9. Render Journal 04: Arsip Institusi The Company (4 Militer Lama, TCDF War, 5 Institusi)
  renderJournal04();

  // 10. Setup Global Click SFX
  setupGlobalSFX();
});

// ==================== LIVE COSMIC CLOCK ====================
function setupCosmicClock() {
  const clockEl = document.getElementById('cosmic-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const iso = now.toISOString().replace('T', ' // ').substring(0, 22) + ' UTC';
    clockEl.textContent = `TIMELINE: STANDARD CONGLOMERATE // ${iso}`;
  }
  update();
  setInterval(update, 1000);
}

// ==================== PROCEDURAL AUDIO CONTROL ====================
function setupAudioControl() {
  const audioBtn = document.getElementById('btn-toggle-sound');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (window.soundEngine) {
      const active = window.soundEngine.toggleSound();
      if (active) {
        audioBtn.classList.add('sound-active');
        audioBtn.innerHTML = `<span>🔊</span> <span>AUDIO: ON (AMBIENT ACTIVE)</span>`;
      } else {
        audioBtn.classList.remove('sound-active');
        audioBtn.innerHTML = `<span>🔈</span> <span>AUDIO: OFF</span>`;
      }
    }
  });
}

// ==================== 3D SCENE HUD DOCK ====================
function setupSceneHUD() {
  const hudButtons = document.querySelectorAll('.hud-btn[data-mode]');
  hudButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      if (window.cosmicScene) {
        window.cosmicScene.setMode(mode);
      }
      hudButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cataclysmBtn = document.getElementById('btn-trigger-cataclysm');
      const resetPlanetBtn = document.getElementById('btn-reset-planet');
      if (mode === 'planet') {
        if (cataclysmBtn) cataclysmBtn.style.display = 'inline-flex';
        if (resetPlanetBtn) resetPlanetBtn.style.display = 'inline-flex';
      } else {
        if (cataclysmBtn) cataclysmBtn.style.display = 'none';
        if (resetPlanetBtn) resetPlanetBtn.style.display = 'none';
      }
    });
  });

  const cataclysmBtn = document.getElementById('btn-trigger-cataclysm');
  if (cataclysmBtn) {
    cataclysmBtn.addEventListener('click', () => {
      if (window.cosmicScene) {
        window.cosmicScene.triggerPlanetaryCataclysm();
      }
    });
  }

  const resetPlanetBtn = document.getElementById('btn-reset-planet');
  if (resetPlanetBtn) {
    resetPlanetBtn.addEventListener('click', () => {
      if (window.cosmicScene) {
        window.cosmicScene.resetPlanet();
      }
    });
  }
}

// ==================== MASTER JOURNAL SWITCHER ====================
function setupMasterJournalSwitcher() {
  const tabs = document.querySelectorAll('.journal-tab-btn');
  const views = document.querySelectorAll('.journal-view');

  const journal3DMap = {
    'journal-01': 'galaxy',
    'journal-02': 'labs',
    'journal-03': 'solo',
    'journal-04': 'institutions'
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target-journal');
      tabs.forEach(t => t.classList.remove('active'));
      views.forEach(v => v.classList.remove('active-view'));

      tab.classList.add('active');
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active-view');

      // Sync 3D Scene Mode
      const sceneMode = journal3DMap[targetId] || 'galaxy';
      if (window.cosmicScene) {
        window.cosmicScene.setMode(sceneMode);
        document.querySelectorAll('.hud-btn[data-mode]').forEach(b => {
          if (b.getAttribute('data-mode') === sceneMode) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.soundEngine) window.soundEngine.playWarp();
    });
  });
}

// ==================== JURNAL 01: CHAPTERS & READING MODE ====================
let currentReadingMode = 'enhanced'; // 'enhanced' or 'original'

function renderTimelineAndChapters() {
  const stepperContainer = document.getElementById('timeline-stepper');
  const chaptersContainer = document.getElementById('chapters-container');
  if (!stepperContainer || !chaptersContainer) return;

  stepperContainer.innerHTML = '';
  const era3DModes = {
    'part-01': 'galaxy',
    'part-02': 'planet',
    'part-03': 'trinity',
    'part-04': 'mothers'
  };

  LORE_DATA.eras.forEach((era, idx) => {
    const tab = document.createElement('button');
    tab.className = `step-tab ${idx === 0 ? 'active' : ''}`;
    tab.innerHTML = `
      <span class="step-num">${era.sectionNumber}</span>
      <span class="step-name">${era.sectionTitle}</span>
    `;
    tab.addEventListener('click', () => {
      document.querySelectorAll('.step-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterEraChapters(era.id);

      const targetMode = era3DModes[era.id] || 'galaxy';
      if (window.cosmicScene) {
        window.cosmicScene.setMode(targetMode);
        document.querySelectorAll('.hud-btn[data-mode]').forEach(b => {
          if (b.getAttribute('data-mode') === targetMode) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
        const cataclysmBtn = document.getElementById('btn-trigger-cataclysm');
        const resetPlanetBtn = document.getElementById('btn-reset-planet');
        if (targetMode === 'planet') {
          if (cataclysmBtn) cataclysmBtn.style.display = 'inline-flex';
          if (resetPlanetBtn) resetPlanetBtn.style.display = 'inline-flex';
        } else {
          if (cataclysmBtn) cataclysmBtn.style.display = 'none';
          if (resetPlanetBtn) resetPlanetBtn.style.display = 'none';
        }
      }

      if (window.soundEngine) window.soundEngine.playClick();
    });
    stepperContainer.appendChild(tab);
  });

  renderChaptersForEra(LORE_DATA.eras[0].id);
  setupReadingModeGlobal();
}

function filterEraChapters(eraId) {
  renderChaptersForEra(eraId);
}

function renderChaptersForEra(eraId) {
  const chaptersContainer = document.getElementById('chapters-container');
  if (!chaptersContainer) return;

  const targetEra = LORE_DATA.eras.find(e => e.id === eraId) || LORE_DATA.eras[0];
  chaptersContainer.innerHTML = '';

  targetEra.chapters.forEach(chap => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.id = `chap-${chap.num}`;

    card.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-meta">
          <div class="chapter-num">${chap.num}</div>
          <div class="chapter-title-group">
            <h3>${chap.title}</h3>
            <div class="chapter-tagline">${chap.tagline}</div>
          </div>
        </div>
        <div class="reading-mode-toggle" data-chap="${chap.num}">
          <button class="toggle-option ${currentReadingMode === 'enhanced' ? 'active' : ''}" data-mode="enhanced">
            Arsip Rekonstruksi
          </button>
          <button class="toggle-option ${currentReadingMode === 'original' ? 'active' : ''}" data-mode="original">
            Naskah Sumber
          </button>
        </div>
      </div>
      <div class="chapter-body">
        <div class="mode-enhanced-content" style="${currentReadingMode === 'enhanced' ? '' : 'display:none;'}">
          ${chap.enhancedContent}
        </div>
        <div class="mode-original-content" style="${currentReadingMode === 'original' ? '' : 'display:none;'}">
          <div class="original-lore-box">
            <span class="src-badge">TRANSLITERASI NASKAH SUMBER PRIMER (JURNAL RESMI):</span>
            <p>${chap.originalSnippet.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      </div>
    `;

    const toggleBtns = card.querySelectorAll('.toggle-option');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const enhDiv = card.querySelector('.mode-enhanced-content');
        const origDiv = card.querySelector('.mode-original-content');
        if (mode === 'enhanced') {
          enhDiv.style.display = 'block';
          origDiv.style.display = 'none';
        } else {
          enhDiv.style.display = 'none';
          origDiv.style.display = 'block';
        }

        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    chaptersContainer.appendChild(card);
  });
}

function setupReadingModeGlobal() {
  const globalModeBtns = document.querySelectorAll('[data-global-reading-mode]');
  globalModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-global-reading-mode');
      currentReadingMode = mode;
      globalModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.chapter-card').forEach(card => {
        const enhDiv = card.querySelector('.mode-enhanced-content');
        const origDiv = card.querySelector('.mode-original-content');
        const options = card.querySelectorAll('.toggle-option');
        if (enhDiv && origDiv) {
          if (mode === 'enhanced') {
            enhDiv.style.display = 'block';
            origDiv.style.display = 'none';
          } else {
            enhDiv.style.display = 'none';
            origDiv.style.display = 'block';
          }
        }
        options.forEach(opt => {
          if (opt.getAttribute('data-mode') === mode) {
            opt.classList.add('active');
          } else {
            opt.classList.remove('active');
          }
        });
      });

      if (window.soundEngine) window.soundEngine.playBeep(700, 0.08, 'sine');
    });
  });
}

// ==================== JURNAL 01: FACTIONS MATRIX ====================
function renderFactions() {
  const factionsGrid = document.getElementById('factions-grid');
  if (!factionsGrid) return;

  factionsGrid.innerHTML = '';
  const entries = Object.entries(LORE_DATA.factionsMatrix);

  entries.forEach(([key, f]) => {
    const card = document.createElement('div');
    card.className = `faction-big-card ${key}`;
    card.innerHTML = `
      <div class="f-badge-group">
        <span class="f-symbol">${f.symbol}</span>
        <span class="f-tag">${f.motto}</span>
      </div>
      <h3 class="f-name">${f.name}</h3>
      <div class="f-motto">DOKTRIN: ${f.doktrin}</div>
      <div class="f-detail-row">
        <strong>Pola Taktik & Karakter Tempur</strong>
        <p>${f.taktik}</p>
      </div>
      <div class="f-detail-row">
        <strong>Pemimpin Era Transisi</strong>
        <p>${f.pemimpin}</p>
      </div>
      <div class="f-detail-row">
        <strong>Kontribusi Pada Unifikasi The Company</strong>
        <p>${f.peranUnifikasi}</p>
      </div>
    `;
    factionsGrid.appendChild(card);
  });
}

// ==================== JURNAL 01: HIERARCHY TREE ====================
function renderHierarchy() {
  const container = document.getElementById('hierarchy-container');
  if (!container) return;

  container.innerHTML = '';
  LORE_DATA.hierarchy.forEach(h => {
    const row = document.createElement('div');
    row.className = `hierarchy-row ${h.rank === 1 ? 'rank-1' : ''}`;
    row.innerHTML = `
      <div class="h-rank">#${h.rank}</div>
      <div class="h-title-group">
        <div class="h-title">${h.title}</div>
        <div class="h-level">${h.level}</div>
      </div>
      <div class="h-holder">
        <span style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff;">
          ${h.holder}
        </span>
      </div>
      <div class="h-desc">${h.desc}</div>
    `;
    container.appendChild(row);
  });
}

// ==================== JURNAL 01: CHARACTER DOSSIERS ====================
function renderCharacters() {
  const grid = document.getElementById('characters-grid');
  if (!grid) return;

  grid.innerHTML = '';
  LORE_DATA.characters.forEach(char => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.innerHTML = `
      <div class="char-img-wrap">
        <img src="${char.image}" alt="${char.name}" loading="lazy" />
        <span class="char-code">${char.code}</span>
        <div class="char-img-overlay">
          <div class="char-status-badge">⚡ ${char.status}</div>
        </div>
      </div>
      <div class="char-content">
        <div class="char-name">${char.name}</div>
        <div class="char-title">${char.title}</div>
        <div class="char-quote">"${char.quote}"</div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
          📍 <strong>Asal:</strong> ${char.origin}<br>
          ⚔️ <strong>Kekuatan:</strong> ${char.powerTier}
        </div>
        <button class="btn-open-dossier" data-char-id="${char.id}">
          BUKA ARSIP DOSSIER LENGKAP &rarr;
        </button>
      </div>
    `;

    card.addEventListener('click', () => {
      openCharacterModal(char);
      if (window.soundEngine) window.soundEngine.playBeep(920, 0.1, 'triangle');
    });

    grid.appendChild(card);
  });

  setupModalCloseHandlers();
}

function openCharacterModal(char) {
  const modal = document.getElementById('char-modal');
  if (!modal) return;

  document.getElementById('modal-char-img').src = char.image;
  document.getElementById('modal-char-img').alt = char.name;
  document.getElementById('modal-char-code').textContent = `${char.code} // CLASSIFIED PERSONNEL DOSSIER`;
  document.getElementById('modal-char-name').textContent = char.name;
  document.getElementById('modal-char-title').textContent = char.title;
  document.getElementById('modal-char-status').textContent = `STATUS: ${char.status} | TIER: ${char.powerTier}`;

  document.getElementById('modal-char-bio').textContent = char.bio;
  document.getElementById('modal-char-history').textContent = char.history;
  document.getElementById('modal-char-notes').textContent = char.loreNotes;
  document.getElementById('modal-char-quote').textContent = `"${char.quote}"`;

  const statsContainer = document.getElementById('modal-char-stats');
  if (statsContainer && char.stats) {
    statsContainer.innerHTML = '';
    const statLabels = {
      intelek: "Kapasitas Intelektual",
      kebijaksanaan: "Kebijaksanaan Kosmik",
      dayaHancur: "Potensi Daya Hancur",
      pengaruh: "Pengaruh Galaktik"
    };

    Object.entries(statLabels).forEach(([key, label]) => {
      const val = char.stats[key];
      const percent = typeof val === 'number' ? val : 100;
      const row = document.createElement('div');
      row.className = 'stat-bar-item';
      row.innerHTML = `
        <span style="min-width: 140px;">${label}</span>
        <div class="stat-track">
          <div class="stat-fill" style="width: ${percent}%;"></div>
        </div>
        <span style="font-weight: 700; color: var(--neon-cyan);">${val}</span>
      `;
      statsContainer.appendChild(row);
    });
  }

  modal.classList.add('open');
}

function setupModalCloseHandlers() {
  const modal = document.getElementById('char-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      if (window.soundEngine) window.soundEngine.playClick();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

// ==================== [NEW] RENDER JURNAL 02 ====================
function renderJournal02() {
  const container = document.getElementById('j02-sections-container');
  const tableContainer = document.getElementById('j02-comparison-container');
  if (!container || !window.MASTER_LORE || !window.MASTER_LORE.journal02) return;

  const j02 = window.MASTER_LORE.journal02;

  // Render Comparison Table
  if (tableContainer && j02.comparisonTable) {
    let html = `
      <table class="lore-table">
        <thead>
          <tr>
            <th>Tokoh Utama</th>
            <th>Planet Asal</th>
            <th>Latar Bencana & Mekanisme</th>
            <th>Isolasi</th>
            <th>Jalur di The Company</th>
            <th>Status Akhir & Pasangan</th>
          </tr>
        </thead>
        <tbody>
    `;
    j02.comparisonTable.forEach(row => {
      html += `
        <tr>
          <td><strong style="color: #fff; font-size: 1.05rem;">${row.tokoh}</strong></td>
          <td><span style="color: var(--neon-cyan); font-family: var(--font-mono);">${row.planet}</span></td>
          <td>${row.latarKehancuran}</td>
          <td><span style="color: var(--neon-gold); font-weight: 700;">${row.durasiSendiri}</span></td>
          <td>${row.jalurTheCompany}</td>
          <td>${row.statusAkhir}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    tableContainer.innerHTML = html;
  }

  // Render Sections
  container.innerHTML = '';
  j02.sections.forEach(sec => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-meta">
          <div class="chapter-num">${sec.num}</div>
          <div class="chapter-title-group">
            <h3>${sec.title}</h3>
            <div class="chapter-tagline">${sec.tagline}</div>
          </div>
        </div>
      </div>
      <div class="chapter-body">
        ${sec.content}
        <div class="original-lore-box">
          <span class="src-badge">KUTIPAN OTENTIK ARSIP PERCAKAPAN:</span>
          <p>${sec.originalSnippet.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==================== [NEW] RENDER JURNAL 03 (SOLO VS SQUAD) ====================
function renderJournal03() {
  const container = document.getElementById('j03-bosses-container');
  const loadoutContainer = document.getElementById('j03-loadout-container');
  if (!container || !window.MASTER_LORE || !window.MASTER_LORE.journal03) return;

  const j03 = window.MASTER_LORE.journal03;

  // Render Loadout
  if (loadoutContainer && j03.loadout) {
    loadoutContainer.innerHTML = `
      <div class="loadout-card">
        <div class="loadout-name">⚔️ ${j03.loadout.weapons[0].name}</div>
        <div class="loadout-type">${j03.loadout.weapons[0].type}</div>
        <p style="font-size: 0.88rem; color: #cbd5e1;">${j03.loadout.weapons[0].desc}</p>
      </div>
      <div class="loadout-card">
        <div class="loadout-name">🔫 ${j03.loadout.weapons[1].name}</div>
        <div class="loadout-type">${j03.loadout.weapons[1].type}</div>
        <p style="font-size: 0.88rem; color: #cbd5e1;">${j03.loadout.weapons[1].desc}</p>
      </div>
      <div class="loadout-card" style="border-color: var(--border-cyan);">
        <div class="loadout-name">🎯 METODE EKSEKUSI SOLO</div>
        <div class="loadout-type" style="color: var(--neon-cyan);">EFISIENSI LINTAS GALAKSI</div>
        <p style="font-size: 0.88rem; color: #cbd5e1;">${j03.loadout.methodology}</p>
      </div>
    `;
  }

  // Render 5 Boss Encounters
  container.innerHTML = '';
  j03.bossEncounters.forEach(boss => {
    let badgeClass = 'deceased';
    if (boss.result.includes('SURVIVED') || boss.result.includes('MELARIKAN')) badgeClass = 'survived';
    if (boss.result.includes('MENYERAH') || boss.result.includes('BERGABUNG')) badgeClass = 'recruited';

    const card = document.createElement('div');
    card.className = 'boss-card';
    card.innerHTML = `
      <div class="boss-header">
        <span class="boss-num">TARGET #${boss.num}</span>
        <span class="boss-result-badge ${badgeClass}">${boss.result}</span>
      </div>
      <div>
        <div class="boss-target-name">${boss.target}</div>
        <div class="boss-target-title">${boss.title}</div>
      </div>
      <div class="boss-duration">⏱️ Durasi Bentrokan: <strong>${boss.duration}</strong></div>
      <div class="boss-quote">${boss.quote}</div>
      <p style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.7;">${boss.desc}</p>
    `;
    container.appendChild(card);
  });
}

// ==================== [NEW] RENDER JURNAL 04 (ARSIP INSTITUSI) ====================
function renderJournal04() {
  const dissolvedContainer = document.getElementById('j04-dissolved-container');
  const standingContainer = document.getElementById('j04-standing-container');
  if (!dissolvedContainer || !standingContainer || !window.MASTER_LORE || !window.MASTER_LORE.journal04) return;

  const j04 = window.MASTER_LORE.journal04;

  // Render 4 Dissolved Militaries
  dissolvedContainer.innerHTML = '';
  j04.dissolvedFactions.forEach(f => {
    const card = document.createElement('div');
    card.className = 'dissolved-card';
    card.innerHTML = `
      <h4>${f.name}</h4>
      <span class="dissolved-status">${f.status}</span>
      <p style="font-size: 0.88rem; color: #e2e8f0; margin-bottom: 0.6rem;">
        <strong>Watak:</strong> ${f.karakteristik}
      </p>
      <p style="font-size: 0.85rem; color: #fca5a5; line-height: 1.6;">
        <strong>Akar Masalah:</strong> ${f.masalah}
      </p>
    `;
    dissolvedContainer.appendChild(card);
  });

  // Render 5 Standing Institutions
  standingContainer.innerHTML = '';
  j04.standingInstitutions.forEach(inst => {
    const card = document.createElement('div');
    card.className = 'standing-inst-card';
    card.innerHTML = `
      <div class="inst-icon">${inst.icon}</div>
      <span class="inst-badge">${inst.badge}</span>
      <div class="inst-name">${inst.name}</div>
      <p style="font-size: 0.92rem; color: #fff; font-weight: 600;">${inst.peran}</p>
      <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.7;">${inst.lingkup}</p>
    `;
    standingContainer.appendChild(card);
  });
}

// ==================== GLOBAL UI SFX ====================
function setupGlobalSFX() {
  document.querySelectorAll('a, button, .stat-card, .faction-big-card, .boss-card, .standing-inst-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.soundEngine && !window.soundEngine.isMuted) {
        window.soundEngine.playBeep(1400, 0.02, 'sine');
      }
    });
  });
}

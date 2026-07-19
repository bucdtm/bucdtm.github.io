let currentLang = localStorage.getItem('lang') || 'en';
let updateClockTime = null;

const TRANSLATIONS = {
  en: {
    greeting: "Welcome to my portfolio",
    skills_title: "Personal Skills",
    skill_uiux: "UI/UX Design",
    skill_interaction: "Interaction",
    skill_automation: "Automation",
    tab_experience: "Experience",
    tab_awards: "Awards",
    timeline_practicas_title: "Internship",
    timeline_practicas_date: "May 2026 - June 2026",
    timeline_practicas_desc: "Infrastructure optimization, Database refactoring, and Critical bug resolution.",
    timeline_english_title: "Honorary Mention in English",
    timeline_math_title: "Math Olympiad Finalist",
    map_title: "Current Location",
    map_subtitle: "Valencia, Spain",
    map_tooltip: "Valencia, Spain",
    dl_title: "Documents & Downloads",
    dl_subtitle: "Access my professional resources and files",
    dl_count_label: "Files",
    dl_pdf_info: "43 KB • PDF (Spanish)",
    dl_pdf_info_en: "40 KB • PDF (English)",
    dl_btn_label: "Download file",
    toast_downloading: "Downloading {fileName} ({fileSize})...",
    toast_download_success: "✅ {fileName} downloaded successfully",
    toast_light_mode: "Light Mode activated ☀️",
    toast_dark_mode: "Dark Mode activated 🌙"
  },
  es: {
    greeting: "Bienvenido a mi portfolio",
    skills_title: "Habilidades Personales",
    skill_uiux: "Diseño UI/UX",
    skill_interaction: "Interacción",
    skill_automation: "Automatización",
    tab_experience: "Experiencia",
    tab_awards: "Premios",
    timeline_practicas_title: "Prácticas",
    timeline_practicas_date: "Mayo 2026 - Junio 2026",
    timeline_practicas_desc: "Optimización de la infraestructura, Refactorización de Bases de Datos y Resolución de Bugs Críticos.",
    timeline_english_title: "Mención Honorífica en Inglés",
    timeline_math_title: "Finalista Olimpiada Matemática",
    map_title: "Ubicación Actual",
    map_subtitle: "Valencia, España",
    map_tooltip: "Valencia, España",
    dl_title: "Documentos & Descargas",
    dl_subtitle: "Accede a mis recursos y archivos profesionales",
    dl_count_label: "Archivos",
    dl_pdf_info: "43 KB • PDF (Español)",
    dl_pdf_info_en: "40 KB • PDF (Inglés)",
    dl_btn_label: "Descargar archivo",
    toast_downloading: "Descargando {fileName} ({fileSize})...",
    toast_download_success: "✅ {fileName} descargado con éxito",
    toast_light_mode: "Modo Claro activado ☀️",
    toast_dark_mode: "Modo Oscuro activado 🌙"
  }
};

function initLanguage() {
  const langBtns = document.querySelectorAll('.lang-btn');

  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update active button state
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        el.textContent = TRANSLATIONS[lang][key];
      }
    });

    // Translate element attributes
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const attrMapping = el.getAttribute('data-i18n-attr');
      const [attrName, key] = attrMapping.split(':');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        el.setAttribute(attrName, TRANSLATIONS[lang][key]);
      }
    });

    // Re-render location tooltip content if visible
    const tooltip = document.getElementById('map-tooltip');
    if (tooltip) {
      tooltip.textContent = TRANSLATIONS[lang]['map_tooltip'];
    }
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      updateLanguage(lang);
      
      // Update clock immediately
      if (typeof updateClockTime === 'function') {
        updateClockTime();
      }
    });
  });

  // Run initial translation
  updateLanguage(currentLang);
}

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initClock();
  initThemeToggle();
  initExperienceTabs();
  initSkillBubbles();
  initDottedMap();
  initDownloads();
  initCodeTypewriter();
});

// -------------------------------------------------------------
// 1. Live Date & Time Clock
// -------------------------------------------------------------
function initClock() {
  const clockEl = document.getElementById('live-time');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

    const locale = currentLang === 'es' ? 'es-ES' : 'en-US';
    const formattedDate = now.toLocaleDateString(locale, dateOptions).replace('.', '');
    const formattedTime = now.toLocaleTimeString(locale, timeOptions);

    clockEl.textContent = `${formattedDate} • ${formattedTime}`;
  }

  updateClockTime = updateTime;
  updateTime();
  setInterval(updateTime, 1000);
}

// -------------------------------------------------------------
// 2. Dark/Light Theme Toggle
// -------------------------------------------------------------
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const toggleLabel = document.querySelector('.toggle-label');
  if (!toggleBtn) return;

  // Local storage cache for theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    if (toggleLabel) toggleLabel.textContent = 'Light';
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    if (toggleLabel) toggleLabel.textContent = 'Dark';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');

    if (isLight) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      if (toggleLabel) toggleLabel.textContent = 'Light';
      showToast(TRANSLATIONS[currentLang]['toast_light_mode']);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      if (toggleLabel) toggleLabel.textContent = 'Dark';
      showToast(TRANSLATIONS[currentLang]['toast_dark_mode']);
    }
  });
}

// -------------------------------------------------------------
// 3. Work Experiences Tab Panel Switcher
// -------------------------------------------------------------
function initExperienceTabs() {
  const tabs = document.querySelectorAll('.pill-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      // Deactivate all panels
      panels.forEach(p => {
        p.classList.remove('active');
      });

      // Activate clicked tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Activate corresponding panel
      const targetPanelId = `tab-${tab.getAttribute('data-tab')}`;
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// -------------------------------------------------------------
// 4. Interactive Skill Tags Bubble Physics
// -------------------------------------------------------------
function initSkillBubbles() {
  const container = document.getElementById('skill-bubble-container');
  const canvas = document.getElementById('skill-canvas');
  const tagsWrapper = document.getElementById('skill-tags');
  if (!container || !canvas || !tagsWrapper) return;

  const ctx = canvas.getContext('2d');
  const tagElements = tagsWrapper.querySelectorAll('.skill-tag');

  let width = container.clientWidth;
  let height = container.clientHeight;

  canvas.width = width;
  canvas.height = height;

  const bounce = 0.4;
  const friction = 0.98;
  const gravity = 0.22;

  let mouse = { x: -1000, y: -1000, radius: 100 };
  let isHovered = false;

  const bubbles = [];

  tagElements.forEach(el => {
    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
  });

  let draggedBubble = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  let animId = null;

  function startLoop() {
    if (!animId) {
      animId = requestAnimationFrame(update);
    }
  }

  container.addEventListener('mousedown', (e) => {
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (clickX >= b.x && clickX <= b.x + b.width &&
        clickY >= b.y && clickY <= b.y + b.height) {
        draggedBubble = b;
        dragOffsetX = clickX - b.x;
        dragOffsetY = clickY - b.y;
        b.vx = 0;
        b.vy = 0;
        b.element.style.cursor = 'grabbing';
        break;
      }
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!draggedBubble) {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      isHovered = true;
      startLoop();
      return;
    }

    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let targetX = clickX - dragOffsetX;
    let targetY = clickY - dragOffsetY;

    targetX = Math.max(5, Math.min(width - draggedBubble.width - 5, targetX));
    targetY = Math.max(5, Math.min(height - draggedBubble.height - 5, targetY));

    draggedBubble.vx = (targetX - draggedBubble.x) * 0.8;
    draggedBubble.vy = (targetY - draggedBubble.y) * 0.8;

    draggedBubble.x = targetX;
    draggedBubble.y = targetY;

    startLoop();
  });

  window.addEventListener('mouseup', () => {
    if (draggedBubble) {
      draggedBubble.element.style.cursor = 'grab';
      draggedBubble = null;
    }
  });

  container.addEventListener('mouseenter', () => {
    isHovered = true;
    startLoop();
  });

  container.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
    isHovered = false;
  });

  window.addEventListener('resize', () => {
    if (!container || !canvas) return;
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
    startLoop();
  });

  function update() {
    let hasMotion = false;

    bubbles.forEach(b => {
      if (b === draggedBubble) return;

      b.vy += gravity;
      b.vx *= friction;
      b.vy *= friction;

      b.x += b.vx;
      b.y += b.vy;

      if (Math.abs(b.vx) > 0.05 || Math.abs(b.vy) > 0.05) hasMotion = true;

      if (b.x < 5) { b.x = 5; b.vx = -b.vx * bounce; hasMotion = true; }
      else if (b.x > width - b.width - 5) { b.x = width - b.width - 5; b.vx = -b.vx * bounce; hasMotion = true; }

      if (b.y < 5) { b.y = 5; b.vy = -b.vy * bounce; hasMotion = true; }
      else if (b.y > height - b.height - 5) { b.y = height - b.height - 5; b.vy = -b.vy * bounce; b.vx *= 0.85; hasMotion = true; }

      if (isHovered && b !== draggedBubble) {
        const bx = b.x + b.width / 2;
        const by = b.y + b.height / 2;
        const dx = bx - mouse.x;
        const dy = by - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const push = force * 1.5;
          b.vx += Math.cos(angle) * push;
          b.vy += Math.sin(angle) * push;
          hasMotion = true;
        }
      }
    });

    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const b1 = bubbles[i];
        const b2 = bubbles[j];
        const overlapX = Math.min(b1.x + b1.width, b2.x + b2.width) - Math.max(b1.x, b2.x);
        const overlapY = Math.min(b1.y + b1.height, b2.y + b2.height) - Math.max(b1.y, b2.y);

        if (overlapX > 0 && overlapY > 0) {
          if (b1 === draggedBubble) {
            if (b1.x + b1.width / 2 < b2.x + b2.width / 2) {
              b2.x += overlapX < overlapY ? overlapX : 0;
              b2.y += overlapX >= overlapY ? overlapY : 0;
            } else {
              b2.x -= overlapX < overlapY ? overlapX : 0;
              b2.y -= overlapX >= overlapY ? overlapY : 0;
            }
            b2.vx = -b2.vx * bounce + b1.vx * 0.3;
            b2.vy = -b2.vy * bounce + b1.vy * 0.3;
          } else if (b2 === draggedBubble) {
            if (b1.x + b1.width / 2 < b2.x + b2.width / 2) {
              b1.x -= overlapX < overlapY ? overlapX : 0;
              b1.y -= overlapX >= overlapY ? overlapY : 0;
            } else {
              b1.x += overlapX < overlapY ? overlapX : 0;
              b1.y += overlapX >= overlapY ? overlapY : 0;
            }
            b1.vx = -b1.vx * bounce + b2.vx * 0.3;
            b1.vy = -b1.vy * bounce + b2.vy * 0.3;
          } else {
            if (overlapX < overlapY) {
              const push = overlapX * 0.5;
              if (b1.x + b1.width / 2 < b2.x + b2.width / 2) { b1.x -= push; b2.x += push; } else { b1.x += push; b2.x -= push; }
              const temp = b1.vx; b1.vx = b2.vx * bounce; b2.vx = temp * bounce;
            } else {
              const push = overlapY * 0.5;
              if (b1.y + b1.height / 2 < b2.y + b2.height / 2) { b1.y -= push; b2.y += push; } else { b1.y += push; b2.y -= push; }
              const temp = b1.vy; b1.vy = b2.vy * bounce; b2.vy = temp * bounce;
            }
          }
          hasMotion = true;
        }
      }
    }

    ctx.clearRect(0, 0, width, height);
    bubbles.forEach(b => {
      b.element.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    });

    if (isHovered || hasMotion || draggedBubble) {
      animId = requestAnimationFrame(update);
    } else {
      animId = null;
    }
  }

  setTimeout(() => {
    width = container.clientWidth;
    height = container.clientHeight;
    tagElements.forEach((el) => {
      const w = el.offsetWidth || 100;
      const h = el.offsetHeight || 34;
      let rx = Math.random() * (width - w - 20) + 10;
      let ry = height - h - 5;
      let collision = true;
      let attempts = 0;
      while (collision && attempts < 1000) {
        collision = false;
        attempts++;
        for (let i = 0; i < bubbles.length; i++) {
          const other = bubbles[i];
          const overlapX = Math.min(rx + w, other.x + other.width) - Math.max(rx, other.x);
          const overlapY = Math.min(ry + h, other.y + other.height) - Math.max(ry, other.y);
          if (overlapX > 2 && overlapY > 2) {
            collision = true;
            ry -= 3;
            if (ry < 5) { rx = Math.random() * (width - w - 20) + 10; ry = height - h - 5; }
            break;
          }
        }
      }
      bubbles.push({ element: el, x: rx, y: ry, vx: 0, vy: 0, width: w, height: h, mass: (parseFloat(el.getAttribute('data-weight')) || 1.0) * 10 });
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    });
    startLoop();
  }, 120);
}

// -------------------------------------------------------------
// 5. Canvas World Map with Interactive Mouse Repulsion
// -------------------------------------------------------------
function initDottedMap() {
  const container = document.getElementById('map-canvas-container');
  const canvas = document.getElementById('map-canvas');
  const tooltip = document.getElementById('map-tooltip');
  if (!container || !canvas || typeof MAP_DOTS === 'undefined') return;

  const ctx = canvas.getContext('2d');

  // Dimensions of original SVG coordinates viewbox
  const origW = 1024.59;
  const origH = 482.987;

  let dpr = window.devicePixelRatio || 1;
  let layoutW, layoutH;
  let scale = 1, offsetX = 0, offsetY = 0;

  let mouse = { x: -1000, y: -1000, canvasX: -1000, canvasY: -1000, radius: 60 };
  let isHovered = false;

  // Target glowing coordinate
  const highlightedCoord = [498.35, 191.34];
  let highlightDotRef = null;

  // Map points array
  const dots = [];

  // Initialize map dots
  MAP_DOTS.forEach(coord => {
    const isHighlight = (Math.abs(coord[0] - highlightedCoord[0]) < 0.1 && Math.abs(coord[1] - highlightedCoord[1]) < 0.1);
    const dot = {
      ox: coord[0], // original x coordinate
      oy: coord[1], // original y coordinate
      x: 0,        // display x
      y: 0,        // display y
      origX: 0,    // current layout target x
      origY: 0,    // current layout target y
      vx: 0,
      vy: 0,
      isHighlight: isHighlight
    };
    dots.push(dot);
    if (isHighlight) {
      highlightDotRef = dot;
    }
  });

  // Function to adapt layout scale and sizes with permanent Valencia zoom
  function resize() {
    layoutW = container.clientWidth;
    layoutH = container.clientHeight;

    // Set internal resolution scaled by Retina/HiDPI density
    canvas.width = layoutW * dpr;
    canvas.height = layoutH * dpr;
    ctx.scale(dpr, dpr);

    // Calculate fit-scale and apply static zoom factor
    const baseScale = Math.min(layoutW / origW, layoutH / origH) * 0.95;
    const zoomFactor = 4.0;
    scale = baseScale * zoomFactor;

    // Center view directly on Valencia, Spain
    offsetX = layoutW / 2 - highlightedCoord[0] * scale;
    offsetY = layoutH / 2 - highlightedCoord[1] * scale;

    // Reset positions
    dots.forEach(d => {
      const layoutX = d.ox * scale + offsetX;
      const layoutY = d.oy * scale + offsetY;

      d.origX = layoutX;
      d.origY = layoutY;

      // If position has not been set yet, initialize it
      if (d.x === 0 && d.y === 0) {
        d.x = layoutX;
        d.y = layoutY;
      }
    });
  }

  resize();
  window.addEventListener('resize', resize);

  let animId = null;

  function startLoop() {
    if (!animId) {
      animId = requestAnimationFrame(draw);
    }
  }

  // Mouse interactions
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    // Check if near highlight dot to show tooltip
    if (highlightDotRef) {
      const dx = mouse.x - highlightDotRef.x;
      const dy = mouse.y - highlightDotRef.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20) {
        tooltip.style.opacity = '1';
        tooltip.style.left = `${highlightDotRef.x}px`;
        tooltip.style.top = `${highlightDotRef.y - 12}px`;
        tooltip.style.transform = `translate(-50%, -100%) scale(1)`;
      } else {
        tooltip.style.opacity = '0';
        tooltip.style.transform = `translate(-50%, -100%) scale(0.9)`;
      }
    }
    startLoop();
  });

  container.addEventListener('mouseenter', () => {
    isHovered = true;
    startLoop();
  });

  container.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
    isHovered = false;
    tooltip.style.opacity = '0';
  });

  // Pulse variables for glowing dot
  let pulseAngle = 0;

  function draw() {
    ctx.clearRect(0, 0, layoutW, layoutH);

    pulseAngle += 0.05;
    const isLightTheme = document.body.classList.contains('light-theme');

    const baseColor = isLightTheme ? 'rgba(75, 85, 99, 0.22)' : 'rgba(213, 215, 218, 0.15)';
    const hoverColor = isLightTheme ? 'rgba(75, 85, 99, 0.4)' : 'rgba(255, 255, 255, 0.3)';
    const purpleAccent = isLightTheme ? '#09090b' : '#ffffff';

    let hasMotion = false;

    // Filter visible dots to avoid rendering off-screen elements (CPU optimization)
    const visibleDots = dots.filter(d => {
      return d.x >= -20 && d.x <= layoutW + 20 && d.y >= -20 && d.y <= layoutH + 20;
    });

    // Update physics and draw dots
    visibleDots.forEach(d => {
      let targetX = d.origX;
      let targetY = d.origY;

      // Calculate mouse repulsion
      if (isHovered) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Calculate pushed target position
          const maxPush = 22; // max distance dots can be pushed
          targetX = d.origX + Math.cos(angle) * force * maxPush;
          targetY = d.origY + Math.sin(angle) * force * maxPush;
        }
      }

      const diffX = targetX - d.x;
      const diffY = targetY - d.y;

      // Interpolate current dot position to target (spring dampening animation)
      d.x += diffX * 0.12;
      d.y += diffY * 0.12;

      if (Math.abs(diffX) > 0.05 || Math.abs(diffY) > 0.05) {
        hasMotion = true;
      }

      // Render dot
      if (d.isHighlight) {
        // We render highlight dot separately at the end to overlay it perfectly
        return;
      }

      // Regular dots (aesthetic fixed size since scale is very large)
      ctx.beginPath();
      const dotRadius = 1.8;
      ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);

      // Check if mouse is hovering over the dot
      const dx = d.x - mouse.x;
      const dy = d.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      ctx.fillStyle = (dist < mouse.radius && isHovered) ? hoverColor : baseColor;
      ctx.fill();

    });

    // Render the glowing highlight dot at the very top layer
    if (highlightDotRef) {
      const hDot = highlightDotRef;

      // Draw pulsing ring glow
      const basePulse = Math.sin(pulseAngle) * 5 + 11;
      ctx.beginPath();
      ctx.arc(hDot.x, hDot.y, basePulse, 0, Math.PI * 2);
      ctx.fillStyle = isLightTheme ? 'rgba(9, 9, 11, 0.12)' : 'rgba(255, 255, 255, 0.12)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(hDot.x, hDot.y, basePulse * 1.8, 0, Math.PI * 2);
      ctx.strokeStyle = isLightTheme ? 'rgba(9, 9, 11, 0.04)' : 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Main inner highlight dot
      ctx.beginPath();
      ctx.arc(hDot.x, hDot.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = purpleAccent;
      ctx.fill();

      // White core
      ctx.beginPath();
      ctx.arc(hDot.x, hDot.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = isLightTheme ? '#FFFFFF' : '#121212';
      ctx.fill();
    }

    // CPU Optimization: Stop frame rendering loop when not hovered and dots are settled
    if (isHovered || hasMotion) {
      animId = requestAnimationFrame(draw);
    } else {
      animId = null;
    }
  }

  startLoop();
}

// -------------------------------------------------------------
// 6. Documents & Downloads Grid Functionality
// -------------------------------------------------------------
function initDownloads() {
  const items = document.querySelectorAll('.download-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const fileName = item.getAttribute('data-file');
      const fileSize = item.getAttribute('data-size');

      triggerDownloadSim(fileName, fileSize);
    });
  });
}

function triggerDownloadSim(fileName, fileSize) {
  const templateDownloading = TRANSLATIONS[currentLang]['toast_downloading'];
  const templateSuccess = TRANSLATIONS[currentLang]['toast_download_success'];

  showToast(templateDownloading.replace('{fileName}', fileName).replace('{fileSize}', fileSize));

  // Simulate delay
  setTimeout(() => {
    showToast(templateSuccess.replace('{fileName}', fileName));
  }, 2200);
}

// -------------------------------------------------------------
// Toast Notification Utility
// -------------------------------------------------------------
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  // Clear any existing timeout
  clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.classList.add('show');

  // Hide after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// -------------------------------------------------------------
// 7. Profile Code Typing Animation
// -------------------------------------------------------------
function initCodeTypewriter() {
  const codeEl = document.querySelector('.code-editor code');
  if (!codeEl) return;

  // Helper to find all text nodes recursively
  function getTextNodes(node) {
    let textNodes = [];
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      for (let child of node.childNodes) {
        textNodes.push(...getTextNodes(child));
      }
    }
    return textNodes;
  }

  const textNodes = getTextNodes(codeEl);
  const originalTexts = textNodes.map(node => node.nodeValue);

  // Clear all text nodes initially
  textNodes.forEach(node => {
    node.nodeValue = '';
  });

  // Create typing cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.style.display = 'inline-block';
  cursor.style.width = '2px';
  cursor.style.height = '1.2em';
  cursor.style.background = 'currentColor';
  cursor.style.marginLeft = '2px';
  cursor.style.verticalAlign = 'middle';
  cursor.style.animation = 'blink 0.8s steps(2, start) infinite';

  // Inject blink animation styles dynamically
  if (!document.getElementById('typewriter-keyframes')) {
    const style = document.createElement('style');
    style.id = 'typewriter-keyframes';
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  let nodeIndex = 0;
  let charIndex = 0;

  // Stagger typing start with the card pop animation
  setTimeout(() => {
    if (textNodes.length > 0) {
      const firstNode = textNodes[0];
      firstNode.parentNode.insertBefore(cursor, firstNode.nextSibling);
    }

    function typeChar() {
      if (nodeIndex >= textNodes.length) {
        // Complete typing, remove cursor
        cursor.remove();
        return;
      }

      const node = textNodes[nodeIndex];
      const originalText = originalTexts[nodeIndex];

      if (charIndex < originalText.length) {
        node.nodeValue += originalText[charIndex];

        // Move cursor to follow active typing position
        node.parentNode.insertBefore(cursor, node.nextSibling);

        charIndex++;

        // Speed up formatting spacing, keep standard speed for text
        const isSpace = originalText[charIndex - 1] === ' ' || originalText[charIndex - 1] === '\n';
        const delay = isSpace ? 3 : (Math.random() * 8 + 4); // 4ms to 12ms
        setTimeout(typeChar, delay);
      } else {
        nodeIndex++;
        charIndex = 0;
        // Continue to next node instantly
        typeChar();
      }
    }

    typeChar();
  }, 450);
}

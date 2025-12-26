// ===== Stato base =====
const icons = document.querySelectorAll(".icon");
const windows = document.querySelectorAll(".window");
const taskbar = document.getElementById("taskbar-apps");
const clock = document.getElementById("clock");
const osRoot = document.getElementById("os");
const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
const startApps = document.querySelectorAll(".start-app");
const startPowerButtons = document.querySelectorAll(".start-power");
const dockItems = document.querySelectorAll(".dock-item");
const splash = document.getElementById("splash");
const blackScreen = document.getElementById("black-screen");
const blackIcon = document.getElementById("black-icon");
const standbyOverlay = document.getElementById("standby-message");
const standbyText = document.getElementById("standby-text");

let zIndexCounter = 10;
let currentLang = "en";
let isInStandby = false;

// ===== i18n (inglese / italiano) =====
const i18n = {
  en: {
    win_notes_title: "Notes",
    win_browser_title: "Mini Browser",
    win_files_title: "Files",
    win_music_title: "Music Player",
    win_terminal_title: "Terminal",
    win_about_title: "System Info",
    win_settings_title: "Settings",
    notes_placeholder: "Write your notes here...",
    browser_placeholder: "fake address… (no real navigation)",
    browser_welcome:
      '<h3>Welcome to NamixOS</h3><p>This is a demo web OS running entirely in your browser.</p>',
    about_content:
      "<h2>NamixOS</h2><p>Mini web operating system, running fully client‑side.</p><ul><li><strong>Windows:</strong> drag, minimize, fullscreen</li><li><strong>Apps:</strong> Notes, Browser, Files, Music, Terminal, Info</li><li><strong>Mobile:</strong> auto fullscreen, tap to open</li></ul>",
    settings_theme_title: "Theme",
    settings_theme_dark: "Dark theme",
    settings_theme_light: "Light theme",
    settings_language_title: "Language",
    settings_mobile_note:
      "On phones windows are automatically fullscreen and opened with a single tap.",
    dock_browser: "Browser",
    dock_files: "Files",
    dock_terminal: "Terminal",
    music_note: "This is a visual music player only (no real audio).",
    fm_quick_access: "Quick access",
    fm_home: "Home",
    fm_documents: "Documents",
    fm_music: "Music",
    fm_path: "Path:",
    power_title: "Power",
    power_standby: "Standby",
    power_reboot: "Restart system",
    confirm_standby: "Do you want to enter standby mode?",
    confirm_reboot: "Restart the system?",
    standby_message: "Namix is in standby. Tap the screen to wake up.",
    icon: {
      notes: "Notes",
      browser: "Browser",
      files: "Files",
      music: "Music",
      terminal: "Terminal",
      about: "About OS"
    },
    terminal_welcome:
      "Welcome to NamixOS terminal.\nType 'help' to see available commands.\n",
    terminal_help:
      "Available commands: help, about, clear, apps, ls, cd, open, lang, date",
    terminal_about: "NamixOS - demo web OS. Powered by SOLEN.",
    terminal_unknown: "Command not recognized:",
    terminal_apps:
      "Apps: notes, browser, files, music, terminal, about, settings",
    terminal_ls_root: "home",
    terminal_ls_home: "Documents  Music  todo.txt  ideas.txt",
    terminal_ls_docs: "spec.md  notes.txt",
    terminal_ls_music: "track1.mp3  track2.mp3",
    terminal_cd_ok: "Moved to:",
    terminal_cd_fail: "No such directory:",
    terminal_open_fail: "Unknown app:",
    terminal_lang_set: "Language set to",
    terminal_prompt_base: "user@namix"
  },

  it: {
    win_notes_title: "Note",
    win_browser_title: "Mini Browser",
    win_files_title: "File",
    win_music_title: "Player Musica",
    win_terminal_title: "Terminale",
    win_about_title: "Info sistema",
    win_settings_title: "Impostazioni",
    notes_placeholder: "Scrivi le tue note qui...",
    browser_placeholder: "indirizzo finto… (non naviga davvero)",
    browser_welcome:
      "<h3>Benvenuto in NamixOS</h3><p>Questo è un sistema operativo web di demo, tutto nel browser.</p>",
    about_content:
      "<h2>NamixOS</h2><p>Mini sistema operativo web, eseguito totalmente lato client.</p><ul><li><strong>Finestre:</strong> drag, minimizza, schermo intero</li><li><strong>App:</strong> Note, Browser, File, Musica, Terminale, Info</li><li><strong>Mobile:</strong> fullscreen automatico, tap per aprire</li></ul>",
    settings_theme_title: "Tema",
    settings_theme_dark: "Tema scuro",
    settings_theme_light: "Tema chiaro",
    settings_language_title: "Lingua",
    settings_mobile_note:
      "Su telefono le finestre sono a schermo intero e si aprono con un singolo tap.",
    dock_browser: "Browser",
    dock_files: "File",
    dock_terminal: "Terminale",
    music_note:
      "Questo è solo un player visivo (nessun audio reale).",
    fm_quick_access: "Accesso rapido",
    fm_home: "Home",
    fm_documents: "Documenti",
    fm_music: "Musica",
    fm_path: "Percorso:",
    power_title: "Alimentazione",
    power_standby: "Standby",
    power_reboot: "Riavvia il sistema",
    confirm_standby: "Vuoi entrare in modalità standby?",
    confirm_reboot: "Riavviare il sistema?",
    standby_message:
      "Namix è in standby. Tocca lo schermo per riattivare.",
    icon: {
      notes: "Note",
      browser: "Browser",
      files: "File",
      music: "Musica",
      terminal: "Terminale",
      about: "Info OS"
    },
    terminal_welcome:
      "Benvenuto nel terminale di NamixOS.\nScrivi 'help' per vedere i comandi disponibili.\n",
    terminal_help:
      "Comandi disponibili: help, about, clear, apps, ls, cd, open, lang, date",
    terminal_about:
      "NamixOS - sistema operativo web demo. Powered by SOLEN.",
    terminal_unknown: "Comando non riconosciuto:",
    terminal_apps:
      "App: note, browser, file, musica, terminale, info, impostazioni",
    terminal_ls_root: "home",
    terminal_ls_home: "Documenti  Musica  todo.txt  ideas.txt",
    terminal_ls_docs: "spec.md  note.txt",
    terminal_ls_music: "brano1.mp3  brano2.mp3",
    terminal_cd_ok: "Spostato in:",
    terminal_cd_fail: "Directory inesistente:",
    terminal_open_fail: "App sconosciuta:",
    terminal_lang_set: "Lingua impostata su",
    terminal_prompt_base: "utente@namix"
  }
};

function getDict() {
  return i18n[currentLang];
}

function applyTranslations() {
  const dict = getDict();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key]) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key]) el.placeholder = dict[key];
  });

  document.querySelectorAll("[data-i18n-icon]").forEach((el) => {
    const key = el.dataset.i18nIcon;
    if (dict.icon && dict.icon[key]) {
      const label = el.querySelector(".icon-label");
      if (label) label.textContent = dict.icon[key];
    }
  });

  const dockBrowser = document.querySelector('[data-i18n="dock_browser"]');
  const dockFiles = document.querySelector('[data-i18n="dock_files"]');
  const dockTerminal = document.querySelector('[data-i18n="dock_terminal"]');
  if (dockBrowser) dockBrowser.textContent = dict.dock_browser;
  if (dockFiles) dockFiles.textContent = dict.dock_files;
  if (dockTerminal) dockTerminal.textContent = dict.dock_terminal;

  const prompt = document.getElementById("terminal-prompt");
  if (prompt) {
    prompt.textContent = `${dict.terminal_prompt_base}:~$`;
  }

  if (standbyText) standbyText.textContent = dict.standby_message;
}

// ===== Splash intro =====
function playSplash(callback) {
  if (!splash) {
    if (callback) callback();
    return;
  }
  splash.classList.add("visible");
  setTimeout(() => {
    splash.classList.remove("visible");
    if (callback) callback();
  }, 2800);
}

// ===== Apertura / gestione finestre =====
function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  if (!win.dataset.inited) {
    const offsetX = 60 + Math.random() * 140;
    const offsetY = 60 + Math.random() * 80;
    win.style.left = offsetX + "px";
    win.style.top = offsetY + "px";
    win.dataset.inited = "1";
  }

  win.style.display = "block";
  win.classList.remove("fullscreen");
  if (window.innerWidth <= 700) {
    win.classList.add("fullscreen");
  }

  win.style.animation = "none";
  void win.offsetWidth;
  win.style.animation = "";
  focusWindow(win);
  createOrActivateTaskbarItem(win);
}

function focusWindow(win) {
  windows.forEach((w) => w.classList.remove("active"));
  win.classList.add("active");
  zIndexCounter += 1;
  win.style.zIndex = zIndexCounter;
}

function closeWindow(win) {
  win.style.display = "none";
  const id = win.id;
  const item = taskbar.querySelector(`[data-window="${id}"]`);
  if (item) item.remove();
}

function minimizeWindow(win) {
  win.style.display = "none";
  const id = win.id;
  const item = taskbar.querySelector(`[data-window="${id}"]`);
  if (item) item.classList.remove("active");
}

function closeAllWindows() {
  windows.forEach((win) => {
    win.style.display = "none";
  });
  taskbar.innerHTML = "";
}

function createOrActivateTaskbarItem(win) {
  const id = win.id;
  let item = taskbar.querySelector(`[data-window="${id}"]`);

  const dict = getDict();
  const appKey = win.dataset.app;
  const labelFromIcon =
    dict.icon && dict.icon[appKey] ? dict.icon[appKey] : null;
  const title =
    labelFromIcon ||
    win.querySelector(".window-title")?.textContent ||
    "App";

  if (!item) {
    item = document.createElement("div");
    item.className = "taskbar-item active";
    item.dataset.window = id;
    item.textContent = title;
    item.addEventListener("click", () => {
      if (win.style.display === "none" || win.style.display === "") {
        win.style.display = "block";
        focusWindow(win);
        item.classList.add("active");
      } else {
        minimizeWindow(win);
      }
    });
    taskbar.appendChild(item);
  } else {
    item.classList.add("active");
  }
}

// Icone desktop
icons.forEach((icon) => {
  icon.addEventListener("dblclick", () => {
    const id = icon.dataset.window;
    if (id) openWindow(id);
  });

  icon.addEventListener("click", () => {
    if (window.innerWidth <= 700) {
      const id = icon.dataset.window;
      if (id) openWindow(id);
    }
  });
});

// Dock
dockItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.window;
    if (id) openWindow(id);
  });
});

// Start menu
function toggleStartMenu() {
  const isOpen = startMenu.classList.contains("open");
  if (isOpen) {
    startMenu.classList.remove("open");
    startButton.classList.remove("active");
  } else {
    startMenu.classList.add("open");
    startButton.classList.add("active");
  }
}

startButton.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleStartMenu();
});

startApps.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.window;
    if (id) openWindow(id);
    startMenu.classList.remove("open");
    startButton.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!startMenu.contains(e.target) && e.target !== startButton) {
    startMenu.classList.remove("open");
    startButton.classList.remove("active");
  }
});

// Bottoni finestra + drag
windows.forEach((win) => {
  const btnClose = win.querySelector(".btn-close");
  const btnMin = win.querySelector(".btn-minimize");
  const btnFull = win.querySelector(".btn-fullscreen");
  const titlebar = win.querySelector(".window-titlebar");

  if (btnClose) {
    btnClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeWindow(win);
    });
  }

  if (btnMin) {
    btnMin.addEventListener("click", (e) => {
      e.stopPropagation();
      minimizeWindow(win);
    });
  }

  if (btnFull) {
    btnFull.addEventListener("click", (e) => {
      e.stopPropagation();
      win.classList.toggle("fullscreen");
      if (win.style.display !== "none") {
        focusWindow(win);
      }
    });
  }

  if (titlebar) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const startDrag = (e) => {
      if (window.innerWidth <= 700 || win.classList.contains("fullscreen"))
        return;
      dragging = true;
      focusWindow(win);
      const rect = win.getBoundingClientRect();
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      e.preventDefault();
    };

    const doDrag = (e) => {
      if (!dragging) return;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      win.style.left = clientX - offsetX + "px";
      win.style.top = clientY - offsetY + "px";
    };

    const stopDrag = () => {
      dragging = false;
    };

    titlebar.addEventListener("mousedown", startDrag);
    titlebar.addEventListener("touchstart", startDrag, { passive: false });
    document.addEventListener("mousemove", doDrag);
    document.addEventListener("touchmove", doDrag, { passive: false });
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);

    win.addEventListener("mousedown", () => focusWindow(win));
    win.addEventListener("touchstart", () => focusWindow(win));
  }
});

// Clock
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  clock.textContent = `${hh}:${mm}`;
}
updateClock();
setInterval(updateClock, 30 * 1000);

// Tema
const themeButtons = document.querySelectorAll(".btn-theme");
themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    if (theme === "dark") {
      osRoot.classList.remove("light-theme");
    } else if (theme === "light") {
      osRoot.classList.add("light-theme");
    }
  });
});

// Lingua
const langButtons = document.querySelectorAll(".btn-lang");
langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    if (lang && i18n[lang]) {
      currentLang = lang;
      applyTranslations();
      terminalPrint(getDict().terminal_lang_set + " " + lang);
    }
  });
});

// ===== Mobile fullscreen auto =====
function mobileMode() {
  if (window.innerWidth <= 700) {
    windows.forEach((win) => {
      if (win.style.display !== "none") {
        win.classList.add("fullscreen");
      }
    });
  } else {
    windows.forEach((win) => {
      win.classList.remove("fullscreen");
    });
  }
}
mobileMode();
window.addEventListener("resize", mobileMode);

// ===== Standby & Reboot =====
function showBlackSequence(iconSymbol, duration = 3000, callback) {
  if (!blackScreen || !blackIcon) {
    if (callback) callback();
    return;
  }
  blackIcon.textContent = iconSymbol;
  blackScreen.classList.add("visible");
  setTimeout(() => {
    blackScreen.classList.remove("visible");
    setTimeout(() => {
      if (callback) callback();
    }, 400);
  }, duration);
}

function enterStandby() {
  const dict = getDict();
  const ok = window.confirm(dict.confirm_standby);
  if (!ok) return;

  startMenu.classList.remove("open");
  startButton.classList.remove("active");
  closeAllWindows();

  showBlackSequence("⏸", 3000, () => {
    setTimeout(() => {
      standbyOverlay.classList.add("visible");
      isInStandby = true;
    }, 0);
  });
}

function wakeFromStandby() {
  if (!isInStandby) return;
  isInStandby = false;
  standbyOverlay.classList.remove("visible");

  showBlackSequence("⏸", 3000, () => {
    playSplash(() => {});
  });
}

standbyOverlay.addEventListener("click", wakeFromStandby);
standbyOverlay.addEventListener("touchstart", (e) => {
  e.preventDefault();
  wakeFromStandby();
});

function enterReboot() {
  const dict = getDict();
  const ok = window.confirm(dict.confirm_reboot);
  if (!ok) return;

  startMenu.classList.remove("open");
  startButton.classList.remove("active");
  closeAllWindows();

  showBlackSequence("🔄", 3000, () => {
    setTimeout(() => {
      playSplash(() => {});
    }, 3000);
  });
}

startPowerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "standby") enterStandby();
    if (action === "reboot") enterReboot();
  });
});

// ===== Init =====
applyTranslations();
renderFileManager();
playSplash(() => {});

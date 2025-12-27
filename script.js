/* ===========================
   BASIC STATE
=========================== */
const icons = document.querySelectorAll(".icon");
const windowsEls = document.querySelectorAll(".window");
const taskbar = document.getElementById("taskbar-apps");
const clock = document.getElementById("clock");
const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
const startApps = document.querySelectorAll(".start-app");
const startPowerButtons = document.querySelectorAll(".start-power");
const dockItems = document.querySelectorAll(".dock-item");
const dockRecent = document.getElementById("dock-recent");
const dockDivider = document.getElementById("dock-divider");
const splash = document.getElementById("splash");
const blackScreen = document.getElementById("black-screen");
const blackIcon = document.getElementById("black-icon");
const standbyOverlay = document.getElementById("standby-message");
const contextMenu = document.getElementById("context-menu");
const ctxItems = document.querySelectorAll(".ctx-item");

let zIndexCounter = 500;
let isInStandby = false;
let recentApps = []; // track up to 2 recent app IDs
let ctxTargetWindowId = null;

/* ===========================
   WINDOW MANAGEMENT
=========================== */
function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  win.style.display = "flex";
  focusWindow(win);

  if (window.innerWidth <= 700) {
    win.classList.add("fullscreen");
  }

  addToTaskbar(id);
  updateRecentApps(id);
}

function closeWindow(win) {
  win.style.display = "none";
  removeFromTaskbar(win.id);
  removeFromRecent(win.id);
  updateDockRecent();
}

function minimizeWindow(win) {
  win.style.display = "none";
}

function focusWindow(win) {
  zIndexCounter++;
  win.style.zIndex = zIndexCounter;
  windowsEls.forEach(w => w.classList.remove("active"));
  win.classList.add("active");
}

/* ===========================
   TASKBAR
=========================== */
function addToTaskbar(id) {
  if (document.querySelector(`.taskbar-item[data-window="${id}"]`)) return;

  const item = document.createElement("div");
  item.className = "taskbar-item";
  item.dataset.window = id;
  item.textContent = id.replace("win-", "");
  item.addEventListener("click", () => {
    const win = document.getElementById(id);
    if (!win) return;
    if (win.style.display === "none" || win.style.display === "") {
      openWindow(id);
    } else {
      focusWindow(win);
    }
  });
  taskbar.appendChild(item);
}

function removeFromTaskbar(id) {
  const item = document.querySelector(`.taskbar-item[data-window="${id}"]`);
  if (item) item.remove();
}

/* ===========================
   RECENT APPS IN DOCK
=========================== */
function updateRecentApps(id) {
  // don't track browser/files/terminal separately if they are already in main dock, but user asked: separate “used apps”
  if (!recentApps.includes(id)) {
    recentApps.unshift(id);
    if (recentApps.length > 2) recentApps.pop();
  }
  updateDockRecent();
}

function removeFromRecent(id) {
  recentApps = recentApps.filter(x => x !== id);
}

function updateDockRecent() {
  dockRecent.innerHTML = "";

  if (recentApps.length === 0) {
    dockDivider.style.display = "none";
    return;
  }

  dockDivider.style.display = "block";

  recentApps.forEach(id => {
    const btn = document.createElement("button");
    btn.className = "dock-recent-item";
    btn.dataset.window = id;

    // choose symbol based on window
    let symbol = "□";
    if (id === "win-browser") symbol = "🌐";
    else if (id === "win-files") symbol = "🗂️";
    else if (id === "win-terminal") symbol = ">_";
    else if (id === "win-notes") symbol = "📝";
    else if (id === "win-about") symbol = "OS";
    else if (id === "win-settings") symbol = "⚙️";

    btn.textContent = symbol;

    const dot = document.createElement("div");
    dot.className = "dock-indicator";
    btn.appendChild(dot);

    btn.addEventListener("click", () => openWindow(id));

    // context menu
    attachContextMenuHandlers(btn, id);

    dockRecent.appendChild(btn);
  });
}

/* ===========================
   ICONS & DOCK
=========================== */
icons.forEach(icon => {
  // locked browser: no window
  if (icon.classList.contains("locked-browser")) {
    icon.addEventListener("click", () => {
      // optional feedback, left empty for clean UI
    });
    return;
  }

  const target = icon.dataset.window;
  if (!target) return;

  icon.addEventListener("dblclick", () => openWindow(target));

  icon.addEventListener("click", () => {
    if (window.innerWidth <= 700) openWindow(target);
  });
});

dockItems.forEach(btn => {
  const winId = btn.dataset.window;
  btn.addEventListener("click", () => openWindow(winId));

  attachContextMenuHandlers(btn, winId);
});

/* ===========================
   START MENU
=========================== */
startButton.addEventListener("click", e => {
  e.stopPropagation();
  startMenu.classList.toggle("open");
});

document.addEventListener("click", () => {
  startMenu.classList.remove("open");
  hideContextMenu();
});

startApps.forEach(btn => {
  btn.addEventListener("click", () => {
    openWindow(btn.dataset.window);
    startMenu.classList.remove("open");
  });
});

/* ===========================
   WINDOW BUTTONS + DRAG
=========================== */
windowsEls.forEach(win => {
  const btnClose = win.querySelector(".btn-close");
  const btnMin = win.querySelector(".btn-minimize");
  const btnFull = win.querySelector(".btn-fullscreen");
  const titlebar = win.querySelector(".window-titlebar");

  if (btnClose) btnClose.addEventListener("click", () => closeWindow(win));
  if (btnMin) btnMin.addEventListener("click", () => minimizeWindow(win));
  if (btnFull) btnFull.addEventListener("click", () => win.classList.toggle("fullscreen"));

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titlebar.addEventListener("mousedown", e => {
    if (win.classList.contains("fullscreen")) return;
    dragging = true;
    focusWindow(win);
    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;
    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => dragging = false);
});

/* ===========================
   CONTEXT MENU
=========================== */
function attachContextMenuHandlers(element, windowId) {
  // right-click
  element.addEventListener("contextmenu", e => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, windowId);
  });

  // long press on touch
  let pressTimer = null;

  element.addEventListener("touchstart", e => {
    pressTimer = setTimeout(() => {
      const touch = e.touches[0];
      showContextMenu(touch.clientX, touch.clientY, windowId);
    }, 500);
  });

  element.addEventListener("touchend", () => {
    if (pressTimer) clearTimeout(pressTimer);
  });

  element.addEventListener("touchmove", () => {
    if (pressTimer) clearTimeout(pressTimer);
  });
}

function showContextMenu(x, y, windowId) {
  ctxTargetWindowId = windowId;
  contextMenu.style.display = "flex";
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";
}

function hideContextMenu() {
  contextMenu.style.display = "none";
  ctxTargetWindowId = null;
}

ctxItems.forEach(item => {
  item.addEventListener("click", () => {
    if (!ctxTargetWindowId) return;

    const win = document.getElementById(ctxTargetWindowId);
    const action = item.dataset.action;

    if (action === "close" && win) closeWindow(win);
    if (action === "open") openWindow(ctxTargetWindowId);
    if (action === "hide" && win) minimizeWindow(win);

    hideContextMenu();
  });
});

/* ===========================
   CLOCK
=========================== */
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
updateClock();
setInterval(updateClock, 30000);

/* ===========================
   SPLASH
=========================== */
function playSplash(callback) {
  splash.style.display = "flex";
  splash.classList.add("visible");

  setTimeout(() => {
    splash.classList.remove("visible");
    splash.style.display = "none";
    if (callback) callback();
  }, 2500);
}

/* ===========================
   STANDBY & REBOOT
=========================== */
function showBlack(icon, duration, callback) {
  blackIcon.textContent = icon;
  blackScreen.querySelector(".black-title").textContent = "NamixOS";
  blackScreen.style.display = "flex";
  blackScreen.classList.add("visible");

  setTimeout(() => {
    blackScreen.classList.remove("visible");
    blackScreen.style.display = "none";
    if (callback) callback();
  }, duration);
}

function enterStandby() {
  windowsEls.forEach(w => w.style.display = "none");

  showBlack("⏸", 1500, () => {
    standbyOverlay.style.display = "flex";
    standbyOverlay.classList.add("visible");
    isInStandby = true;
  });
}

function wakeFromStandby() {
  if (!isInStandby) return;

  standbyOverlay.classList.remove("visible");
  standbyOverlay.style.display = "none";
  isInStandby = false;

  showBlack("⏸", 1500, () => playSplash(() => {}));
}

standbyOverlay.addEventListener("click", wakeFromStandby);

function enterReboot() {
  windowsEls.forEach(w => w.style.display = "none");
  showBlack("🔄", 1500, () => playSplash(() => {}));
}

startPowerButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.action === "standby") enterStandby();
    if (btn.dataset.action === "reboot") enterReboot();
  });
});

/* ===========================
   MOBILE FULLSCREEN
=========================== */
function mobileMode() {
  const isMobile = window.innerWidth <= 700;
  windowsEls.forEach(win => {
    if (win.style.display !== "none") {
      win.classList.toggle("fullscreen", isMobile);
    }
  });
}
window.addEventListener("resize", mobileMode);

/* ===========================
   INIT
=========================== */
playSplash(() => {});
blackScreen.style.display = "none";
standbyOverlay.style.display = "none";

const gameData = {
  cs: {
    pageTitle: "Node Coach — Counter-Strike 2",
    heroLine: "Две игры.",
    description: "Node Coach CS разбирает завершённые демки, раунды, opening-контакты, размены и utility. Никаких подсказок во время матча.",
    primaryLabel: "Скачать CS beta",
    primaryHref: "download-cs.html",
    windowTitle: "Node Coach CS",
    windowBadge: "POST-MATCH",
    navA: "Demo Lab",
    navB: "Раунды",
    dashKicker: "ПОСЛЕДНИЙ МАТЧ",
    dashTitle: "Mirage • 13:11",
    result: "Победа",
    metrics: [
      ["ADR", "78.4", "+4.8", ""],
      ["KAST", "70.8%", "стабильно", ""],
      ["OPENING", "4–5", "риск", "risk"],
      ["TRADE", "35%", "ниже цели", "risk"]
    ],
    coach: "Ты создаёшь достаточно урона, но пять первых смертей заставляют команду слишком часто играть 4v5. Главная задача — качество первого контакта и дистанция второго игрока.",
    priorities: ["Opening deaths", "Spacing для размена", "Utility до контакта"],
    signalTitle: "РАУНДЫ",
    bars: [44,70,35,82,58,90,62],
    featureEyebrow: "NODE COACH CS",
    featureTitle: "От демки до тренировочного блока",
    features: [
      ["Demo Lab","K/D, ADR, KAST, opening, headshots, размены и utility damage."],
      ["Раундовый таймлайн","Первый контакт, установка бомбы и ключевые события каждого раунда."],
      ["Карта смертей","Повторяющиеся точки риска и фильтрация по игроку."],
      ["Командная комната","Пятёрка, роли, opening-баланс и качество разменов."],
      ["Сравнение","Своя демка против профессиональной или сильной эталонной."],
      ["Тренировочный сезон","Одна цель на 5–20 матчей и измеримый прогресс."]
    ],
    downloadTitle: "Node Coach CS",
    downloadCopy: "Разбирай завершённые CS2-демки локально. Бесплатно на этапе открытой beta.",
    downloadLabel: "Скачать CS beta",
    downloadHref: "download-cs.html",
    switchLabel: "Переключить на Dota",
    switchTarget: "dota"
  },
  dota: {
    pageTitle: "Node Coach — Dota 2",
    heroLine: "Две игры.",
    description: "Node Coach Dota анализирует профиль, роли, экономику, драфты, командные матчи и доступные replay-события. Только после завершения игры.",
    primaryLabel: "Скачать Dota beta",
    primaryHref: "download-dota.html",
    windowTitle: "Node Coach Dota",
    windowBadge: "REPLAY COACH",
    navA: "Матчи",
    navB: "Replay Lab",
    dashKicker: "ПОСЛЕДНИЙ МАТЧ",
    dashTitle: "Radiant • 41:26",
    result: "Победа",
    metrics: [
      ["KDA", "4.8", "+0.6", ""],
      ["GPM", "612", "выше базы", ""],
      ["DEATHS", "7", "риск", "risk"],
      ["ROLE", "Pos 1", "87% увер.", ""]
    ],
    coach: "Фарм и темп были достаточными, но две смерти после выигранных драк остановили давление на карту. Главная задача — превращать преимущество в объект, а не в дополнительный риск.",
    priorities: ["Смерти после драки", "Тайминг ключевого предмета", "Конверсия в объекты"],
    signalTitle: "ТАЙМЛАЙН",
    bars: [32,48,66,55,81,73,91],
    featureEyebrow: "NODE COACH DOTA",
    featureTitle: "От роли и экономики до драфта",
    features: [
      ["Разбор профиля","Роли, герои, экономика, форма и повторяющиеся паттерны."],
      ["Replay Lab","Ключевые события, предметы, драки, объекты и временная шкала."],
      ["Определение позиции","Вероятности ролей, ручная коррекция и сохранение выбора."],
      ["Draft Lab","Функциональный баланс состава, пики, баны и pro-эталоны."],
      ["Командный режим","Пятёрка, роли, общие матчи и отчёт для разбора."],
      ["Тренировочный сезон","Цели на серию матчей и контроль процесса, а не только побед."]
    ],
    downloadTitle: "Node Coach Dota",
    downloadCopy: "Разбирай профиль, роли, матчи и командные драфты. Бесплатно на этапе открытой beta.",
    downloadLabel: "Скачать Dota beta",
    downloadHref: "download-dota.html",
    switchLabel: "Переключить на CS",
    switchTarget: "cs"
  }
};

const root = document.documentElement;
const cards = [...document.querySelectorAll(".game-card")];
const productPanels = [...document.querySelectorAll("[data-select-game]")];

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove("switch-fade");
  void el.offsetWidth;
  el.classList.add("switch-fade");
}

function renderMetrics(items) {
  const host = document.getElementById("metrics");
  host.innerHTML = items.map(([label,value,note,cls]) =>
    `<article class="switch-fade"><small>${label}</small><strong>${value}</strong><b class="${cls}">${note}</b></article>`
  ).join("");
}

function renderFeatures(items) {
  const host = document.getElementById("feature-grid");
  host.innerHTML = items.map(([title,copy],index) =>
    `<article class="switch-fade"><b>${String(index+1).padStart(2,"0")}</b><h3>${title}</h3><p>${copy}</p></article>`
  ).join("");
}

function renderPriorities(items) {
  document.getElementById("priority-list").innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function renderBars(values) {
  document.getElementById("signal-bars").innerHTML = values.map(v => `<i style="height:${v}%"></i>`).join("");
}

function setGame(game, scrollToFeatures = false) {
  const data = gameData[game];
  if (!data) return;

  root.dataset.game = game;
  document.title = data.pageTitle;
  localStorage.setItem("nodeCoachGame", game);

  cards.forEach(card => {
    const active = card.dataset.game === game;
    card.classList.toggle("active", active);
    card.setAttribute("aria-selected", String(active));
    const state = card.querySelector(".game-state");
    if (state) state.textContent = active ? "ACTIVE" : "SELECT";
  });

  setText("hero-game-line", data.heroLine);
  setText("hero-description", data.description);

  const primary = document.getElementById("primary-download");
  primary.textContent = data.primaryLabel;
  primary.href = data.primaryHref;

  setText("window-title", data.windowTitle);
  setText("window-badge", data.windowBadge);
  setText("nav-item-a", data.navA);
  setText("nav-item-b", data.navB);
  setText("dash-kicker", data.dashKicker);
  setText("dash-title", data.dashTitle);
  setText("dash-result", data.result);
  setText("coach-text", data.coach);
  setText("signal-title", data.signalTitle);

  renderMetrics(data.metrics);
  renderPriorities(data.priorities);
  renderBars(data.bars);

  setText("feature-eyebrow", data.featureEyebrow);
  setText("feature-title", data.featureTitle);
  renderFeatures(data.features);

  setText("download-title", data.downloadTitle);
  setText("download-copy", data.downloadCopy);

  const downloadMain = document.getElementById("download-main");
  downloadMain.textContent = data.downloadLabel;
  downloadMain.href = data.downloadHref;

  const downloadSwitch = document.getElementById("download-switch");
  downloadSwitch.textContent = data.switchLabel;
  downloadSwitch.dataset.switch = data.switchTarget;

  if (scrollToFeatures) {
    document.getElementById("features").scrollIntoView({behavior:"smooth",block:"start"});
  }
}

cards.forEach(card => card.addEventListener("click", () => setGame(card.dataset.game)));
productPanels.forEach(panel => panel.addEventListener("click", () => setGame(panel.dataset.selectGame, true)));

document.getElementById("download-switch").addEventListener("click", event => {
  setGame(event.currentTarget.dataset.switch);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", event => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior:"smooth"});
  });
});

const stored = localStorage.getItem("nodeCoachGame");
setGame(stored === "dota" ? "dota" : "cs");

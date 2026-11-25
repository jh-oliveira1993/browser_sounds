const { storage, tabs, offscreen, runtime } = chrome;

const DEFAULT_PACK = "ie6";
const settings = {};

// Wait for initial settings load so the first sound after service-worker wake-up uses saved preferences
const settingsReady = storage.sync.get(null).then((result) => {
  Object.assign(settings, result);
});

storage.sync.onChanged.addListener((changes) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    settings[key] = newValue;
  }
});

async function ensureOffscreen() {
  try {
    if (!(await offscreen.hasDocument())) {
      await offscreen.createDocument({
        url: runtime.getURL("offscreen.html"),
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Play audio for IE classic UI sounds",
      });
    }
  } catch (err) {
    if (
      !err.message.includes("Only a single offscreen document may be created")
    ) {
      throw err;
    }
  }
}

async function playEvent(soundKey) {
  await settingsReady;
  if (settings[soundKey + "Enabled"] === false) {
    return;
  }
  const globalVol = parseFloat(settings.globalVolume ?? 1);
  const specificVol = parseFloat(settings[soundKey + "Volume"] ?? 1);
  const volume = Math.min(1, Math.max(0, globalVol * specificVol));
  const pack = settings.soundpack || DEFAULT_PACK;
  const url = runtime.getURL(`sounds/${pack}/${soundKey}.wav`);

  await ensureOffscreen();
  try {
    await runtime.sendMessage({ type: "play", url, volume });
  } catch (err) {
    // Offscreen listener may not be ready yet; ignore
  }
}

// IE played the navigation click only when starting navigation, not on every title/favicon update
const lastLoading = new Map();
tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "loading") {
    return;
  }
  const now = Date.now();
  if (now - (lastLoading.get(tabId) ?? 0) < 300) {
    return;
  }
  lastLoading.set(tabId, now);
  playEvent("navigationStart");
});

tabs.onActivated.addListener(() => playEvent("tabSwitch"));
tabs.onCreated.addListener(() => playEvent("tabNew"));
tabs.onRemoved.addListener((tabId) => {
  lastLoading.delete(tabId);
  playEvent("tabClose");
});

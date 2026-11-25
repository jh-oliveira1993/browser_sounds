# IE Classic Sounds

A Chrome / Chromium Manifest V3 extension based on [LordLuceus/chrome-ui-sounds](https://github.com/LordLuceus/chrome-ui-sounds) that plays classic **Internet Explorer** sounds for browser navigation and tab events.

## Sound Packs & Event Mapping

| Event Key | Browser Trigger | `ie6` (Internet Explorer 6 / Windows XP — default) | `ie7` (Internet Explorer 7–9 / Windows Vista & 7) |
|---|---|---|---|
| `navigationStart` | Page navigation starts (`status === "loading"`) | `Windows XP Start.wav` | `Windows Navigation Start.wav` |
| `tabNew` | New tab created | `Windows XP Information Bar.wav` | `Windows Information Bar.wav` |
| `tabSwitch` | Active tab switched | `Windows XP Menu Command.wav` | `Windows Feed Discovered.wav` |
| `tabClose` | Tab closed | `Windows XP Pop-up Blocked.wav` | `Windows Pop-up Blocked.wav` |

## Installation in Chrome (Developer Mode)

1. Download or clone this repository.
2. Open `chrome://extensions` in Google Chrome or a Chromium-based browser.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the root folder of this repository (containing `manifest.json`).

## Options

Open the options page (localized in `pt-BR`) via the extension's **Options** menu to:

- Switch between the **Internet Explorer 6 (Windows XP)** and **Internet Explorer 7–9 (Windows Vista/7)** sound packs.
- Adjust the global volume.
- Enable/disable, adjust volume, and preview ("Testar som") each event sound individually.
- Save or reset all settings to defaults.

## Differences from Upstream (`chrome-ui-sounds`)

- **IE classic sound packs:** replaced the `default` and `nostromo` sound packs with `ie6` (Windows XP) and `ie7` (Windows Vista/7) Internet Explorer sound schemes.
- **Navigation-only click (`navigationStart`):** instead of triggering `tabUpdate` on every `tabs.onUpdated` event (title, favicon, etc.), the navigation click fires only when `changeInfo.status === "loading"` with a 300 ms per-tab debounce.
- **Settings-ready race fix:** `background.js` awaits the initial `chrome.storage.sync.get(null)` promise before playing the first sound after service-worker wake-up.
- **Volume clamping:** effective volume (`globalVolume * specificVolume`) is clamped to `[0, 1]`.
- **Enhanced options preview & `pt-BR` UI:** the **Testar som** button honors the currently selected sound pack and the effective global × per-event volume; options UI and manifest description are localized in `pt-BR`.

## Credits & Licensing

- Extension code is derived from [LordLuceus/chrome-ui-sounds](https://github.com/LordLuceus/chrome-ui-sounds) under the **MIT License** — see [LICENSE](LICENSE).
- The `.wav` sound files in `sounds/` are **© Microsoft Corporation** and are **not** covered by the MIT License. See [sounds/SOURCES.md](sounds/SOURCES.md) for file provenance, SHA-256 hashes, and copyright details.

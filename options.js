const { storage } = chrome;

const DEFAULT_PACK = "ie6";
const settingsSync = {};

const globalVolumeElement = document.querySelector("#globalVolume");
storage.sync.get("globalVolume", (result) => {
  if (result.globalVolume !== undefined) {
    globalVolumeElement.value = result.globalVolume * 100;
  }
});
globalVolumeElement.addEventListener("change", (event) => {
  settingsSync.globalVolume = parseFloat(event.target.value) / 100;
});

const soundpackSelector = document.querySelector("#soundpack");
storage.sync.get("soundpack", (result) => {
  if (result.soundpack) {
    soundpackSelector.value = result.soundpack;
  }
});
soundpackSelector.addEventListener("change", (e) => {
  settingsSync.soundpack = e.target.value;
});

const saveOptions = (options) => {
  options.forEach((element, index) => {
    const key = element.parentElement.id;
    if (index === 0) {
      storage.sync.get(`${key}Enabled`, (result) => {
        if (result[key + "Enabled"] === false) {
          element.checked = false;
        }
      });
    } else if (index === 1) {
      storage.sync.get(`${key}Volume`, (result) => {
        if (result[key + "Volume"] !== undefined) {
          element.value = result[key + "Volume"] * 100;
        }
      });
    }
    element.addEventListener("change", (event) => {
      if (index === 0) {
        settingsSync[key + "Enabled"] = event.target.checked;
      } else if (index === 1) {
        settingsSync[key + "Volume"] = parseFloat(event.target.value) / 100;
      }
    });
  });
};

const populateOptionsArray = (optionGroup) => {
  return [
    optionGroup.querySelector(".toggle"),
    optionGroup.querySelector(".volume"),
  ];
};

const executeOptions = (optionGroup) => {
  const options = populateOptionsArray(optionGroup);
  saveOptions(options);
};

executeOptions(document.querySelector("#navigationStart"));
executeOptions(document.querySelector("#tabSwitch"));
executeOptions(document.querySelector("#tabNew"));
executeOptions(document.querySelector("#tabClose"));

const testButtons = document.querySelectorAll(".test");
testButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const section = e.target.parentElement;
    const sound = section.id;
    const pack = soundpackSelector.value || DEFAULT_PACK;
    const globalVol = parseFloat(globalVolumeElement.value) / 100;
    const sectionVol = parseFloat(section.querySelector(".volume").value) / 100;
    const audio = new Audio(`sounds/${pack}/${sound}.wav`);
    audio.volume = Math.min(1, Math.max(0, globalVol * sectionVol));
    audio.play();
  });
});

document.querySelector("#save").addEventListener("click", () => {
  storage.sync.set({ ...settingsSync });
  const saveConfirm = document.querySelector("#save-confirm");
  saveConfirm.style.display = "block";
  saveConfirm.textContent = "Opções salvas.";
  document.querySelector("#reset-confirm").style.display = "none";
});

document.querySelector("#reset").addEventListener("click", () => {
  storage.sync.clear();
  for (const prop in settingsSync) {
    delete settingsSync[prop];
  }
  soundpackSelector.value = DEFAULT_PACK;
  const volumeSliders = document.querySelectorAll("input[type='range']");
  volumeSliders.forEach((element) => {
    element.value = element.dataset.default;
  });
  const toggles = document.querySelectorAll("input[type='checkbox']");
  toggles.forEach((element) => {
    element.checked = true;
  });
  const resetConfirm = document.querySelector("#reset-confirm");
  resetConfirm.style.display = "block";
  resetConfirm.textContent = "Opções restauradas.";
  document.querySelector("#save-confirm").style.display = "none";
});

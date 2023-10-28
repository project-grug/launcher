import { invoke } from "@tauri-apps/api";
import { SettingsManager, Settings } from "./SettingsManager";
export function init() {
  let settingsManager = new SettingsManager();
  invoke("get_settings_command").then((data) => {
    const settings = data as Settings;
    console.log(settings);
    settingsManager.setSettings(settings);
  });
  return settingsManager;
}

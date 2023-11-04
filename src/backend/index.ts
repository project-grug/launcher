import { SettingsManager } from "./SettingsManager";
export function init() {
  let settingsManager = new SettingsManager();
  settingsManager.getSettings(true);
  return settingsManager;
}

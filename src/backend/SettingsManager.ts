import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

enum Theme {
  Dark = "Dark",
  Light = "Light",
  System = "System",
}
type Account = {
  name: string;
  phoneNumber: string;
};
interface Settings {
  accounts: Account[];
  theme: Theme;
}
class SettingsManager {
  private settings: Settings;
  constructor(settings?: Settings) {
    this.settings = settings || {
      accounts: [],
      theme: Theme.System,
    };
    // update the current theme to match the saved theme
    document.body.classList.remove("mocha");
    this.setTheme(this.settings.theme);
  }
  getSettings() {
    return this.settings;
  }
  async getSystemTheme() {
    return await appWindow.theme();
  }
  saveSettings() {
    invoke("save_settings_command", { data: this.settings });
  }
  setSettings(settings: Settings) {
    this.settings = settings;
    // update the current theme to match the saved theme
    document.body.classList.remove("mocha");
    this.setTheme(this.settings.theme);
  }
  addAccount(account: Account) {
    this.settings.accounts.push(account);
  }
  removeAccount(account: Account) {
    this.settings.accounts = this.settings.accounts.filter(
      (item) => item !== account
    );
  }
  getTheme() {
    return this.settings.theme;
  }
  async setTheme(theme: Theme) {
    console.log(`setting theme to ${theme}`);
    const systemTheme = await this.getSystemTheme();
    if (this.settings.theme === Theme.Dark) {
      document.body.classList.remove("mocha");
    } else if (this.settings.theme === Theme.Light) {
      document.body.classList.remove("latte");
    } else {
      if (systemTheme === "light") {
        document.body.classList.remove("latte");
      } else {
        document.body.classList.remove("mocha");
      }
    }
    this.settings.theme = theme;
    if (this.settings.theme === Theme.Dark) {
      document.body.classList.add("mocha");
    } else if (this.settings.theme === Theme.Light) {
      document.body.classList.add("latte");
    } else {
      if (systemTheme === "light") {
        document.body.classList.add("latte");
      } else {
        document.body.classList.add("mocha");
      }
    }
  }
}
export { SettingsManager, Theme, type Account, type Settings };

import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

enum Theme {
  Dark = "Dark",
  Light = "Light",
  System = "System",
}
type SteamAccount = {
  username: string;
  steamId: string;
  profileUrl: string;
  avatar: string;
};
type Account = {
  name: string;
  phoneNumber: string;
};
interface Settings {
  subRosaAccounts: Account[];
  steamAccount?: SteamAccount;
  theme: Theme;
}
class SettingsManager {
  private settings!: Settings;
  constructor(settings?: Settings) {
    this.setSettings(
      settings || {
        subRosaAccounts: [],
        theme: Theme.System,
      }
    );
  }
  /**
   * Gets the settings object stored in the settings manager
   * @param forceReload Whether to ignore cache and re-read from filesystem
   * @returns Settings
   */
  async getSettings(forceReload?: boolean) {
    if (forceReload) {
      return new Promise<Settings>((resolve, reject) => {
        invoke("get_settings_command").then(
          (data) => {
            const settings = data as Settings;
            console.log(settings);
            this.setSettings(settings);
            resolve(this.settings);
          },
          (reason) => reject(reason)
        );
      });
    } else {
      return this.settings;
    }
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
  /**
   * Open the settings file / folder
   * @param openFolder Whether to open the settings folder or the settings file
   */
  openSettings(openFolder?: boolean) {
    if (openFolder) {
      invoke("open_settings_folder_command");
    } else {
      invoke("open_settings_command");
    }
  }
  addAccount(account: Account) {
    this.settings.subRosaAccounts.push(account);
  }
  removeAccount(account: Account) {
    this.settings.subRosaAccounts = this.settings.subRosaAccounts.filter(
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

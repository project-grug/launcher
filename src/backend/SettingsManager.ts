import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import AccountManager, { Account, SteamAccount } from "./AccountManager";
enum Theme {
  Dark = "Dark",
  Light = "Light",
  System = "System",
}

interface Settings {
  sub_rosa_accounts: Account[];
  steam_account?: SteamAccount;
  theme: Theme;
}
class SettingsManager {
  private settings!: Settings;
  accountManager: AccountManager;
  constructor(settings?: Settings) {
    this.setSettings(
      settings || {
        sub_rosa_accounts: [],
        theme: Theme.System,
      },
      true
    );
    this.accountManager = new AccountManager(this);
    this.accountManager.updateAccounts(this.settings);
  }
  getSettings(forceReload: boolean): Promise<Settings>;
  getSettings(): Settings;
  /**
   * Gets the settings object stored in the settings manager
   * @param forceReload Whether to ignore cache and re-read from filesystem. Just the presence of this boolean is enough to trigger a reload.
   * @returns Settings or Promise<Settings> in case of forceReload
   */
  getSettings(forceReload?: unknown): unknown {
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
    return invoke("save_settings_command", { data: this.settings });
  }
  /**
   * Sets the current settings to the provided object
   * @param settings The Settings Object
   * @param skipAccountUpdates Whether to skip notifying the account manager of account updates. Useful in only one case (at startup)
   */
  setSettings(settings: Settings, skipAccountUpdates?: boolean) {
    this.settings = settings;
    // update the current theme to match the saved theme
    document.body.classList.remove("mocha");
    if (skipAccountUpdates === false || skipAccountUpdates === undefined) {
      this.accountManager.updateAccounts(this.settings);
    }
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

  // Integration with AccountManager
  // Don't use this anywhere else pls
  setAccounts(accounts: Account[]) {
    this.settings.sub_rosa_accounts = accounts;
  }
  setSteamAccount(steamAccount: SteamAccount) {
    this.settings.steam_account = steamAccount;
  }
}
export { SettingsManager, Theme, type Account, type Settings };

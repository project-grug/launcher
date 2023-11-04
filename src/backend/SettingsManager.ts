import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

enum Theme {
  Dark = "Dark",
  Light = "Light",
  System = "System",
}
type SteamAccount = {
  username: string;
  steam_id: string;
  profile_url: string;
  avatar: string;
};
type Account = {
  name: string;
  phone_number: string;
  main_account: boolean;
  active_account: boolean;
};
interface Settings {
  sub_rosa_accounts: Account[];
  steam_account?: SteamAccount;
  theme: Theme;
}
class SettingsManager {
  private activeAccountChangeCallbacks: Array<(account: Account) => void> = [];
  private universalPhoneNumber?: string;
  private settings!: Settings;
  constructor(settings?: Settings) {
    this.setSettings(
      settings || {
        sub_rosa_accounts: [],
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
    return invoke("save_settings_command", { data: this.settings });
  }
  setSettings(settings: Settings) {
    this.settings = settings;
    // update the current theme to match the saved theme
    document.body.classList.remove("mocha");
    const activeAccount = this.getActiveAccount();
    if (activeAccount) {
      this.setAccountActive(activeAccount);
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
  getSteamAccount() {
    return this.settings.steam_account;
  }
  getAccounts() {
    return this.settings.sub_rosa_accounts;
  }
  addAccount(account: Account) {
    // check whether other accounts of this name exist
    const foundAcc = this.settings.sub_rosa_accounts.find((acc) => {
      if (acc.name === account.name) return true;
    });
    if (foundAcc) {
      return false;
    }
    this.settings.sub_rosa_accounts.push(account);
    return true;
  }
  removeAccount(account: Account) {
    this.settings.sub_rosa_accounts = this.settings.sub_rosa_accounts.filter(
      (item) => item !== account
    );
  }
  getMainAccount() {
    return this.settings.sub_rosa_accounts.find((acc) => {
      console.log(acc);
      if (acc.main_account) {
        console.log("found main account of name " + acc.name);
        return true;
      }
    });
  }
  getActiveAccount() {
    return this.settings.sub_rosa_accounts.find((acc) => {
      console.log(acc);
      if (acc.active_account) {
        console.log("found active account of name " + acc.name);
        return true;
      }
    });
  }
  setAccountActive(account: Account) {
    // janky but works, though this does mean you can't have
    // two accounts with the same name, this shouldn't be allowed
    // anyway so it doesn't matter.
    console.log(account);
    this.settings.sub_rosa_accounts.forEach((acc) => {
      if (account.name === acc.name) {
        acc.active_account = true;
        this.activeAccountChangeCallbacks.forEach((fn) => {
          fn(acc);
        });
      } else {
        acc.active_account = false;
      }
    });
  }
  /**
   *
   * @param fn Callback
   * @returns The ID of this callback
   */
  addAccountActiveCallback(fn: (account: Account) => void) {
    return this.activeAccountChangeCallbacks.push(fn);
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

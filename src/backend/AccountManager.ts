import { Settings, SettingsManager } from "./SettingsManager";

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
class AccountManager {
  activeAccountChangeCallbacks: Array<(account: Account) => void> = [];
  sub_rosa_accounts: Account[] = [];
  steam_account?: SteamAccount;
  settingsManager: SettingsManager;
  constructor(settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
    this.updateAccounts(this.settingsManager.getSettings());
  }
  updateAccounts(settings: Settings) {
    this.sub_rosa_accounts = settings.sub_rosa_accounts;
    this.steam_account = settings.steam_account;
    // notify of account active update
    this.sub_rosa_accounts.forEach((acc) => {
      if (acc.active_account) {
        this.activeAccountChangeCallbacks.forEach((fn) => {
          fn(acc);
        });
      }
    });
  }
  getSteamAccount() {
    return this.steam_account;
  }
  getAccounts() {
    return this.sub_rosa_accounts;
  }
  addAccount(account: Account) {
    // check whether other accounts of this name exist
    const foundAcc = this.sub_rosa_accounts.find((acc) => {
      if (acc.name === account.name) return true;
    });
    if (foundAcc) {
      return false;
    }
    this.sub_rosa_accounts.push(account);
    this.settingsManager.setAccounts(this.sub_rosa_accounts);
    return true;
  }
  removeAccount(account: Account) {
    this.sub_rosa_accounts = this.sub_rosa_accounts.filter(
      (item) => item !== account
    );
    this.settingsManager.setAccounts(this.sub_rosa_accounts);
  }
  getMainAccount() {
    return this.sub_rosa_accounts.find((acc) => {
      console.log(acc);
      if (acc.main_account) {
        console.log("found main account of name " + acc.name);
        return true;
      }
    });
  }
  getActiveAccount() {
    return this.sub_rosa_accounts.find((acc) => {
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
    this.sub_rosa_accounts.forEach((acc) => {
      if (account.name === acc.name) {
        acc.active_account = true;
        this.activeAccountChangeCallbacks.forEach((fn) => {
          fn(acc);
        });
      } else {
        acc.active_account = false;
      }
    });
    this.settingsManager.setAccounts(this.sub_rosa_accounts);
  }
  /**
   *
   * @param fn Callback
   * @returns The ID of this callback
   */
  addAccountActiveCallback(fn: (account: Account) => void) {
    return this.activeAccountChangeCallbacks.push(fn);
  }
}
export default AccountManager;
export type { Account, SteamAccount };

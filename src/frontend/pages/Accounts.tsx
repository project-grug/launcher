import { invoke } from "@tauri-apps/api";
import { For, Show, batch, createSignal, onCleanup } from "solid-js";
import { settingsManager } from "../..";
import { grugApiUrl } from "../..";

export function Player(props: {
  name: string;
  phone: string;
  activeAccount?: boolean;
  mainAccount?: boolean;
  editProperties?: boolean;
  editCallback?: () => void;
}) {
  // To-Do: Fetch player preview image from server using phone number
  return (
    <div class={`flex flex-row ${props.activeAccount ? "bg-surface0" : ""} `}>
      <img
        alt="Player Preview"
        src={`${grugApiUrl}/avatar/thumbnail?i=${props.phone}`}
        class="w-16 h-16"
      ></img>
      <div class="flex flex-col mx-2">
        <p class="font-bold text-xl">{props.name}</p>{" "}
        <p class="text-overlay2">{props.phone}</p>
      </div>
      <Show
        when={props.activeAccount || props.mainAccount || props.editProperties}
      >
        <Show when={props.activeAccount || props.mainAccount}>
          <div class="flex flex-col text-xs">
            Details:
            <Show when={props.mainAccount}>
              <p>Main Account</p>
            </Show>
            <Show when={props.activeAccount}>
              <p>Active Account</p>
            </Show>
          </div>
        </Show>
        <Show when={props.editProperties && props.activeAccount !== true}>
          <div class="grid grid-row-3 mx-2">
            {/* This is disgusting, but it works... */}
            <div></div>
            <button
              class="bg-base px-2 rounded-xl"
              onClick={props.editCallback}
            >
              Set Active
            </button>
            <div></div>
          </div>
        </Show>
      </Show>
    </div>
  );
}

function SteamAccount(props: {
  image: string;
  username: string;
  steam_id: string;
  url: string;
}) {
  return (
    <a href={props.url} target="_blank" class="flex flex-row">
      <img alt="Profile Picture" src={props.image} class="w-16 h-16"></img>
      <div class="flex flex-col mx-2">
        <p class="font-bold text-xl">{props.username}</p>
        <p class="text-overlay2">{props.steam_id}</p>
      </div>
    </a>
  );
}
export default function () {
  const [steamAccount, setSteamAccount] = createSignal(
    settingsManager.getSteamAccount()
  );
  const [accounts, setAccounts] = createSignal(settingsManager.getAccounts(), {
    /*
    equals: (prev, next) => {
      return false;
      // when return false: update, when return true: not update.
      console.log(prev);
      console.log(next);
      let isEqual = true;
      if (prev.length !== next.length) {
        console.log("different length");
        isEqual = false;
      }
      prev.forEach((account, index) => {
        const newAccount = next[index];
        console.log(account);
        console.log(newAccount);
        if (
          account.active_account !== newAccount.active_account ||
          account.main_account !== newAccount.main_account ||
          account.name !== newAccount.name ||
          account.phone_number !== newAccount.phone_number
        ) {
          console.log("account has discrepancies");
          isEqual = false;
        }
      });
      console.log("Updating? " + !isEqual);
      return isEqual;
    },
    */
  });
  onCleanup(() => settingsManager.saveSettings());
  return (
    <div class="pt-8">
      <h1 class="text-center text-2xl tracking-wider font-bold pb-4">
        Accounts
      </h1>
      <section class="pl-4">
        <h2 class=" font-bold pb-2 tracking-wide">Account List</h2>
        <div class="bg-crust px-4 py-4">
          <Show
            when={steamAccount()}
            fallback={
              <div>
                You do not have a linked steam account, do you want to link one
                now?
                <button
                  class="bg-base rounded-xl py-1 px-2"
                  onClick={async () => {
                    console.log("invoking");
                    await invoke("open_auth_window_command");
                    const newSettings = await settingsManager.getSettings(true);
                    batch(() => {
                      setSteamAccount(newSettings.steam_account);
                      setAccounts(newSettings.sub_rosa_accounts);
                    });
                  }}
                >
                  Click here to link your account
                </button>
              </div>
            }
          >
            <div>
              <h3 class="text-xs font-bold">Steam Account</h3>
              <SteamAccount
                image={steamAccount()!.avatar}
                username={steamAccount()!.username}
                steam_id={steamAccount()!.steam_id}
                url={steamAccount()!.profile_url}
              ></SteamAccount>
            </div>
            <h4 class="text-xs font-bold pt-4">Sub Rosa Accounts</h4>
            <For each={accounts()}>
              {(account) => {
                return (
                  <Player
                    name={account.name}
                    phone={account.phone_number}
                    mainAccount={account.main_account}
                    activeAccount={account.active_account}
                    editProperties={true}
                    editCallback={async () => {
                      settingsManager.setAccountActive(account);
                      const settings = await settingsManager.getSettings();
                      console.log(settings);
                      setAccounts(settings.sub_rosa_accounts);
                      await settingsManager.saveSettings();
                      // what have i brought upon this cursed land
                      // i have a solid reason for this:
                      // i don't know why, but things were not updating
                      // when i used setAccounts, so this is a workaround
                      // that just reloads the page so it grabs the
                      // accounts again...
                      location.reload();
                    }}
                  ></Player>
                );
              }}
            </For>
            <button
              class="bg-base py-1 px-2 rounded-xl mt-4"
              onClick={() => {
                // to-do: add account functionality
              }}
            >
              Add Account
            </button>
          </Show>
        </div>
      </section>
    </div>
  );
}

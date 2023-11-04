import { invoke } from "@tauri-apps/api";
import { For, Show, batch, createSignal, onCleanup } from "solid-js";
import { settingsManager, grugApiUrl } from "../..";
import Player from "../components/Player";
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
function PlayerPreview(props: { phone: string; callback: () => void }) {
  return (
    <div class={`flex flex-row bg-surface1`}>
      <img
        alt="Player Preview"
        src={`${grugApiUrl}/avatar/thumbnail?i=${props.phone}`}
        class="w-16 h-16"
      ></img>
      <div class="flex flex-col mx-2">
        <input
          class="font-bold text-xl"
          maxLength={32}
          id="player-name-input"
        ></input>
        <p class="text-overlay2">{props.phone}</p>
      </div>
      <div class="grid grid-row-3 mx-2">
        {/* This is disgusting, but it works... */}
        <div></div>
        <button class="bg-base px-2 rounded-xl" onClick={props.callback}>
          Save Account
        </button>
        <div></div>
      </div>
    </div>
  );
}
export default function () {
  const [steamAccount, setSteamAccount] = createSignal(
    settingsManager.getSteamAccount()
  );
  const [accounts, setAccounts] = createSignal(settingsManager.getAccounts());
  const [makingAccount, setMakingAccount] = createSignal(false);
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
            <Show when={makingAccount()}>
              <PlayerPreview
                phone={settingsManager.getMainAccount()!.phone_number}
                callback={async () => {
                  const input = document.querySelector(
                    "#player-name-input"
                  ) as HTMLInputElement;
                  if (input.value.length === 0) return false;
                  if (
                    settingsManager.addAccount({
                      name: input.value,
                      phone_number:
                        settingsManager.getMainAccount()!.phone_number,
                      main_account: false,
                      active_account: false,
                    })
                  ) {
                    setMakingAccount(false);
                    setAccounts(settingsManager.getAccounts());
                    await settingsManager.saveSettings();
                    location.reload();
                  } else {
                    // error happened (name already exists)
                    // to-do: warn user about this
                  }
                }}
              ></PlayerPreview>
            </Show>
            <button
              class="bg-base py-1 px-2 rounded-xl mt-4"
              onClick={() => {
                if (!makingAccount()) {
                  setMakingAccount(true);
                }
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

import { invoke } from "@tauri-apps/api";
import { For, Show, createSignal } from "solid-js";
import { settingsManager } from "../..";
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
export default function () {
  const [steamAccount, setSteamAccount] = createSignal(
    settingsManager.getSteamAccount()
  );
  const [accounts, setAccounts] = createSignal(settingsManager.getAccounts());
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
                  onClick={async () => {
                    console.log("invoking");
                    await invoke("open_auth_window_command");
                    const newSettings = await settingsManager.getSettings(true);
                    setSteamAccount(newSettings.steam_account);
                    setAccounts(newSettings.sub_rosa_accounts);
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
          </Show>
          <h4 class="text-xs font-bold pt-4">Sub Rosa Accounts</h4>
          <For each={accounts()}>
            {(account) => {
              return (
                <Player
                  name={account.name}
                  phone={account.phone_number}
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
        </div>
      </section>
    </div>
  );
}

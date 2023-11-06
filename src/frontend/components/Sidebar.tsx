import { Show, createSignal } from "solid-js";
import Player from "./Player";
import { A } from "@solidjs/router";
import { Icon } from "solid-heroicons";
import { cog } from "solid-heroicons/solid";
import { settingsManager } from "../..";
function getIsButtonActive(buttonIndex: number, activeButton: number) {
  return buttonIndex === activeButton;
}
function SidebarButton(props: {
  href: string;
  active: boolean;
  text?: string;
  children?: string;
  callback?: () => void;
}) {
  return (
    <A
      href={props.href}
      class={` ${
        props.active ? "bg-base brightness-125" : ""
      } hover:bg-crust hover:brightness-100 mx-2 py-2 rounded-xl max-w-[10rem] text-center transition-colors duration-200`}
      onClick={props.callback}
    >
      {props.text !== undefined ? props.text : props.children}
    </A>
  );
}

export default function () {
  const accountManager = settingsManager.accountManager;
  const [activeButton, setActiveButton] = createSignal(0);
  const [activeAccount, setActiveAccount] = createSignal(
    accountManager.getActiveAccount()
  );
  accountManager.addAccountActiveCallback((account) =>
    setActiveAccount(account)
  );
  return (
    <div class="h-screen max-h-full flex fixed top-0 flex-col w-64 gap-y-4 bg-mantle">
      <h1 class="text-xl font-bold tracking-wider mx-4 mt-4">Project Greg</h1>
      <SidebarButton
        href="/"
        active={getIsButtonActive(0, activeButton())}
        callback={() => setActiveButton(0)}
      >
        Home
      </SidebarButton>
      <SidebarButton
        href="/player-search"
        active={getIsButtonActive(1, activeButton())}
        callback={() => setActiveButton(1)}
      >
        Player Search
      </SidebarButton>
      <SidebarButton
        href="/server-list"
        active={getIsButtonActive(2, activeButton())}
        callback={() => setActiveButton(2)}
      >
        Server List
      </SidebarButton>
      <div class="fixed bottom-0 left-0 flex flex-row">
        {/* To-Do: Accounts Page */}
        <A
          href="/accounts"
          onClick={() => {
            setActiveButton(9);
          }}
          class="pl-4"
        >
          <Show
            when={activeAccount()}
            fallback={
              <div class="text-sm">
                <p>You don't have an active account.</p>
                <p>Click here to select one.</p>
              </div>
            }
          >
            <Player
              name={activeAccount()!.name}
              phone={activeAccount()!.phone_number}
              truncateName={true}
            ></Player>
          </Show>
        </A>
        {/* To-Do: Settings Page */}
        <A
          href="/settings"
          class="flex justify-end"
          onClick={() => {
            setActiveButton(10);
          }}
        >
          <Icon path={cog} class="w-8"></Icon>
        </A>
      </div>
    </div>
  );
}

import { createSignal } from "solid-js";
import SidebarButton from "./SidebarButton";
import Player from "./Player";
import { A } from "@solidjs/router";
import { Icon } from "solid-heroicons";
import { cog } from "solid-heroicons/solid";
function getIsButtonActive(buttonIndex: number, activeButton: number) {
  return buttonIndex === activeButton;
}
export default function () {
  const [activeButton, setActiveButton] = createSignal(0);
  return (
    <div class="h-screen max-h-full flex fixed top-0 flex-col w-64 gap-y-4 bg-mantle">
      <h1 class="text-xl font-bold tracking-wider mx-4 mt-4">Project Greg</h1>
      <SidebarButton
        href="/"
        active={getIsButtonActive(0, activeButton())}
        callback={() => {
          setActiveButton(0);
        }}
      >
        Home
      </SidebarButton>
      <div class="fixed bottom-0 left-0 flex flex-row">
        {/* To-Do: Accounts Page */}
        <A href="/accounts">
          <Player name="morbius" phone="3190880"></Player>
        </A>
        {/* To-Do: Settings Page */}
        <A href="/settings" class="flex justify-end">
          <Icon path={cog} class="w-8"></Icon>
        </A>
      </div>
    </div>
  );
}

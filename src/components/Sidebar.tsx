import { createSignal } from "solid-js";
import SidebarButton from "./SidebarButton";
function getIsButtonActive(buttonIndex: number, activeButton: number) {
  return buttonIndex === activeButton;
}
export default function () {
  const [activeButton, setActiveButton] = createSignal(0);
  return (
    <div class="h-screen max-h-full flex flex-col w-64 gap-y-4 bg-mantle">
      <h1 class="text-xl font-bold tracking-wider mx-2 mt-4">Project Greg</h1>
      <SidebarButton
        href="/"
        active={getIsButtonActive(0, activeButton())}
        callback={() => {
          setActiveButton(0);
        }}
      >
        Home
      </SidebarButton>
    </div>
  );
}

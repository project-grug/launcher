import { Show } from "solid-js";
import { grugApiUrl } from "../..";
import { Icon } from "solid-heroicons";
import { trash } from "solid-heroicons/solid";

export default function (props: {
  name: string;
  phone: string;
  truncateName?: boolean;
  activeAccount?: boolean;
  mainAccount?: boolean;
  editProperties?: boolean;
  deleteCallback?: () => void;
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
        <p
          class={`font-bold text-xl ${
            props.truncateName ? "text-ellipsis truncate max-w-[118px] " : ""
          }`}
        >
          {props.name}
        </p>{" "}
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
        <Show when={props.editProperties}>
          <Show when={!props.activeAccount}>
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
            <Show when={!props.mainAccount}>
              <div class="grid grid-row-3 mx-2">
                {/* This is disgusting, but it works... */}
                <div></div>
                <button onClick={props.deleteCallback}>
                  <Icon path={trash} class="w-8"></Icon>
                </button>
                <div></div>
              </div>
            </Show>
          </Show>
        </Show>
      </Show>
    </div>
  );
}

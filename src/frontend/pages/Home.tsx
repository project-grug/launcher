import { invoke } from "@tauri-apps/api";
import { createResource, onCleanup } from "solid-js";
import { grugApiUrl, jpxsApiUrl, settingsManager } from "../..";

function ServerStatus(props: { ip: string; name: string }) {
  const [status, { refetch }] = createResource(async () => {
    try {
      const response = await fetch(props.ip);
      if (response.status >= 400 && response.status < 500) {
        console.log("400 range status, is down.");
        return false;
      }
      return true;
    } catch {
      console.log("errored, is down.");
      return false;
    }
  });
  // check status every 5 minutes
  const timer = setTimeout(() => refetch, 300000);
  onCleanup(() => clearTimeout(timer));
  return (
    <div class={`py-1 w-32 text-left`}>
      <p class="inline pl-4">{props.name}</p>
      <div
        class={`rounded-full ${
          status() ? `bg-green` : `bg-red`
        } inline px-2 py-[-1rem] ml-1`}
      ></div>
    </div>
  );
}
export default function () {
  return (
    <div class="pt-8">
      <div class="text-center">
        <h1 class="text-2xl tracking-wider font-bold pb-4">Project Greg</h1>
        <section>
          less infomration i guess
          {/* Server Status Section */}
          <div class="rounded-xl absolute right-0 mr-12 bg-crust">
            <ServerStatus
              ip={`${grugApiUrl}/status`}
              name="grug api"
            ></ServerStatus>
            <ServerStatus ip={jpxsApiUrl} name="jpxs api"></ServerStatus>
            <ServerStatus ip="https://jpxs.io/" name="website"></ServerStatus>
          </div>
        </section>
      </div>
    </div>
  );
}

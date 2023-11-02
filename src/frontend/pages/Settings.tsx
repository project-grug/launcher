import { createSignal, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { settingsManager } from "../..";
import { Theme } from "../../backend/SettingsManager";
export default function () {
  const [theme, setTheme] = createSignal(settingsManager.getTheme());
  // save settings on leave
  onCleanup(() => {
    settingsManager.saveSettings();
  });
  return (
    <div class="text-center mx-4">
      <h1 class="text-2xl font-bold tracking-wider my-3 text-text">Settings</h1>
      <section class="text-left text-subtext1">
        <h2 class="text-xl font-bold tracking-wider my-4 text-text">
          <span class="text-2xl pr-1">·</span>General
        </h2>
        <label for="theme-select" class="block pb-2">
          Theme:
        </label>
        <select
          name="theme-select"
          class="text-black"
          onInput={(event) => {
            const theme = event.target.value as Theme;
            settingsManager.setTheme(theme);
            setTheme(theme);
          }}
        >
          <option value="Light" selected={theme() === Theme.Light}>
            Light
          </option>
          <option value="Dark" selected={theme() === Theme.Dark}>
            Dark
          </option>
          <option value="System" selected={theme() === Theme.System}>
            System Theme
          </option>
        </select>
      </section>
      <section class="text-left text-subtext1">
        <h2 class="text-xl font-bold tracking-wider my-4 text-text">
          <span class="text-2xl pr-1">·</span>Accounts
        </h2>
        <A href="/accounts" class="my-1 py-2 px-4 bg-crust rounded-xl">
          Open Accounts
        </A>
      </section>
      <section class="text-left my-4">
        <h2 class="text-xl font-bold tracking-wider my-4 text-text">
          <span class="text-2xl pr-1">·</span>Misc
        </h2>
        <button
          class="my-1 py-1 px-4 bg-crust rounded-xl block"
          onClick={() => settingsManager.openSettings(false)}
        >
          Open Settings (JSON)
        </button>
        <button
          class="my-1 py-1 px-4 bg-crust rounded-xl block"
          onClick={() => settingsManager.openSettings(true)}
        >
          Open Settings Folder
        </button>
        <button
          class="my-1 py-1 px-4 bg-crust rounded-xl"
          onClick={() => settingsManager.saveSettings()}
        >
          Save
        </button>
        <p class="text-subtext0 text-sm">
          Note: Modifying the settings file externally will not update it
          in-launcher. Restart the launcher in that case.
        </p>
      </section>
    </div>
  );
}

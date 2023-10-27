import { invoke } from "@tauri-apps/api";
enum Theme {
  Dark = "Dark",
  Light = "Light",
  System = "System",
}
type Account = {
  name: string;
  phoneNumber: string;
};
interface Settings {
  accounts: Account[];
  theme: Theme;
}
export async function init() {
  // initialize backend

  invoke("get_settings_command")
    .then((result) => {
      const settings = result as Settings;
      console.log(settings);
    })
    .catch((err) => {
      console.log(err);
    });
}

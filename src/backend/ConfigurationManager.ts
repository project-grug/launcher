import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

class Configuration {
  public theme: number = 0;
  constructor(data?: Object) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
class ConfigurationManager {
  public configuration: Configuration;
  constructor(configuration?: Configuration) {
    if (configuration) {
      this.configuration = configuration;
    } else {
      this.configuration = new Configuration();
    }
  }
  public async save() {
    return writeTextFile("app.conf", JSON.stringify(this.configuration), {
      dir: BaseDirectory.AppConfig,
    });
  }
  public async load() {
    this.configuration = new Configuration(
      JSON.parse(
        await readTextFile("app.conf", { dir: BaseDirectory.AppConfig })
      )
    );
    return this.configuration;
  }
}
export { ConfigurationManager, Configuration };

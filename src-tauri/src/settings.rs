use std::path::{Path, PathBuf};
use std::fs;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::get_base_dir;
#[derive(Serialize, Deserialize)]
pub enum Theme {
    Light,
    Dark,
    System,
}
#[derive(Serialize, Deserialize)]
pub struct Account {
    name: String,
    phone_number: String,
}
#[derive(Serialize, Deserialize)]
pub struct Settings {
    theme: Theme,
    accounts: Vec<Account>,
}
pub fn check_config_exists(path: &PathBuf) -> Result<(), std::io::Error> {
    if !Path::exists(path) {
      let accounts: Vec<Account> = vec![];
      let settings = Settings {
        theme: Theme::System,
        accounts: accounts,
      };
      save_settings(settings)
    } else {
      println!("file already exists");
      Ok(())
    }
}
pub fn get_settings_path() -> PathBuf {
    let base_dir = get_base_dir();
    let settings_path = base_dir.join("settings.json");
    return settings_path;
}
pub fn get_settings() -> Result<Settings, std::io::Error> {
    // To-Do: cache this result
    let config_path = get_settings_path();
    check_config_exists(&config_path).map_err(|e| e)?;
    let result= fs::read_to_string(config_path).map_err(|e| e)?;
    println!("getting json: {}", result.as_str());
    let settings: Settings = serde_json::from_str(result.as_str()).map_err(|e| e)?;
    Ok(settings.into())
}
pub fn save_settings(settings : Settings) -> Result<(), std::io::Error> {
    let config_path = get_settings_path();
    let json = json!(settings).to_string();
    println!("saving json: {}", json.as_str());
    match fs::write(config_path, json) {
        Ok(val) => {Ok(val)},
        Err(err) => { Err(err)},
    }
}

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

pub fn get_settings_path() -> PathBuf {
    let base_dir = get_base_dir();
    let settings_path = base_dir.join("settings.json");
    return settings_path;
}
pub fn get_settings() -> Result<Settings, String> {
    // To-Do: cache this result
    let config_path = get_settings_path();
    check_config_exists(&config_path).map_err(|err| err.to_string())?;
    let result= fs::read_to_string(config_path).map_err(|err| err.to_string())?;
    println!("{}", result.as_str());
    let settings: Settings = serde_json::from_str(result.as_str()).map_err(|err| err.to_string())?;
    Ok(settings.into())
}
pub fn check_config_exists(path: &PathBuf) -> Result<(), std::io::Error> {
    if !Path::exists(path) {
      let accounts: Vec<Account> = vec![];
      let json = json!({"theme": Theme::System, "accounts": accounts}).to_string();
      println!("saving json: {}", json.as_str());
      fs::write(path, json)
    } else {
      println!("file already exists");
      Ok(())
    }
}
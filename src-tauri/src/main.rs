// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::path::{Path, PathBuf};
use std::fs;
use serde::{Deserialize, Serialize};
use serde_json::json;
#[cfg(target_os = "windows")]
const HOMEDIR: &str = "APPDATA";

#[cfg(any(target_os = "macos", target_os = "linux"))]
const HOMEDIR: &str = "HOME";
#[cfg(debug_assertions)]
fn get_base_dir() -> PathBuf {
    let base_dir = PathBuf::from(std::env::var(HOMEDIR).unwrap());

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    return base_dir.join(".jpxs_launcher");

    #[cfg(target_os = "macos")]
    return base_dir
        .join("Library")
        .join("Application Support")
        .join("jpxs_launcher");
}
#[cfg(not(debug_assertions))]
fn get_default_client_dir() -> PathBuf {
    let base_dir = PathBuf::from(std::env::var(HOMEDIR).unwrap());

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    return base_dir.join(".glyph_launcher");

    #[cfg(target_os = "macos")]
    return base_dir
        .join("Library")
        .join("Application Support")
        .join("glyph_launcher");
}
#[derive(Serialize, Deserialize)]
enum Theme {
  Light,
  Dark,
  System,
}
#[derive(Serialize, Deserialize)]
struct Account {
  name: String,
  phone_number: String,
}
#[derive(Serialize, Deserialize)]
struct Settings {
  theme: Theme,
  accounts: Vec<Account>,
}
fn check_config_exists(path: &PathBuf) -> Result<(), std::io::Error> {
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
// Custom Commands
#[tauri::command]
async fn get_settings() -> Result<Settings, String> {
  let config_path = get_base_dir().join("settings.json");
  check_config_exists(&config_path).map_err(|err| err.to_string())?;
  let result= fs::read_to_string(config_path).map_err(|err| err.to_string())?;
  println!("{}", result.as_str());
  let settings: Settings = serde_json::from_str(result.as_str()).map_err(|err| err.to_string())?;
  Ok(settings.into())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_settings])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

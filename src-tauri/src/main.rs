// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::fs;
mod settings;
use settings::save_settings;

use crate::settings::{Settings, get_settings};

#[cfg(target_os = "windows")]
const HOMEDIR: &str = "APPDATA";

#[cfg(any(target_os = "macos", target_os = "linux"))]
const HOMEDIR: &str = "HOME";
fn get_base_dir() -> PathBuf {
    let home = PathBuf::from(std::env::var(HOMEDIR).unwrap());
    #[cfg(any(target_os = "windows", target_os = "linux"))]
    let base_dir = home.join(".jpxs_launcher");
    #[cfg(target_os = "macos")]
    let base_dir = home.join("Library").join("Application Support").join("jpxs_launcher");
    if !base_dir.exists() {
      fs::create_dir(&base_dir).expect("Could not create base directory");
    }
    return base_dir;
}

// Custom Commands
#[tauri::command]
async fn get_settings_command() -> Result<Settings, String> {
  let settings = get_settings().map_err(| err | err.to_string() );
  Ok(settings.unwrap())
}
#[tauri::command]
async fn save_settings_command(data: Settings) -> Result<(), String> {
  save_settings(data).map_err(| err | err.to_string())
}
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_settings_command])
    .invoke_handler(tauri::generate_handler![save_settings_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

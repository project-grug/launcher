// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use opener::open;
use std::path::PathBuf;
use std::fs;
mod auth;
use auth::{create_auth_window, wait_for_auth_info};
mod settings;
use settings::{save_settings, get_settings_path};

use crate::settings::{Settings, get_settings};

#[cfg(target_os = "windows")]
const HOMEDIR: &str = "APPDATA";

#[cfg(any(target_os = "macos", target_os = "linux"))]
const HOMEDIR: &str = "HOME";
fn get_base_dir() -> PathBuf {
    let home = PathBuf::from(std::env::var(HOMEDIR).unwrap());
    #[cfg(debug_assertions)]
    let jpxs_folder_name = "dev_jpxs_launcher";
    #[cfg(not(debug_assertions))]
    let jpxs_folder_name = "jpxs_launcher";
    #[cfg(any(target_os = "windows", target_os = "linux"))]
    let base_dir = home.join(jpxs_folder_name);
    #[cfg(target_os = "macos")]
    let base_dir = home.join("Library").join("Application Support").join(jpxs_folder_name);
    if !base_dir.exists() {
      fs::create_dir(&base_dir).expect("Could not create base directory");
    }
    return base_dir;
}

// Custom Commands
#[tauri::command]
async fn get_settings_command() -> Result<Settings, String> {
  get_settings().map_err(| err | err.to_string())
}
#[tauri::command]
async fn save_settings_command(data: Settings) -> Result<(), String> {
  save_settings(data).map_err(| err | err.to_string())
}
#[tauri::command]
async fn open_settings_command() -> Result<(), String> {
  open(get_settings_path()).map_err(| err | err.to_string())
}
#[tauri::command]
async fn open_settings_folder_command() -> Result<(), String> {
  open(get_base_dir()).map_err(| err | err.to_string())
}
#[tauri::command]
async fn open_auth_window_command(app: tauri::AppHandle) -> Result<(), String> {
  // Open window
  let auth_window = create_auth_window(app).map_err(| err | err.to_string()).unwrap();
  let _ = auth_window.show().map_err(| err | err.to_string()).unwrap();
  // Get response
  let auth_data = wait_for_auth_info(&auth_window).await;
  println!("found response! closing window.");
  let _ = auth_window.close().expect("could not close window");
  // to-do: do something with the auth data
  let old_settings = get_settings().unwrap();
  let new_settings = Settings{
    sub_rosa_accounts: old_settings.sub_rosa_accounts,
    theme: old_settings.theme,
    steam_account: auth_data
  };
  let _ = save_settings(new_settings).expect("failed to save settings");
  Ok(())
}

#[tokio::main]
async fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![save_settings_command, get_settings_command, open_settings_command, open_settings_folder_command, open_auth_window_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

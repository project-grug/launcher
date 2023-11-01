// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use opener::open;
use std::path::PathBuf;
use tokio::time::{sleep, Duration};
use std::fs;
mod settings;
use settings::{save_settings, get_settings_path};

use crate::settings::{Settings, get_settings};
struct AuthData {
  username: Option<String>,
  steam_id: Option<String>,
  profile_url: Option<String>,
  avatar: Option<String>,
}
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
  let auth_window = tauri::WindowBuilder::new(&app, 
    "auth", 
    tauri::WindowUrl::External("https://cityrp.jpxs.io/auth/login".parse().unwrap())
  ).title("Login")
  .resizable(false)
  .maximizable(false)
  .center()
  .always_on_top(true)
  .closable(true)
  .build()
  .expect("failed to make window");
  let result = auth_window.show().map_err(| err | err.to_string());
  if result.is_err() {
    return Err(result.unwrap_err().to_string());
  }
  // Get response
  let mut response: Option<AuthData> = None;
  while response.is_none() {
    sleep(Duration::from_secs(2)).await;
    let url = auth_window.url();
    let domain = url.domain();
    if domain.unwrap() == "cityrp.jpxs.io" && url.path() == "/auth/data"{
      let query = url.query_pairs();
      let iter = query.into_iter();
      let mut authdata = AuthData{
        username: None,
        steam_id: None,
        profile_url: None,
        avatar: None,
      };
      // constructing AuthData from query arguments
      for arg in iter {
        println!("arg0: {}, arg1: {}", arg.0, arg.1);
        if arg.0 == "username" {
          authdata.username = Some(arg.1.to_string());
        } else if arg.0 == "steamId" {
          authdata.steam_id = Some(arg.1.to_string());
        } else if arg.0 == "profileUrl" {
          authdata.profile_url = Some(arg.1.to_string());
        } else if arg.0 == "avatar" {
          authdata.avatar = Some(arg.1.to_string());
        }
      }
      response = Some(authdata);
    }
  }
  println!("found response! closing window.");
  let _ = auth_window.close().expect("could not close window");
  // to-do: do something with the auth data
  Ok(())
}

#[tokio::main]
async fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![save_settings_command, get_settings_command, open_settings_command, open_settings_folder_command, open_auth_window_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

use reqwest::Error;
use tokio::time::{sleep, Duration};
use serde::{Deserialize, Serialize};

use crate::settings::Account;

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct Player {
  pub name: String,
  pub gameId: i32,
  pub phoneNumber: i32,
  pub steamId: String
}

#[derive(Serialize, Deserialize)]
pub struct SuccessResponse {
  success: bool,
  players: Vec<Player>,
}
#[derive(Serialize, Deserialize)]
pub struct SteamAccount {
  pub username: Option<String>,
  pub steam_id: Option<String>,
  pub profile_url: Option<String>,
  pub avatar: Option<String>,
}
pub fn create_auth_window(app: tauri::AppHandle) -> Result<tauri::Window, tauri::Error> {
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
  let result = auth_window.show();
  if result.is_err() {
    return Err(result.unwrap_err());
  }
  return Ok(auth_window);
}
pub async fn wait_for_auth_info(window: &tauri::Window) -> Option<SteamAccount> {
    let mut response: Option<SteamAccount> = None;
    while response.is_none() {
      sleep(Duration::from_secs(2)).await;
      let url = window.url();
      let domain = url.domain();
      if domain.unwrap() == "cityrp.jpxs.io" && url.path() == "/auth/data"{
        let query = url.query_pairs();
        let iter = query.into_iter();
        let mut account = SteamAccount{
          username: None,
          steam_id: None,
          profile_url: None,
          avatar: None,
        };
        // constructing AuthData from query arguments
        for arg in iter {
          println!("arg0: {}, arg1: {}", arg.0, arg.1);
          if arg.0 == "username" {
            account.username = Some(arg.1.to_string());
          } else if arg.0 == "steamId" {
            account.steam_id = Some(arg.1.to_string());
          } else if arg.0 == "profileUrl" {
            account.profile_url = Some(arg.1.to_string());
          } else if arg.0 == "avatar" {
            account.avatar = Some(arg.1.to_string());
          }
        }
        response = Some(account);
      }
    }
    return response;
}
pub async fn get_subrosa_account_from_steam(account: &SteamAccount) -> Result<Account, Error> {
  let mut url = "https://jpxs.io/api/player/".to_owned();
  url.push_str(account.steam_id.as_ref().unwrap().as_str());
  let resp = reqwest::get(url).await?.json::<SuccessResponse>().await?;
  let player = resp.players.get(0).unwrap();
  let account = Account{
    name: player.name.to_owned(),
    phone_number: player.phoneNumber.to_string(),
  };
  return Ok(account);
}
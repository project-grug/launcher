use tokio::time::{sleep, Duration};

pub struct AuthData {
    username: Option<String>,
    steam_id: Option<String>,
    profile_url: Option<String>,
    avatar: Option<String>,
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
pub async fn wait_for_auth_info(window: &tauri::Window) -> Option<AuthData> {
    let mut response: Option<AuthData> = None;
    while response.is_none() {
      sleep(Duration::from_secs(2)).await;
      let url = window.url();
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
    return response;
}
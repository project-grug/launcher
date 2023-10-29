import { createSignal, Show, onCleanup } from "solid-js";
import { apiUrl } from "../..";
type player = {
  name: string;
  gameId: number;
  phoneNumber: number;
  firstSeen: string;
  lastSeen: string;
  steamId: string;
};

type response =
  | {
      success: true;
      error: string;
      searchMode: string;
      players: {
        0: player;
      };
    }
  | {
      success: false;
      error: string;
      searchMode: string;
    };
function dateToString(date: Date, relative?: boolean) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (relative) {
    const rtf1 = new Intl.RelativeTimeFormat("en", { style: "short" });
    if (new Date().getFullYear() - year > 0) {
      return rtf1.format(-(new Date().getFullYear() - year), "year");
    } else if (new Date().getMonth() + 1 - month > 0) {
      return rtf1.format(-(new Date().getMonth() + 1 - month), "month");
    } else if (new Date().getDate() - day > 0) {
      return rtf1.format(-(new Date().getDate() - day), "day");
    } else if (new Date().getHours() - date.getHours() > 0) {
      return rtf1.format(-(new Date().getHours() - date.getHours()), "hour");
    } else {
      return rtf1.format(
        -(new Date().getMinutes() - date.getMinutes()),
        "minute"
      );
    }
  }
  return `${month}/${day}/${year}`;
}
function Player(props: {
  name: string;
  gameId: number;
  phoneNumber: number;
  firstSeen: Date;
  lastSeen: Date;
  steamId: string;
}) {
  return (
    <div class="flex justify-center">
      <div class="bg-crust px-4 mx-2 my-2 w-72">
        <h1 class="text-2xl font-bold">{props.name}</h1>
        <h2>Phone Number: {props.phoneNumber}</h2>
        <h2>Game Id: {props.gameId}</h2>
        <h2>Steam ID: {props.steamId}</h2>
        <h2>First seen at {dateToString(props.firstSeen)}</h2>
        <h2>Last seen {dateToString(props.lastSeen, true)}</h2>
      </div>
    </div>
  );
}

export default function () {
  const [inputText, setInputText] = createSignal("");
  const [errorText, setErrorText] = createSignal("");
  // actually use this to see if the player's been acquired yet.
  const [playerSet, setPlayerSet] = createSignal(false);
  // necessary to set a placeholder value for the player, otherwise the IDE will bitch about it.
  const [playerInfo, setPlayerInfo] = createSignal<player>({
    name: "you should not be seeing this",
    gameId: 69,
    phoneNumber: 420,
    steamId: "1337",
    firstSeen: "2021-01-01T00:00:00.000Z",
    lastSeen: "2021-01-01T00:00:00.000Z",
  });
  onCleanup(() => {
    setPlayerSet(false);
  });
  return (
    <div class="py-4">
      <div class="flex justify-center">
        <h1 class="text-2xl py-2 px-2">Player Information</h1>
      </div>
      <div class="flex justify-center">
        <div class="flex items-center flex-col gap-6 sm:gap-0 sm:flex-row">
          <Show when={playerSet()}>
            <Player
              name={playerInfo().name}
              gameId={playerInfo().gameId}
              phoneNumber={playerInfo().phoneNumber}
              firstSeen={new Date(playerInfo().firstSeen)}
              lastSeen={new Date(playerInfo().lastSeen)}
              steamId={playerInfo().steamId}
            ></Player>
          </Show>
          <div class={`flex ${playerSet() ? `flex-col` : ``}`}>
            <input
              class="bg-crust mx-2"
              id="playerSearchInput"
              value={inputText()}
            ></input>
            <button
              onClick={async () => {
                const val = (
                  document.getElementById(
                    "playerSearchInput"
                  ) as HTMLInputElement
                ).value;
                const valEncoded = encodeURIComponent(val);
                setInputText(decodeURIComponent(val));

                fetch(`${apiUrl}/player/${valEncoded}`).then(function (
                  response
                ) {
                  response.json().then(function (json: response) {
                    console.log("gotten");
                    if (json.success) {
                      console.log(json);
                      setPlayerInfo(json.players[0]);
                      setPlayerSet(true);
                      setErrorText("");
                    } else {
                      setErrorText(
                        "Error fetching this name, try another! (" +
                          json.error +
                          ")"
                      );
                      setPlayerSet(false);
                    }
                  });
                });
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <Show when={!playerSet()}>
        <div class="flex justify-center">
          <h2 class="mx-2">{errorText()}</h2>
        </div>
      </Show>
      <div class="my-8 flex justify-center"></div>
    </div>
  );
}

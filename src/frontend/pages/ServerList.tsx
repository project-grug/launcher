import Server from "../components/Server";
import { For, createResource } from "solid-js";
import { apiUrl } from "../..";
type server = {
  id: number;
  name: string;
  address: string;
  port: number;
  version: number;
  gameType: number;
  players: number;
  maxPlayers: number;
  build: string;
  tps?: number;
  customMode?: { name: string };
  map: string;
};
const [servers] = createResource(async () => {
  const serverList = await (await fetch(`${apiUrl}/servers`)).json();
  serverList.sort((a: server, b: server) => {
    return a.players > b.players ? -1 : 1;
  });
  return serverList;
});
export default function () {
  return (
    <div>
      <div class="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 mx-8 my-8 gap-2">
        <For each={servers()}>
          {(server: server) => (
            <Server
              id={server.id}
              name={server.name}
              address={server.address}
              port={server.port}
              version={server.version}
              gameType={server.gameType}
              players={server.players}
              maxPlayers={server.maxPlayers}
              build={server.build}
              tps={server.tps}
              mode={server.customMode}
              map={server.map}
            ></Server>
          )}
        </For>
      </div>
    </div>
  );
}

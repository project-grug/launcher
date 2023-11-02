import Server from "../components/Server";
import { For, Suspense, createResource, onCleanup } from "solid-js";
import { jpxsApiUrl } from "../..";
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
const [servers, { refetch }] = createResource(async () => {
  console.log("fetched servers");
  const serverList = await (await fetch(`${jpxsApiUrl}/servers`)).json();
  serverList.sort((a: server, b: server) => {
    return a.players > b.players ? -1 : 1;
  });
  return serverList;
});
export default function () {
  // refetch the server list every minute
  const timer = setTimeout(refetch, 60000);
  onCleanup(() => {
    console.log("stopping timer");
    clearInterval(timer);
  });
  return (
    <Suspense
      fallback={
        <div class="text-center">
          <p class="py-2 text-2xl">Loading...</p>
        </div>
      }
    >
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
      <div class="text-center">
        <button onClick={refetch} class="bg-crust px-4 py-2 rounded-xl mb-4">
          Refresh
        </button>
      </div>
    </Suspense>
  );
}

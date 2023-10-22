export default function (props: { name: string; phone: string }) {
  // To-Do: Fetch player preview image from server using phone number
  return (
    <div class="flex flex-row">
      <img alt="Player Preview"></img>
      <div class="flex flex-col mx-2">
        <p class="font-bold text-xl">{props.name}</p>{" "}
        <p class="text-overlay2">{props.phone}</p>
      </div>
    </div>
  );
}

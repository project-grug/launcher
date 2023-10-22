import { A } from "@solidjs/router";

export default function (props: {
  href: string;
  active: boolean;
  text?: string;
  children?: string;
  callback?: () => void;
}) {
  return (
    <A
      href={props.href}
      class={` ${
        props.active ? "bg-crust" : ""
      } hover:bg-crust mx-2 py-2 rounded-xl max-w-[10rem] text-center`}
      onClick={props.callback}
    >
      {props.text !== undefined ? props.text : props.children}
    </A>
  );
}

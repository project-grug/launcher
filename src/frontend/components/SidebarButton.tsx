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
        props.active ? "bg-base brightness-125" : ""
      } hover:bg-crust hover:brightness-100 mx-2 py-2 rounded-xl max-w-[10rem] text-center transition-colors duration-200`}
      onClick={props.callback}
    >
      {props.text !== undefined ? props.text : props.children}
    </A>
  );
}

import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Degen Dreams</h1>
      <Button appName="Degen Dreams">Click me</Button>
    </div>
  );
}

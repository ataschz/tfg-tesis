import { Center } from "@/components/center";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return <Center>{children}</Center>;
}

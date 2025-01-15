"use client";

import { Button } from "@/components/ui/button";
import { useConfirm } from "./hooks/use-confirm";

export default function Home() {
  const { confirm } = useConfirm();

  async function handleConfirm() {
    const result = await confirm({ acceptButton: "Delete" });
    alert(result);
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Button onClick={handleConfirm}>Confirm</Button>
    </div>
  );
}

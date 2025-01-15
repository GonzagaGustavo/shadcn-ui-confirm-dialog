"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

type ContextType = {
  confirm: (content: Partial<ContentType>) => Promise<boolean>;
};

const ConfirmContext = createContext({} as ContextType);

type ContentType = {
  title: string;
  description: string;
  acceptButton: string;
};

const defaultContent: ContentType = {
  title: "Are you absolutely sure?",
  description:
    "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  acceptButton: "Continue",
};

export default function ConfirmProvider({ children }: { children: ReactNode }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const [content, setContent] = useState<ContentType>(defaultContent);

  async function confirm({
    title,
    description,
    acceptButton,
  }: Partial<ContentType>): Promise<boolean> {
    setContent({
      title: title ? title : defaultContent.title,
      description: description ? description : defaultContent.description,
      acceptButton: acceptButton ? acceptButton : defaultContent.acceptButton,
    });
    setOpenConfirm(true);

    return await new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      <AlertDialog
        open={openConfirm}
        onOpenChange={(open) => {
          if (!open) {
            if (resolveRef.current) resolveRef.current(false);
          }
          setOpenConfirm(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{content.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {content.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => resolveRef.current && resolveRef.current(false)}
            >
              Cancel
            </AlertDialogCancel>
            {/* <AlertDialogAction asChild> */}
            <Button
              variant="destructive"
              onClick={() => {
                if (resolveRef.current) resolveRef.current(true);

                setOpenConfirm(false);
              }}
            >
              {content.acceptButton}
            </Button>
            {/* </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  return useContext(ConfirmContext);
};

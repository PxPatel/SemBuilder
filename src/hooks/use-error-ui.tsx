"use client";

import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
  useContext,
} from "react";
import { useToast } from "./shadcn-hooks/use-toast";
import { ToastAction } from "../components/shadcn-ui/toast";

export type IErrorUIContextType = {
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
};

export const ErrorUIContext = createContext<IErrorUIContextType>({
  error: null,
  setError: () => {},
});

export const useErrorUI = () => useContext(ErrorUIContext);

export function ErrorUIProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  const { toast, dismiss } = useToast();
  const toastId = useRef<string>("");

  useEffect(() => {
    if (!error && toastId.current) {
      // dismiss(toastId.current);
      // toastId.current = "";
      return;
    }

    if (!error) {
      return;
    }

    const { id } = toast({
      variant: "destructive",
      title: `Error: ${error.name}`,
      description: error.message,
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      duration: 5000,
    });
    // toastId.current = id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const value: IErrorUIContextType = {
    error,
    setError,
  };

  return (
    <ErrorUIContext.Provider value={value}>{children}</ErrorUIContext.Provider>
  );
}

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
  const timerId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!error) {
      return;
    }

    console.log("[Toasting error]");
    const { id, dismiss: specificDismiss } = toast({
      variant: "destructive",
      title: `Error: ${error.name}`,
      description: error.message,
      action: (
        <ToastAction
          altText="Dismiss"
          onClick={() => {
            specificDismiss();
            setError(null);
            toastId.current = id;
          }}
        >
          Dismiss
        </ToastAction>
      ),
      duration: 5000,
    });
    toastId.current = id;

    return () => {
      // Clean up when the component is unmounted
      if (toastId.current) {
        dismiss(toastId.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (error && toastId.current) {
      timerId.current = setTimeout(() => {
        if (toastId.current) {
          console.log("[Setting error to null in setTimeout]");
          setError(null);
          toastId.current = "";
        }
      }, 5 * 1000);
    }

    return () => {
      clearTimeout(timerId.current);
    };
  });

  const value: IErrorUIContextType = {
    error,
    setError,
  };

  return (
    <ErrorUIContext.Provider value={value}>{children}</ErrorUIContext.Provider>
  );
}

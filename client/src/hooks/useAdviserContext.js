import { AdviserContext } from "../context/AdviserContext";
import { useContext } from "react";

export const useAdvisersContext = () => {
  const context = useContext(AdviserContext);

  if (!context) {
    throw Error(
      "useAdvisersContext must be used inside a AdviserContextProvider"
    );
  }

  return context;
};

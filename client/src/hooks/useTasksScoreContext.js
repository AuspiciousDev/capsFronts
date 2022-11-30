import { TaskScoreContext } from "../context/TaskScoreContext";
import { useContext } from "react";

export const useTasksScoresContext = () => {
  const context = useContext(TaskScoreContext);

  if (!context) {
    throw Error(
      "useTasksScoreContext must be used inside a TaskScoresContextProvider"
    );
  }

  return context;
};

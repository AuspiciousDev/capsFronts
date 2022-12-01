import React from "react";
import { createContext, useReducer } from "react";
export const TaskScoreContext = createContext();

export const tasksReducer = (state, action) => {
  switch (action.type) {
    case "SET_SCORES":
      return {
        taskScore: action.payload,
      };
    case "CREATE_SCORE":
      return {
        taskScore: [action.payload, ...state.taskScore],
      };
    case "DELETE_SCORE":
      return {
        taskScore: state.taskScore.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const TasksScoreContextProvider = ({ children }) => {
  const [state, taskScoreDispatch] = useReducer(tasksReducer, {
    taskScore: null,
  });

  return (
    <TaskScoreContext.Provider value={{ ...state, taskScoreDispatch }}>
      {children}
    </TaskScoreContext.Provider>
  );
};

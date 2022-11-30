import React from "react";
import { createContext, useReducer } from "react";
export const AdviserContext = createContext();

export const advisersReducer = (state, action) => {
  switch (action.type) {
    case "SET_ADVISERS":
      return {
        advisers: action.payload,
      };
    case "CREATE_ADVISER":
      return {
        advisers: [action.payload, ...state.advisers],
      };
    case "DELETE_ADVISER":
      return {
        advisers: state.advisers.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const AdvisersContextProvider = ({ children }) => {
  const [state, adviserDispatch] = useReducer(advisersReducer, {
    advisers: null,
  });

  return (
    <AdviserContext.Provider value={{ ...state, adviserDispatch }}>
      {children}
    </AdviserContext.Provider>
  );
};

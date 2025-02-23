import React, { createContext, useState } from "react";

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [programData, setProgramData] = useState({
    age: null,
    weight: null,
    height: null,
    gender: null,
    daysPerWeek: null,
    program: null,
  });

  return (
    <ProgramContext.Provider value={{ programData, setProgramData }}>
      {children}
    </ProgramContext.Provider>
  );
};
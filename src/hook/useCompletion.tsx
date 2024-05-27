import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CompletionProviderProps {
    children: ReactNode;
 }

// Definindo o tipo para os dados do contexto
interface CompletionContextData {
  completionPercentage: number;
  createCompletionPercentage: ( id: number ) => void;
}

// Criando o contexto
export const CompletionContext = createContext<CompletionContextData>(
    {} as CompletionContextData
);

// Criando um componente de provedor para encapsular outros componentes
export function CompletionProvider ({ children }: CompletionProviderProps) {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  function createCompletionPercentage (percentage: number) {
    setCompletionPercentage(percentage)
  }

  return (
    <CompletionContext.Provider value={{completionPercentage, createCompletionPercentage}}>
      {children}
    </CompletionContext.Provider>
  );
};


import { createContext, useContext } from 'react'

export const VerboseModeContext = createContext<boolean>(true)

export function useVerboseMode(): boolean {
  return useContext(VerboseModeContext)
}

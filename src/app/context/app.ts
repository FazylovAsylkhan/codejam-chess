import { createContext, useContext } from 'react';

export type PlayersName = {
  playersName: string[]
  setPlayersName: React.Dispatch<React.SetStateAction<string[]>>
};

export const PlayersNameContext = createContext<PlayersName>({
  playersName: [],
  setPlayersName: () => {},
});

export const usePlayersNameContext = () => useContext(PlayersNameContext);

"use client";
import {
  SetStateAction,
  createContext,
  useContext,
  Dispatch,
  useState,
} from "react";

interface ContextProps {
  hoverContent: any;
  setHoverContent: Dispatch<SetStateAction<any>>;
  wallet_address: string;
  setWalletAddress: Dispatch<SetStateAction<string>>;
  wallet_object: Object;
  setWalletObject: Dispatch<SetStateAction<Object>>;
  is_connected: boolean;
  setConnectionStatus: Dispatch<SetStateAction<boolean>>;
  public_key: string;
  setPublicKey: Dispatch<SetStateAction<string>>;
  jwt_auth_token: string;
  setJwtAuthToken: Dispatch<SetStateAction<string>>;
  userCreatedRooms: Array<any>;
  setUserCreatedRooms: Dispatch<SetStateAction<Array<any>>>;
}

const GlobalContext = createContext<ContextProps>({
  hoverContent: null,
  setHoverContent: (): any => null,
  wallet_address: "",
  setWalletAddress: (): string => "",
  wallet_object: {},
  setWalletObject: (): any => {},
  is_connected: false,
  setConnectionStatus: (): Boolean => false,
  public_key: "",
  setPublicKey: (): string => "",
  jwt_auth_token: "",
  setJwtAuthToken: (): string => "",
  userCreatedRooms: [],
  setUserCreatedRooms: (): Array<any> => [],
});

export const GlobalContextProvider = ({ children }: { children: any }) => {
  const [wallet_address, setWalletAddress] = useState("");
  const [wallet_object, setWalletObject] = useState({});
  const [is_connected, setConnectionStatus] = useState(false);
  const [public_key, setPublicKey] = useState("");
  const [jwt_auth_token, setJwtAuthToken] = useState("");
  const [userCreatedRooms, setUserCreatedRooms] = useState<Array<any>>([]);
  const [hoverContent, setHoverContent] = useState(null);
  return (
    <GlobalContext.Provider
      value={{
        hoverContent,
        setHoverContent,
        wallet_address,
        setWalletAddress,
        wallet_object,
        setWalletObject,
        is_connected,
        setConnectionStatus,
        public_key,
        setPublicKey,
        jwt_auth_token,
        setJwtAuthToken,
        userCreatedRooms,
        setUserCreatedRooms,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

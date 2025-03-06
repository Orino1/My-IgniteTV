import {
    createContext,
    useContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import NetInfo from "@react-native-community/netinfo";

// type for our context
type NetContextType = {
    isOnline: boolean;
    setIsOnline: Dispatch<SetStateAction<boolean>>;
};

// context
const netContext = createContext<NetContextType>({
    isOnline: false,
    setIsOnline: () => {}
});

// hook for using network context
export const useNetContext = () => useContext(netContext);

// context provider
export default function NetContextProvider({ children }: { children: any }) {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsOnline(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);
    return (
        <netContext.Provider value={{ isOnline, setIsOnline }}>
            {children}
        </netContext.Provider>
    );
}
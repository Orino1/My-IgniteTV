import {
    useState,
    useEffect,
    useContext,
    createContext,
    Dispatch,
    SetStateAction,
} from "react";
import { getAllVideoFiles, getAllImagesFiles } from "../utils/globalUtils";

// type anno for our context
type localMediaContextType = {
    localVideos: string[] | undefined;
    setLocalVideos: Dispatch<SetStateAction<string[] | undefined>>;
    localImages: string[] | undefined;
    setLocalImages: Dispatch<SetStateAction<string[] | undefined>>;
};

// local media context
const localMediaContext = createContext<localMediaContextType>({
    localVideos: undefined,
    setLocalVideos: () => {},
    localImages: undefined,
    setLocalImages: () => {},
});

// hoock for useing local media context
export const useLocalMediaContext = () => useContext(localMediaContext);

// local mdeia provider
export default function LocalMediaContextProvider({
    children,
}: {
    children: any;
}) {
    const [localVideos, setLocalVideos] = useState<string[] | undefined>(
        undefined
    );
    const [localImages, setLocalImages] = useState<string[] | undefined>(
        undefined
    );

    useEffect(() => {
        // we need to load our images and videos
        const handleFilesRetrieval = async () => {
            const imageUris = await getAllImagesFiles();

            setLocalImages(imageUris);

            const videoUris = await getAllVideoFiles();

            setLocalVideos(videoUris);
        };

        try {
            handleFilesRetrieval();
        } catch (e) {
            console.error(e);
            // we display a global error modal
        }
    }, []);

    return (
        <localMediaContext.Provider
            value={{
                localVideos,
                localImages,
                setLocalVideos,
                setLocalImages,
            }}
        >
            {children}
        </localMediaContext.Provider>
    );
}
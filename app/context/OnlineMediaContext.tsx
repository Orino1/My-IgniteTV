import {
    useEffect,
    useState,
    createContext,
    useContext,
    useRef,
} from "react";
import {
    downloadVideo,
    downloadImages,
    extractFileName,
} from "../utils/globalUtils";

import { useLocalMediaContext } from "./LocalMediaContext";

type OnlineMediaContextType = {
    downloadProgress: { fileName: string; progress: number }[];
    fetchAvailableMedia: () => void;
};

const onlineMediaCOntext = createContext<OnlineMediaContextType>({
    downloadProgress: [],
    fetchAvailableMedia: () => {},
});

export const useOnlineMediaContext = () => useContext(onlineMediaCOntext);

export default function OnlineMediaContextProvider({
    children,
}: {
    children: any;
}) {
    const [videosToBeDownloaded, setVideosToBeDownloaded] = useState<
        string[] | undefined
    >(undefined);
    const [imagesToBeDownloaded, setImagesToBeDownloaded] = useState<
        string[] | undefined
    >(undefined);
    const [downloadProgress, setDonwloadProgress] = useState<
        { fileName: string; progress: number }[]
    >([]);
    const [shouldFetch, setShouldFtech] = useState(false);

    const fetchingData = useRef(false);
    //const hasDownloadedNewVideos = useRef(false);

    const { localImages, localVideos, setLocalImages, setLocalVideos } =
        useLocalMediaContext();

    // helper function to invoke fetching data and starts chain of downloads
    const fetchAvailableMedia = () => {
        fetchingData.current = false;
        setShouldFtech(true);
    };

    // fetching data
    useEffect(() => {
        if (
            !shouldFetch ||
            !localImages ||
            !localVideos ||
            fetchingData.current
        ) {
            return;
        }

        // starts fetching new data
        const handleFetchData = async () => {
            try {
                const response = await fetch(
                    "https://orino.me/api/availble-media"
                );
                const data = await response.json();

                fetchingData.current = true;

                const filtredVideosNames = localVideos.map((vid: string) =>
                    extractFileName(vid)
                );
                const filtredImagessNames = localImages.map((img: string) =>
                    extractFileName(img)
                );

                const newImages = data.files.images.filter(
                    (image: string) =>
                        !filtredImagessNames?.includes(extractFileName(image))
                );
                const newVideos = data.files.videos.filter(
                    (video: string) =>
                        !filtredVideosNames?.includes(extractFileName(video))
                );

                console.log("Data fetched.")
                setVideosToBeDownloaded(newVideos);
                setImagesToBeDownloaded(newImages);
            } catch (e) {
                console.error(e);
                // we display a global error modal
            }
        };

        setShouldFtech(false);
        handleFetchData();
    }, [shouldFetch]);

    // run when main useEffect set videosToBeDownloaded
    useEffect(() => {
        if (!videosToBeDownloaded || videosToBeDownloaded.length === 0) {
            return;
        }

        const handleVideosDownload = async (url: string, fileName: string) => {
            try {
                setDonwloadProgress((prev) => [
                    ...prev,
                    { fileName, progress: 0 },
                ]);

                const newUri = await downloadVideo(
                    url,
                    fileName,
                    (progress) => {
                        setDonwloadProgress((prev) =>
                            prev.map((item) =>
                                item.fileName === fileName
                                    ? { ...item, progress }
                                    : item
                            )
                        );
                    }
                );
                setDonwloadProgress((prev) =>
                    prev.filter((obj) => obj.fileName !== fileName)
                );
                setLocalVideos((prev) => [...(prev || []), newUri]);
                console.log("Video downloaded successfully:", fileName);
            } catch (error) {
                console.error("Failed to download video:", error);

                setDonwloadProgress((prev) =>
                    prev.filter((item) => item.fileName !== fileName)
                );
            }
        };

        const download = async () => {
            const videosToDownload = [...videosToBeDownloaded];

            setImagesToBeDownloaded([]);

            videosToDownload.forEach((url: string) => {
                const fileName = extractFileName(url);
                handleVideosDownload(url, fileName);
            });

            //hasDownloadedNewVideos.current = true;
        };

        download();
    }, [videosToBeDownloaded]);

    // run when main useEffect set imagesToBeDownloaded
    useEffect(() => {
        if (!imagesToBeDownloaded || imagesToBeDownloaded.length === 0) {
            return;
        }

        const handleImageDownload = async (url: string, fileName: string) => {
            try {
                setDonwloadProgress((prev) => [
                    ...prev,
                    { fileName, progress: 0 },
                ]);

                const newUri = await downloadImages(
                    url,
                    fileName,
                    (progress) => {
                        setDonwloadProgress((prev) =>
                            prev.map((item) =>
                                item.fileName === fileName
                                    ? { ...item, progress }
                                    : item
                            )
                        );
                    }
                );
                setDonwloadProgress((prev) =>
                    prev.filter((obj) => obj.fileName !== fileName)
                );
                setLocalImages((prev) => [...(prev || []), newUri]);
                console.log("Image downloaded successfully:", fileName);
            } catch (error) {
                console.error("Failed to download video:", error);

                setDonwloadProgress((prev) =>
                    prev.filter((item) => item.fileName !== fileName)
                );
            }
        };

        const download = async () => {
            const imagesToDownload = [...imagesToBeDownloaded];

            setImagesToBeDownloaded([]);

            imagesToDownload.forEach((url: string) => {
                const fileName = extractFileName(url);
                handleImageDownload(url, fileName);
            });

            //hasDownloadedNewVideos.current = true;
        };

        download();
    }, [imagesToBeDownloaded]);

    return (
        <onlineMediaCOntext.Provider
            value={{ downloadProgress, fetchAvailableMedia }}
        >
            {children}
        </onlineMediaCOntext.Provider>
    );
}
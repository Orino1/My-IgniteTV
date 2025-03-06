import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Video from "react-native-video";

type Props = {
    videoUri: string;
    repeat: boolean;
    onEnd: () => void;
    paused: boolean;
};

const VideoPlayerFullScreen = ({ videoUri, repeat, onEnd, paused }: Props) => {

    useEffect(() => {
        console.log("video mounted");


        return () => {
            console.log("video unmounted");
        };
    }, []);

    return (
            <Video
                style={styles.video}
                source={{ uri: videoUri }}
                resizeMode="cover"
                controls={false}
                repeat={repeat}
                onEnd={onEnd}
                ignoreSilentSwitch="ignore"
                playInBackground={false}
                playWhenInactive={false}
                allowsExternalPlayback={false}
                paused={paused}
                fullscreen={false}
            />
    );
};

export default VideoPlayerFullScreen;

const styles = StyleSheet.create({
    video: {
        height: "100%",
        width: "100%",
    },
});
import { VideoView, useVideoPlayer } from "expo-video";
import { StyleSheet } from "react-native";

type Probs = {
    videoUri: string;
};

//  ths gonna be a video card

// video player component that intended to play the video from a uri
export default function VideoPlayer({ videoUri }: Probs) {
    const player = useVideoPlayer(videoUri, (player) => {
        //player.loop = true; // lop
        //player.play(); // autoplay
    });

    return (
        <VideoView
            style={styles.videoPlayer}
            player={player}
            allowsFullscreen={false}
            nativeControls={false}
        />
    );
}

const styles = StyleSheet.create({
    videoPlayer: {
        width: "48%",
        height: 200,
        marginBottom: 20,
        backgroundColor: "#000",
        borderRadius: 10,
        overflow: "hidden",
    },
});
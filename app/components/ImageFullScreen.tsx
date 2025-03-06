import { StyleSheet, ImageBackground } from "react-native";
import { useEffect } from "react";

const ImageFullScreen = ({
    imgUri,
    onEnd,
    isStatic,
}: {
    imgUri: string;
    onEnd: () => void;
    isStatic: boolean;
}) => {
    useEffect(() => {
        console.log("image mounted");
        let timer = null
        if (!isStatic) {
            timer = setTimeout(() => {
                onEnd();
            }, 10000);
        }

        return () => {
            console.log("image unmounted");
            if (!isStatic) {
                clearTimeout(timer);
            }
        };
    }, [isStatic]);

    return (
        <ImageBackground
            source={{ uri: imgUri }}
            style={styles.image}
            resizeMode="cover"
        />
    );
};

export default ImageFullScreen;

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
    },
});
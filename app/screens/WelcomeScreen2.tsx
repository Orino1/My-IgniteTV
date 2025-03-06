import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { useHeader } from "../utils/useHeader"
import { View, StyleSheet } from "react-native"
import { VideoView, useVideoPlayer } from "expo-video"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen2: FC<WelcomeScreenProps> = observer(function WelcomeScreen(_props) {
  const {
    authenticationStore: { logout },
  } = useStores()

  useHeader(
    {
      rightTx: "common.logOut",
      onRightPress: logout,
    },
    [logout],
  )

  const videoSource = require("../../assets/videos/sample.mp4")
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.conatiner}>
      <View style={styles.upperContainer}>
        <VideoView 
        style={styles.video} 
        player={player} 
        allowsFullscreen 
        allowsPictureInPicture
        nativeControls={false}
      />
      </View>
      <View style={styles.lowerContainer}></View>
    </View>
  )
})

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  upperContainer: {
    width: "100%",
    height: "50%",
    backgroundColor: "gold",
  },
  lowerContainer: {
    width: "100%",
    height: "50%",
    backgroundColor: "gray",
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: 200,
  },
})

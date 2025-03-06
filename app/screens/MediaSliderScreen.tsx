import { FC, useState } from "react"
import { View, StyleSheet, Animated } from "react-native"
import { useLocalMediaContext } from "./../context/LocalMediaContext"
import VideoPlayerFullScreen from "./../components/VideoPlayerFullScreen"
import ImageFullScreen from "./../components/ImageFullScreen"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"

interface MediaSliderScreenProps extends AppStackScreenProps<"MediaSlider"> {}

export const MediaSliderScreen: FC<MediaSliderScreenProps> = observer(function MediaScreen(_props) {
  const { localImages, localVideos } = useLocalMediaContext()
  const mediaList = [...(localVideos || []), ...(localImages || [])]

  return (
    <View style={styles.container}>
      {mediaList.length === 1 ? <SingleMedia /> : <MultiMedia mediaList={mediaList} />}
    </View>
  )
})

function MultiMedia({ mediaList }: { mediaList: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [transitionProgress] = useState(new Animated.Value(1))

  const handleNextMedia = () => {
    setCurrentIndex(currentIndex < mediaList.length - 1 ? currentIndex + 1 : 0)
  }

  return (
    <View style={styles.container}>
      <MediaView mediaUri={mediaList[currentIndex]} onEnd={handleNextMedia} isActive={true} />
    </View>
  )
}

const MediaView = ({
  mediaUri,
  isActive,
  onEnd,
}: {
  mediaUri: string | undefined
  isActive: boolean
  onEnd: () => void
}) => {
  if (!mediaUri) {
    return
  }

  const isVideo = mediaUri.endsWith(".mp4")

  return isVideo ? (
    <VideoPlayerFullScreen videoUri={mediaUri} onEnd={onEnd} repeat={false} paused={!isActive} />
  ) : (
    <ImageFullScreen imgUri={mediaUri} onEnd={onEnd} isStatic={!isActive} />
  )
}

function SingleMedia() {
  const { localImages, localVideos } = useLocalMediaContext()

  const handleNext = () => {}

  return localImages.length !== 0 ? (
    <ImageFullScreen isStatic={true} imgUri={localImages[0]} onEnd={handleNext} />
  ) : (
    <VideoPlayerFullScreen
      repeat={true}
      videoUri={localVideos[0]}
      onEnd={handleNext}
      paused={false}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  mediaWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  hiddenContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    zIndex: -1,
  },
})

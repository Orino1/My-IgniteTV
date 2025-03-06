import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { View, ScrollView, Text, StyleSheet } from "react-native"
import { AppStackScreenProps } from "../navigators"
//import { useHeader } from "../utils/useHeader"
//import { useRouter } from "expo-router";
import DownloadProgressCard from "../components/DownloadProgressCard"
import ImageCard from "app/components/ImageCard"
import VideoCard from "app/components/VideoCard"
import Btn from "app/components/Btn"
//import ImageCard from "./../components/ImageCard";

import { useStoragePermissionContext } from "../context/StoragePermissionContext"
import { useNetContext } from "../context/NetworkAvailability"
import { useLocalMediaContext } from "../context/LocalMediaContext"
import { useOnlineMediaContext } from "../context/OnlineMediaContext"

import { formatBytes } from "../utils/globalUtils"

interface MediaScreenProps extends AppStackScreenProps<"Media"> {}

export const MediaScreen: FC<MediaScreenProps> = observer(function MediaScreen(_props) {
  const [navigate, setNavigate] = useState(false)

  const { granted, storageInfo } = useStoragePermissionContext()
  const { isOnline } = useNetContext()
  const { localVideos, localImages } = useLocalMediaContext()
  const { downloadProgress, fetchAvailableMedia } = useOnlineMediaContext()

  const fetchedData = useRef(false)

  const { navigation } = _props

  useEffect(() => {
    if (fetchedData.current || !localImages || !localVideos) {
      return
    }

    fetchedData.current = true
    fetchAvailableMedia()
  }, [localVideos, localImages])

  const initialLoad = useRef(false)

  useEffect(() => {
    // if its the first time we set it otherwise and we return
    if (!initialLoad.current) {
      initialLoad.current = true
      return
    }

    navigation.push("MediaSlider")
  }, [navigate])

  // handling navigation to media slider
  const handleEnterFullscreen = () => {
    setNavigate((prev) => !prev)
  }

  return (
    <View style={styles.mainContainer}>
      {/* Right Section */}
      <View style={styles.rightSection}>
        <Text style={styles.debugTitle}>Applcation info</Text>
        {storageInfo && (
          <>
            <Text style={styles.debugText}>Total storage: {formatBytes(storageInfo.total)}</Text>
            <Text style={styles.debugText}>Free storage: {formatBytes(storageInfo.free)}</Text>
          </>
        )}
        <Text style={styles.debugText}>Network mode: {isOnline ? "Online" : "Offline"}</Text>
      </View>

      {/* Left Section ( Content) */}
      <ScrollView contentContainerStyle={styles.leftSection}>
        <View style={styles.upperSectionContainer}>
          {downloadProgress.length === 0 && (
            <Btn onPress={handleEnterFullscreen} text="Launch Slider" />
          )}
        </View>
        <View style={styles.mediaContainer}>
          {downloadProgress.map((item) => (
            <DownloadProgressCard
              key={item.fileName}
              uri={item.fileName}
              progress={item.progress}
            />
          ))}
          {localVideos && localVideos.map((video, index) => <VideoCard key={index} uri={video} />)}
          {localImages &&
            localImages.map((img, index) => (
              <ImageCard key={index} uri={img} />
              //<Image  style={styles.image} source={{ uri: img }} />
            ))}
        </View>
      </ScrollView>
    </View>
  )
})
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
  },
  rightSection: {
    width: 200,
    padding: 30,
    backgroundColor: "#2C2C2C",
    borderRightWidth: 2,
    borderRightColor: "#444",
  },
  debugTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 30,
  },
  debugText: {
    fontSize: 20,
    color: "#CCC",
    marginBottom: 15,
  },
  leftSection: {
    width: "70%",
    padding: 30,
  },
  mediaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  upperSectionContainer: {
    height: 80,
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
})

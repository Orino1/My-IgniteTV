import React, { useState, useEffect } from "react"
import { StyleSheet, TouchableHighlight, View, Text, Image } from "react-native"
import { exatractThumbnail } from "./../utils/globalUtils"
import { extractFileName } from "./../utils/globalUtils"

const VideoCard = ({ uri }: { uri: string }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);

  // we need to extarct the uri and display an image tag
useEffect(() => {
    // we need to call that on our 
    const handleThumbnail = async () => {
        const thumb = await exatractThumbnail(uri);
        setThumbnail(thumb)
    }

    handleThumbnail()
}, [])

  return (
    <TouchableHighlight
      focusable={true}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[styles.container, isFocused && styles.focused]}
    >
      <>
        {thumbnail && <Image style={styles.img} source={{ uri: thumbnail }} />}

        {isFocused && (
          <View style={styles.overlay}>
            <Text style={styles.fileName}>File name: {extractFileName(uri)}</Text>
          </View>
        )}
      </>
    </TouchableHighlight>
  )
}

export default VideoCard

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    overflow: "hidden",
    height: 400,
    width: 600,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  focused: {
    borderWidth: 5,
    borderColor: "#fdfdfd",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  fileName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
})
import React, { useState } from "react"
import { StyleSheet, TouchableHighlight, Image, View, Text } from "react-native"
import { extractFileName } from "app/utils/globalUtils"

const ImageCard = ({ uri }: { uri: string }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <TouchableHighlight
      focusable={true}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[styles.container, isFocused && styles.focused]}
    >
      <>
        <Image style={styles.img} source={{ uri: uri }} />

        {isFocused && (
          <View style={styles.overlay}>
            <Text style={styles.fileName}>File name: {extractFileName(uri)}</Text>
          </View>
        )}
      </>
    </TouchableHighlight>
  )
}

export default ImageCard

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

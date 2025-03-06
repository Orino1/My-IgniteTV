import React, { useState } from "react"
import { StyleSheet, Text, TouchableHighlight, View } from "react-native"

const Btn = ({ text, onPress }: { text: string; onPress: () => void }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <TouchableHighlight
      focusable={true}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPress={onPress}
      style={styles.container}
    >
      <View style={[styles.touchable, isFocused && styles.focusedTouchable]}>
        <Text style={[styles.buttonText, isFocused && styles.focusedText]}>{text}</Text>
      </View>
    </TouchableHighlight>
  )
}

export default Btn

const styles = StyleSheet.create({
  container: {
    minHeight: 80,  // Increased button height for TV usability
    minWidth: 250,  // Larger width for easier selection
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 30,
    margin: 20,  // Increased margin for separation
  },
  touchable: {
    backgroundColor: "transparent",
    padding: 20, // Increased padding
    minHeight: 80,
    minWidth: 250,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 3,  // Thicker border for visibility
    borderColor: "#fdfdfd",
  },
  focusedTouchable: {
    backgroundColor: "#fdfdfd",
  },
  buttonText: {
    fontSize: 24,  // Larger font size for better readability
    color: "#fff",
    textAlign: "center",
  },
  focusedText: {
    color: "#000", // Change text color to dark when focused
  },
})

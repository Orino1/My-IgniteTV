import { View, Text, StyleSheet } from "react-native"
import { ProgressBar } from "@react-native-community/progress-bar-android"

export default function DownloadProgressCard({ uri, progress }: { uri: string; progress: number }) {
  return (
    <View style={styles.downloadItem}>
      <Text style={styles.uriText}>{uri}</Text>
      <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      <ProgressBar
        styleAttr="Horizontal"
        progress={progress}
        indeterminate={false}
        color="#1E90FF"
        style={styles.progressBar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  downloadItem: {
    width: 180,
    height: 200,
    marginBottom: 20,
    backgroundColor: "#000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  uriText: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 10,
  },
  progressText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 10,
  },
})

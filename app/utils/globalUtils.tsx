import * as FileSystem from "expo-file-system"
import DeviceInfo from "react-native-device-info"
//import { getVideoDuration } from "react-native-video-duration"
import * as VideoThumbnail from "expo-video-thumbnails"

// Define base paths
const APP_STORAGE = FileSystem.documentDirectory
const VIDEOS_DIR = `${APP_STORAGE}videos/`
const IMAGES_DIR = `${APP_STORAGE}images/`

// extract thumbnail
export const exatractThumbnail = async (vidUri: string): Promise<string> => {
  // we gonna do our stuff here
  const { uri } = await VideoThumbnail.getThumbnailAsync(vidUri, {
    time: 1000,
  })

  return uri
}

// Format bytes to readable size
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Create media directories
export const createMediaDirs = async (): Promise<void> => {
  try {
    await FileSystem.makeDirectoryAsync(VIDEOS_DIR, { intermediates: true })
    await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true })
    console.log("Dir was created")
  } catch (error) {
    if (error.code !== "EEXIST") {
      console.error("Directory creation error:", error)
      throw error
    }
  }
}

// ensure that dir exsist first
const ensureDirectoryExists = async (path: string): Promise<void> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(path)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(path, { intermediates: true })
    }
  } catch (error) {
    console.error(`Directory ensure error: ${path}`, error)
    throw error
  }
}

// Download video file
export const downloadVideo = async (
  videoUrl: string,
  fileName: string,
  onProgress: (progress: number) => void,
): Promise<string> => {
  const fileUri = `${VIDEOS_DIR}${fileName}`

  const downloadResult = await FileSystem.createDownloadResumable(
    videoUrl,
    fileUri,
    {},
    ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
      onProgress(totalBytesWritten / totalBytesExpectedToWrite)
    },
  ).downloadAsync()

  if (!downloadResult || !downloadResult.uri) {
    throw new Error("Download failed")
  }

  return downloadResult.uri
}

// Download image file
export const downloadImages = async (
  imageUrl: string,
  fileName: string,
  onProgress: (progress: number) => void,
): Promise<string> => {
  const fileUri = `${IMAGES_DIR}${fileName}`

  const downloadResult = await FileSystem.createDownloadResumable(
    imageUrl,
    fileUri,
    {},
    ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
      onProgress(totalBytesWritten / totalBytesExpectedToWrite)
    },
  ).downloadAsync()

  if (!downloadResult || !downloadResult.uri) {
    throw new Error("Download failed")
  }

  return downloadResult.uri
}

// Get storage info
export const getStorageInfo = async (): Promise<{ total: number; free: number }> => {
  try {
    return {
      total: await DeviceInfo.getTotalDiskCapacity(),
      free: await DeviceInfo.getFreeDiskStorage(),
    }
  } catch (error) {
    console.error("Storage info error:", error)
    throw error
  }
}

// Get all video files
export const getAllVideoFiles = async (): Promise<string[]> => {
  try {
    await ensureDirectoryExists(VIDEOS_DIR)
    const files = await FileSystem.readDirectoryAsync(VIDEOS_DIR)
    return files.map((fileName) => `${VIDEOS_DIR}${fileName}`)
  } catch (error) {
    console.error("Video files error:", error)
    throw error
  }
}

// Get all image files
export const getAllImagesFiles = async (): Promise<string[]> => {
  try {
    await ensureDirectoryExists(IMAGES_DIR)
    const files = await FileSystem.readDirectoryAsync(IMAGES_DIR)
    return files.map((fileName) => `${IMAGES_DIR}${fileName}`)
  } catch (error) {
    console.error("Image files error:", error)
    throw error
  }
}

// Extract file name from URL
export const extractFileName = (url: string): string => {
  return url.split("/").pop() || `file_${Date.now()}`
}

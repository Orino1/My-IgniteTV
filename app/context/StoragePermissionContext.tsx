import { useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from "react"

import { createMediaDirs, getStorageInfo } from "../utils/globalUtils"

// type for our context
type PermissionContextType = {
  granted: boolean
  setGranted: Dispatch<SetStateAction<boolean>>
  loading: boolean
  storageInfo: { total: number; free: number } | undefined
}

// context
const storagePermissionContext = createContext<PermissionContextType>({
  granted: false,
  setGranted: () => {},
  loading: true,
  storageInfo: undefined,
})

// hook for using stoarge permission context
export const useStoragePermissionContext = () => useContext(storagePermissionContext)

// provider
export default function StoragePermissionContextProvider({ children }: { children: any }) {
  const [granted, setGranted] = useState<boolean>(false)
  // TODO: ste to false till you make sure that you requested the permissions and it was denied
  const [loading, setLoading] = useState<boolean>(false)
  // storage information
  const [storageInfo, setStorageInfo] = useState<{ total: number; free: number } | undefined>(
    undefined,
  )

  useEffect(() => {
    // todo: change teh api ver according to tv one
    const handleStorageInfo = async () => {
      const strgInfo = await getStorageInfo()
      setStorageInfo(strgInfo)
    }

    const handleAll = async () => {
      await createMediaDirs()
      handleStorageInfo()
      setGranted(true)
      setLoading(false)
    }

    handleAll()
  }, [])

  return (
    <storagePermissionContext.Provider value={{ granted, setGranted, loading, storageInfo }}>
      {children}
    </storagePermissionContext.Provider>
  )
}

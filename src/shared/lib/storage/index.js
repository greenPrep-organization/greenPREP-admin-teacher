export const fromStoredData = (storageData, isJson = true) => {
  try {
    return isJson ? JSON.parse(storageData) : storageData
  } catch (error) {
    console.error('Error parsing stored data:', error)
    return storageData
  }
}

export const toStoredData = (data, isJson = true) => {
  return isJson ? JSON.stringify(data) : data
}

export const getStorageData = (key, isJson = true) => {
  const storedData = localStorage.getItem(key)
  return storedData ? fromStoredData(storedData, isJson) : null
}

export const setStorageData = (key, data, isJson = true) => {
  localStorage.setItem(key, toStoredData(data, isJson))
}

export const removeStorageData = key => localStorage.removeItem(key)

const CACHE_VERSION = 1
const CACHE_NAME = `myapp-${CACHE_VERSION}`

// Try to get data from the cache, but fall back to fetching it live.
export async function getData(url) {
  if (typeof window.caches !== `undefined`) {
    const cachedData = await getCachedData(url)

    if (cachedData) {
      console.log('Retrieved cached data')
      return cachedData
    }

    console.log('Fetching fresh data')

    return cachedData
  }
  return false
}

export async function setData(url) {
  const cacheStorage = await caches.open(CACHE_NAME)
  await cacheStorage.add(url)
  const cachedData = await getCachedData(url)
  await deleteOldCaches()

  return cachedData
}

// Get data from the cache.
export async function getCachedData(url) {
  const cacheStorage = await caches.open(CACHE_NAME)
  const cachedResponse = await cacheStorage.match(url)

  console.log('cr', cachedResponse)
  if (!cachedResponse || !cachedResponse.ok) {
    return false
  }
  return cachedResponse.url ? cachedResponse.url : false
}

// Delete any old caches to respect user's disk space.
export async function deleteOldCaches() {
  // const keys = await caches.keys()
  //
  // for (const key of keys) {
  //   const isOurCache = `myapp-` === key.substr(0, 6)
  //
  //   if (cacheName === key || !isOurCache) {
  //     continue
  //   }
  //
  //   // eslint-disable-next-line no-await-in-loop
  //   await caches.delete(key)
  // }
  await caches.delete(CACHE_NAME)
}

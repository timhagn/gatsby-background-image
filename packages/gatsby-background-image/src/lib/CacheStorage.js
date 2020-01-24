const cacheVersion = 1

// Try to get data from the cache, but fall back to fetching it live.
export async function getData(url) {
  if (caches)
  const cacheName = `myapp-${cacheVersion}`
  const cachedData = await getCachedData(cacheName, url)

  if (cachedData) {
    console.log('Retrieved cached data')
    return cachedData
  }

  console.log('Fetching fresh data')

  return cachedData
}

export async function setData(url) {
  const cacheName = `myapp-${cacheVersion}`
  const cacheStorage = await caches.open(cacheName)
  await cacheStorage.add(url)
  const cachedData = await getCachedData(cacheName, url)
  await deleteOldCaches(cacheName)

  return cachedData
}

// Get data from the cache.
export async function getCachedData(cacheName, url) {
  const cacheStorage = await caches.open(cacheName)
  const cachedResponse = await cacheStorage.match(url)

  if (!cachedResponse || !cachedResponse.ok) {
    return false
  }
  return await cachedResponse.json()
}

// Delete any old caches to respect user's disk space.
export async function deleteOldCaches(currentCache) {
  const keys = await caches.keys()

  for (const key of keys) {
    const isOurCache = `myapp-` === key.substr(0, 6)

    if (currentCache === key || !isOurCache) {
      continue
    }

    caches.delete(key)
  }
}
//
// try {
//   const data = await getData();
//   console.log( { data } );
// } catch ( error ) {
//   console.error( { error } );
// }

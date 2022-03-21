import type { RouteRecordRaw } from 'vue-router'


/**
 * Get all vue-router paths
 * @param {RouteRecordRaw[]} routes
 * @param {string} path
 * @return {string[]}
 */
export const getAllRoutePaths = (routes: RouteRecordRaw[], path = ''): string[] => {
  const res: string[] = []

  routes.forEach((route: RouteRecordRaw) => {
    let currentPath = path

    if (route.path.startsWith('/')) {
      res.push(route.path)
      if (route.children) {
        res.push(...getAllRoutePaths(route.children, route.path))
      }
    } else {
      currentPath = `${ currentPath }/${ route.path }`
      res.push(currentPath)
      if (route.children) {
        res.push(...getAllRoutePaths(route.children, currentPath))
      }
    }
  })

  return res
}


/**
 * Download file using `<a>` link
 * @param {BlobPart} blob
 * @param {string} mime
 * @param {string} filename
 */
export const downloadFile = (blob: BlobPart, mime = '', filename = ''): void => {
  const url = URL.createObjectURL(new Blob([blob], { type: mime }))
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('target', '_blank')
  link.setAttribute('rel', 'noopener noreferrer')
  link.setAttribute('download', filename)
  link.click()

  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

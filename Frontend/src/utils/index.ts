import type { RouteRecordRaw } from 'vue-router'


export const getAllRoutePaths = (routes: RouteRecordRaw[], path: string): string[] => {
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

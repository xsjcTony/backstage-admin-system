import type { RouteRecordRaw } from 'vue-router'


export const getAllRoutePaths = (routes: RouteRecordRaw[]): string[] => {
  const res: string[] = []

  routes.forEach((route: RouteRecordRaw) => {
    res.push(route.path)
    if (route.children) {
      res.push(...getAllRoutePaths(route.children))
    }
  })

  return res
}

// composables/useLeaveGuard.ts
import { onBeforeRouteLeave } from 'vue-router'

export function useLeaveGuard(message: string, onLeave?: () => void) {
  onBeforeRouteLeave((to, from, next) => {
    if (window.confirm(message)) {
      onLeave?.()
      next()
    } else {
      next(false)
    }
  })
}

import { useShowProfileSetupModal } from "../composables/useShowProfileSetupModal";

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.query.authenticated === 'true' && process.client) {
    const { refreshSession, getUser } = useSession();
    await refreshSession()

    const user = await getUser()
    if ( user && user.explicitlySetProfile === false ) {
      const showModal = useShowProfileSetupModal()
      showModal.value = true
    }

    // クエリを削除してURLを再構築
    const { origin, pathname, hash } = window.location
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete('authenticated')
    
    const newUrl = `${origin}${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}${hash}`
    setTimeout(() => {
      window.history.replaceState(null, '', newUrl)
    }, 1);
  }
})

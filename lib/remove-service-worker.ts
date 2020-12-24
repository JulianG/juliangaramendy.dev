export function removeServiceWorker() {
  if (typeof window !== 'undefined') {
    if ('serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.ready.then((registration) => {
        registration.unregister()
      })
    }
  }
}

export function removeServiceWorker() {
  if (typeof window !== 'undefined') {
    console.log('removing service worker:')
    if ('serviceWorker' in window.navigator) {
      console.log('  found serviceWorker in window.navigator')
      window.navigator.serviceWorker.ready.then((registration) => {
        console.log('  unregistering service worker')
        registration.unregister()
        console.log('  done')
      })
    }
  }
}

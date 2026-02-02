type AnalyticsPayload = Record<string, string | number | boolean | undefined>

export const useAnalytics = () => {
  const config = useRuntimeConfig()

  const trackEvent = (event: string, payload: AnalyticsPayload = {}) => {
    if (process.server) return
    if (!config.public.analyticsProvider) return

    const detail = {
      event,
      ...payload,
    }

    if (Array.isArray((window as any).dataLayer)) {
      ;(window as any).dataLayer.push(detail)
      return
    }

    window.dispatchEvent(new CustomEvent('analytics:event', { detail }))
  }

  return { trackEvent }
}

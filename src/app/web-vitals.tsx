'use client'

/**
 * Web Vitals Reporting
 * Tracks Core Web Vitals metrics
 */

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric.name, metric.value)
    }

    // In production, send to analytics service
    // Example: window.gtag?.('event', metric.name, { value: metric.value })

    // Performance thresholds
    const thresholds: Record<string, number> = {
      CLS: 0.1, // Cumulative Layout Shift
      FID: 100, // First Input Delay (ms)
      FCP: 1800, // First Contentful Paint (ms)
      LCP: 2500, // Largest Contentful Paint (ms)
      TTFB: 800, // Time to First Byte (ms)
      INP: 200, // Interaction to Next Paint (ms)
    }

    const threshold = thresholds[metric.name]
    if (threshold && metric.value > threshold) {
      console.warn(
        `⚠️ Poor ${metric.name}: ${Math.round(metric.value)} (threshold: ${threshold})`
      )
    }
  })

  return null
}

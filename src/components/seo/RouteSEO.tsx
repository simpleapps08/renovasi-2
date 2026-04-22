import { useEffect } from "react"

interface RouteSEOProps {
  title: string
  description: string
  canonical: string
  jsonLd?: Record<string, unknown>
}

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement("meta")
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

const RouteSEO = ({ title, description, canonical, jsonLd }: RouteSEOProps) => {
  useEffect(() => {
    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })

    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonical)

    if (jsonLd) {
      let script = document.head.querySelector('#route-jsonld') as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = 'route-jsonld'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    }
  }, [title, description, canonical, jsonLd])

  return null
}

export default RouteSEO

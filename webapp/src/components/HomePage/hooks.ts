import { useEffect } from 'react'
import { HomepageView } from '../../modules/ui/asset/homepage/types'

type IntersectionObserverProps = {
  refs: Map<HomepageView, HTMLDivElement>
  onIntersect: (view: HomepageView) => void
  options?: IntersectionObserverInit
}

export const useIntersectionObserver = ({ refs, onIntersect, options = {} }: IntersectionObserverProps) => {
  useEffect(() => {
    // Keep track of which sections have been loaded
    const loadedSections = new Set<HomepageView>()

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // Find which view this element corresponds to
          const view = Array.from(refs.entries()).find(([_, element]) => element === entry.target)?.[0]

          if (view && entry.isIntersecting && !loadedSections.has(view)) {
            loadedSections.add(view)
            onIntersect(view)
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options
      }
    )

    // Observe all section refs
    refs.forEach(element => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
    }
  }, [refs, onIntersect, options])
}

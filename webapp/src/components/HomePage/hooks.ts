import { useEffect, useRef } from 'react'
import { HomepageView } from '../../modules/ui/asset/homepage/types'

type IntersectionObserverProps = {
  refs: Map<HomepageView, HTMLDivElement>
  onIntersect: (view: HomepageView) => void
  options?: IntersectionObserverInit
}

export const useIntersectionObserver = ({ refs, onIntersect, options = {} }: IntersectionObserverProps) => {
  // Move loadedSections to useRef so it persists between renders
  const loadedSections = useRef(new Set<HomepageView>())

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const view = Array.from(refs.entries()).find(([_, element]) => element === entry.target)?.[0]

          if (view && entry.isIntersecting && !loadedSections.current.has(view)) {
            loadedSections.current.add(view)
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

    // Clean up previous observations before setting new ones
    const elements = Array.from(refs.values())
    elements.forEach(element => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
      // Don't clear loadedSections on unmount to prevent re-fetching if component remounts
    }
  }, [refs, onIntersect, options])
}

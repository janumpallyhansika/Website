"use client"

import { useEffect } from "react"

export function ArticleReadTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    // Fire-and-forget read tracking
    fetch(`/api/articles/${articleId}/read`, { method: "POST" }).catch(() => {})
  }, [articleId])

  return null
}

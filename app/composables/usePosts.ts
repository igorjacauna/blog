export function usePostsQuery(limit?: number) {
  return useAsyncData(`posts-${limit ?? 'all'}`, () => {
    let query = queryCollection('posts')
      .select('path', 'title', 'date', 'readingTime', 'draft')
      .order('date', 'DESC')
    if (!import.meta.dev)
      query = query.where('draft', '=', false)
    if (limit)
      query = query.limit(limit)
    return query.all()
  })
}

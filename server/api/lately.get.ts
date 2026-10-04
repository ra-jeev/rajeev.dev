const FEED_URL = 'https://whatdidyougetdonetoday.dev/@ra-jeev/feed.json'
const MAX_POSTS = 5

interface FeedPost {
  id: number
  day: string
  text: string
  url: string
  products?: { handle: string, name: string, url: string }[]
}

interface Feed {
  profile: string
  posts: FeedPost[]
}

// Cached on the server so each visit does not hit whatdidyougetdonetoday.dev.
// A failed fetch throws, and Nitro does not cache errors, so the next request retries.
export default defineCachedEventHandler(async () => {
  const feed = await $fetch<Feed>(FEED_URL, { timeout: 5000 })

  return {
    profile: feed.profile,
    posts: feed.posts.slice(0, MAX_POSTS).map(post => ({
      id: post.id,
      day: post.day,
      text: post.text.replace(/\n{2,}/g, '\n'),
      url: post.url,
      products: (post.products || []).map(({ name, url }) => ({ name, url })),
    })),
  }
}, {
  name: 'wdygdt-lately',
  maxAge: 60 * 15,
  swr: true,
})

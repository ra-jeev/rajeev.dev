export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'posts')
    .order('date', 'DESC')
    .all()

  const siteUrl = 'https://rajeev.dev'
  const items = posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}${post.path}</link>
      <guid>${siteUrl}${post.path}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description || ''}]]></description>
    </item>
  `).join('')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Rajeev</title>
    <link>${siteUrl}</link>
    <description>Writing by Rajeev.</description>
    ${items}
  </channel>
</rss>`
})

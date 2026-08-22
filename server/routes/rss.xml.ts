const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'posts')
    .order('date', 'DESC')
    .all()

  const siteUrl = 'https://rajeev.dev'
  const items = posts.map((post) => {
    const url = `${siteUrl}${post.path}`
    const categories = (post.tags || [])
      .map(tag => `\n      <category><![CDATA[${tag}]]></category>`)
      .join('')

    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator><![CDATA[Rajeev R Sharma]]></dc:creator>
      <description><![CDATA[${post.description || ''}]]></description>${categories}
    </item>
  `
  }).join('')

  const lastBuildDate = posts.length
    ? new Date(posts[0]!.date).toUTCString()
    : new Date().toUTCString()

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Rajeev R Sharma</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Writing and projects by Rajeev R Sharma.</description>
    <language>en</language>
    <copyright>Rajeev R Sharma</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${siteUrl}/og.png</url>
      <title>Rajeev R Sharma</title>
      <link>${siteUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`
})

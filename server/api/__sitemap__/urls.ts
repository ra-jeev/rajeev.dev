import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async (event) => {
  const posts = await queryCollection(event, 'posts')
    .select('path', 'date')
    .order('date', 'DESC')
    .all()

  return [
    asSitemapUrl({ loc: '/', changefreq: 'weekly' }),
    asSitemapUrl({ loc: '/blog', changefreq: 'weekly' }),
    asSitemapUrl({ loc: '/archive', changefreq: 'weekly' }),
    asSitemapUrl({ loc: '/about', changefreq: 'monthly' }),
    ...posts.map((post) => asSitemapUrl({
      loc: post.path,
      lastmod: post.date,
    })),
  ]
})

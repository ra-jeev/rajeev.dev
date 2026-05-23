import { createHash } from 'node:crypto'
import { access, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'

const sourceDir = '/Users/rajeev/developer/den/hashnode-articles'
const projectRoot = new URL('..', import.meta.url).pathname
const postsDir = join(projectRoot, 'content/posts')
const draftsDir = join(projectRoot, 'content/drafts')
const imagesDir = join(projectRoot, 'public/images/posts')

const imageCache = new Map()
const failures = []

const quote = (value = '') => JSON.stringify(String(value))

const parseFrontmatter = (file) => {
  const match = file.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, body: file }
  }

  const data = {}
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!pair) continue

    const [, key, rawValue] = pair
    let value = rawValue.trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    data[key] = value
  }

  return { data, body: match[2].trimStart() }
}

const getDescription = (data, body) => {
  if (data.seoDescription) {
    return data.seoDescription
  }

  const cleaned = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .split(/\n{2,}/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .find(Boolean)

  if (!cleaned) {
    return ''
  }

  return cleaned.length > 180 ? `${cleaned.slice(0, 177).trim()}...` : cleaned
}

const imageNameFromUrl = (url) => {
  const parsed = new URL(url)
  const originalName = basename(parsed.pathname)
  const extension = extname(originalName) || '.png'
  const digest = createHash('sha1').update(url).digest('hex').slice(0, 10)
  const safeName = originalName
    .replace(extension, '')
    .replace(/[^A-Za-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'image'

  return `${safeName}-${digest}${extension}`
}

const downloadImage = async (url, slug) => {
  if (!url.startsWith('https://cdn.hashnode.com/')) {
    return url
  }

  const cacheKey = `${slug}:${url}`
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)
  }

  const imageName = imageNameFromUrl(url)
  const destinationDir = join(imagesDir, slug)
  const destinationPath = join(destinationDir, imageName)
  const publicPath = `/images/posts/${slug}/${imageName}`

  await mkdir(destinationDir, { recursive: true })

  try {
    try {
      await access(destinationPath)
      imageCache.set(cacheKey, publicPath)
      return publicPath
    } catch {
      // File is not present yet.
    }

    const response = await fetch(url, {
      signal: AbortSignal.timeout(12000),
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    await writeFile(destinationPath, buffer)
    imageCache.set(cacheKey, publicPath)
    return publicPath
  } catch (error) {
    failures.push(`${url} (${error.message})`)
    imageCache.set(cacheKey, url)
    return url
  }
}

const rewriteBody = async (body, slug) => {
  const imageRegex = /!\[([^\]]*)]\((https:\/\/cdn\.hashnode\.com\/[^)\s]+)(?:\s+align="[^"]+")?\)/g
  let rewritten = ''
  let lastIndex = 0

  for (const match of body.matchAll(imageRegex)) {
    rewritten += body.slice(lastIndex, match.index)
    const [, alt, url] = match
    const localUrl = await downloadImage(url, slug)
    rewritten += `![${alt}](${localUrl})`
    lastIndex = match.index + match[0].length
  }

  rewritten += body.slice(lastIndex)

  return rewritten
    .replace(/!\[([^\]]*)]\(([^)\s]+)\s+align="[^"]+"\)/g, '![$1]($2)')
    .replace(/%\[(https?:\/\/[^\]]+)]/g, (_match, url) => {
      return `::media-embed\n---\nurl: ${url.trim()}\n---\n::`
    })
    .replace(/\n{3,}/g, '\n\n')
}

const buildMarkdown = ({ data, body, draft, cover }) => {
  const tags = (data.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  const frontmatter = [
    '---',
    `title: ${quote(data.title || data.slug)}`,
    `description: ${quote(getDescription(data, body))}`,
    data.datePublished ? `date: ${quote(data.datePublished)}` : undefined,
    `slug: ${quote(data.slug)}`,
    cover ? `cover: ${quote(cover)}` : undefined,
    tags.length ? 'tags:' : 'tags: []',
    ...(tags.length ? tags.map((tag) => `  - ${quote(tag)}`) : []),
    `draft: ${draft ? 'true' : 'false'}`,
    data.cuid ? `hashnodeId: ${quote(data.cuid)}` : undefined,
    '---',
    '',
    body,
  ].filter((line) => line !== undefined)

  return `${frontmatter.join('\n').trimEnd()}\n`
}

await rm(postsDir, { recursive: true, force: true })
await rm(draftsDir, { recursive: true, force: true })
await mkdir(postsDir, { recursive: true })
await mkdir(draftsDir, { recursive: true })
await mkdir(imagesDir, { recursive: true })

const files = (await readdir(sourceDir)).filter((file) => file.endsWith('.md')).sort()
let published = 0
let drafts = 0

for (const file of files) {
  const raw = await readFile(join(sourceDir, file), 'utf8')
  const { data, body } = parseFrontmatter(raw)

  if (!data.slug) {
    continue
  }

  console.log(`Migrating ${data.slug}`)

  const draft = !data.datePublished
  const destinationDir = draft ? draftsDir : postsDir
  const localCover = data.cover ? await downloadImage(data.cover, data.slug) : undefined
  const rewrittenBody = await rewriteBody(body, data.slug)
  const markdown = buildMarkdown({
    data,
    body: rewrittenBody,
    draft,
    cover: localCover,
  })

  await writeFile(join(destinationDir, `${data.slug}.md`), markdown)

  if (draft) {
    drafts += 1
  } else {
    published += 1
  }
}

console.log(`Migrated ${published} published posts and ${drafts} drafts.`)

if (failures.length) {
  console.log(`Image download failures: ${failures.length}`)
  for (const failure of failures) {
    console.log(`- ${failure}`)
  }
}

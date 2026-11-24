import { Feed } from 'feed'

const site = 'https://igorjacauna.com.br'

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()

  const feed = new Feed({
    title: 'Igor Jacaúna',
    description: 'Vue, Nuxt, React, ferramentas open source e o que mais eu estiver construindo.',
    id: `${site}/`,
    link: `${site}/`,
    language: 'pt-BR',
    favicon: `${site}/favicon.svg`,
    copyright: 'CC BY-NC-SA 4.0 · Igor Jacaúna',
    feedLinks: { rss: `${site}/feed.xml` },
    author: { name: 'Igor Jacaúna', link: site },
  })

  for (const post of posts) {
    const url = `${site}${post.path}`
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      date: new Date(post.date),
      category: (post.tags ?? []).map(name => ({ name })),
    })
  }

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return feed.rss2()
})

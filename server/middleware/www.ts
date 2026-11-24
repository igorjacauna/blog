// 1. www.igorjacauna.com.br e http:// → https://igorjacauna.com.br (301)
// 2. Como o Worker roda antes dos arquivos estáticos (run_worker_first),
//    entrega direto o HTML pré-renderizado quando ele existe.
const dynamicPrefixes = ['/_studio', '/__nuxt_studio', '/__nuxt_content', '/api/']

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const isPreview = url.hostname === 'localhost' || url.hostname.endsWith('.workers.dev')

  if (!isPreview && (url.hostname.startsWith('www.') || url.protocol === 'http:')) {
    const host = url.hostname.replace(/^www\./, '')
    return sendRedirect(event, `https://${host}${url.pathname}${url.search}`, 301)
  }

  const assets = event.context.cloudflare?.env?.ASSETS as { fetch: (req: Request) => Promise<Response> } | undefined
  if (!assets || (event.method !== 'GET' && event.method !== 'HEAD'))
    return
  if (dynamicPrefixes.some(prefix => url.pathname.startsWith(prefix)))
    return

  const res = await assets.fetch(new Request(url, { method: event.method, headers: event.headers }))
  if (res.ok || res.status === 304)
    return res
})

module.exports = {
	title: 'Igor Jacaúna',
	dest: './public',
	locales: {
		/* This is where you place your general locale config */
		'/': {
		  lang: 'pt-BR',
		}
	},
	themeConfig: {
		domain: 'https://www.igorjacauna.com.br',
		repo: 'https://github.com/igorjacauna/blog',
		repoLabel: 'Repo',
		docsDir: 'content',
		editLinks: true,
		lastUpdated: 'Última atualização',
		editLinkText: 'Abrir um bug',
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Blog', link: '/blog/index.html' },
			// {
			// 	text: 'Sobre',
			// 	link: '/sobre/index.html'
			// },
			// { text: 'Contato', link: '/contato/index.html' }
		],
		user: {
			socialMedia: [
				{
					name: "Twitter",
					href: "https://twitter.com/ijacauna",
					icon: "twitter"
				},
				{
					name: "Facebook",
					href: 'https://facebook.com/igorjacauna',
					icon: "facebook"
				},
				{
					name: "GitLab",
					href: "https://gitlab.com/igorjacauna",
					icon: "gitlab"
				},
				{
					name: "GitHub",
					href: "https://github.com/igorjacauna",
					icon: "github"
				}
			]
		}
	},
	plugins: [
		[
			'@vuepress/google-analytics',
			{
				ga: ''
			}
		],
		[
			'vuepress-plugin-rss',
			{
				base_url: '/',
				site_url: 'https://www.igorjacauna.com.br',
				filter: frontmatter => frontmatter.date <= new Date(),
				count: 20
			}
		],
		'vuepress-plugin-janitor'
	],
	head: [
		[
			'link',
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=PT+Serif:400,700|Poppins:500,700'
			}
		],
		[
			'link',
			{ rel: 'apple-touch-icon', sizes: '57x57', href: '/apple-icon-57x57.png' }
		],
		[
			'link',
			{ rel: 'apple-touch-icon', sizes: '60x60', href: '/apple-icon-60x60.png' }
		],
		[
			'link',
			{ rel: 'apple-touch-icon', sizes: '72x72', href: '/apple-icon-72x72.png' }
		],
		[
			'link',
			{ rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-icon-76x76.png' }
		],
		[
			'link',
			{
				rel: 'apple-touch-icon',
				sizes: '114x114',
				href: '/apple-icon-114x114.png'
			}
		],
		[
			'link',
			{
				rel: 'apple-touch-icon',
				sizes: '120x120',
				href: '/apple-icon-120x120.png'
			}
		],
		[
			'link',
			{
				rel: 'apple-touch-icon',
				sizes: '144x144',
				href: '/apple-icon-144x144.png'
			}
		],
		[
			'link',
			{
				rel: 'apple-touch-icon',
				sizes: '152x152',
				href: '/apple-icon-152x152.png'
			}
		],
		[
			'link',
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/apple-icon-180x180.png'
			}
		],
		[
			'link',
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '192x192',
				href: '/android-icon-192x192.png'
			}
		],
		[
			'link',
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/favicon-32x32.png'
			}
		],
		[
			'link',
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '96x96',
				href: '/favicon-96x96.png'
			}
		],
		[
			'link',
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/favicon-16x16.png'
			}
		],
		['link', { rel: 'manifest', href: '/manifest.json' }],
		['meta', { name: 'msapplication-TileColor', content: '#ffffff' }],
		[
			'meta',
			{ name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' }
		],
		['meta', { name: 'theme-color', content: '#ffffff' }],
		['script', { async: true, src: "https://static.codepen.io/assets/embed/ei.js" }],
		['script', { async: true, src: "https://platform.twitter.com/widgets.js", charset: "utf-8" }]
	]
}
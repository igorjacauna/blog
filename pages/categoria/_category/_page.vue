<template>
  <div
    class="flex flex-wrap-reverse"
    :class="{
      'lg:-mx-8': settings.layout === 'single',
    }"
  >
    <div
      class="w-full py-4 lg:pt-8 lg:pb-4 dark:border-gray-800"
      :class="{
        'lg:border-l lg:border-r': settings.layout !== 'single',
      }"
    >
      <article
        v-for="(document, index) of documents"
        :key="index"
        class="prose dark:prose-dark max-w-none lg:px-8 mb-20"
      >
        <h1 class="flex items-center justify-between">
          {{ document.title }}
          <Badge v-if="document.category">{{ document.category }}</Badge>
        </h1>
        <div v-if="document.subtitle" class="-mt-4">
          <p class="text-gray-600 dark:text-gray-400">
            {{ document.subtitle }}
          </p>
        </div>
        <div>
          <NuxtContent :document="{ body: document.excerpt }" />
          <NuxtLink :to="document.to">Continuar...</NuxtLink>
        </div>
      </article>
      <AppPrevNextPage :prev="prev" :next="next" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageCategory",
  async asyncData({ $content, store, route, params, error }) {
    const currentPage = Number(params.page) || 1;
    const category = params.category;
    const perPage = 3;

    const all = await $content({ deep: true })
      .where({
        category,
      })
      .fetch();

    const totalArticles = all.length;
    const lastPage = await Math.ceil(totalArticles / perPage);
    const lastPageCount = totalArticles % perPage || 1;

    const skipNumber = () => {
      if (currentPage === 1) {
        return 0;
      }
      if (currentPage === lastPage) {
        return totalArticles - lastPageCount;
      }
      return (currentPage - 1) * perPage;
    };

    const documents = await $content({ deep: true })
      .where({ category })
      .sortBy("createdAt", "desc")
      .limit(perPage)
      .skip(skipNumber())
      .fetch();
    if (!documents.length === 0) {
      return error({ statusCode: 404, message: "Não encontrei nada" });
    }

    const [prev, next] = [
      {
        to:
          currentPage > 1 ? `/categoria/${category}/${currentPage - 1}` : false,
      },
      {
        to:
          currentPage !== lastPage
            ? `/categoria/${category}/${currentPage + 1}`
            : false,
      },
    ];

    return {
      documents,
      prev,
      next,
      currentPage,
      lastPageCount,
      lastPage,
    };
  },
  computed: {
    ...mapGetters(["settings"]),
  },
  head() {
    return {
      title: this.$route.params.category,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Posts em ${this.$route.params.category}`,
        },
        // Open Graph
        {
          hid: "og:title",
          property: "og:title",
          content: this.$route.params.category,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: `Posts em ${this.$route.params.category}`,
        },
        // Twitter Card
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: this.$route.params.category,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: `Posts em ${this.$route.params.category}`,
        },
      ],
    };
  },
};
</script>
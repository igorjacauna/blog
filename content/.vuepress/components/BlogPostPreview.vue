<script>
export default {
    name: 'BlogPostPreview',
    props: {
        publishDate: {
            type: String,
            required: true
        },
        tags: {
            type: Array,
            required: false,
            default: () => {
                return []
            }
        },
        title: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        excerpt: {
            type: String,
            required: false
        }
    },
    computed: {
        formatPublishDate() {
            const dateFormat = new Date(this._props.publishDate)
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            } 
            
            return dateFormat.toLocaleDateString('pt-BR', options)
        }
    }
}
</script>

<template>
	<section class="blog-post">
        <time class="blog-post__time">{{ formatPublishDate }}</time>
        <h2 class="blog-post__title">
            <a :href="path" class="blog-post__link">{{ title }}</a>
        </h2>
        <span class="blog-post__time" v-if="tags.length > 0">Tags:</span>
        <ul v-for="tag in tags" class="blog-post__tags">
          <li>
            <button @click="$emit('updateSelectedTag', tag)">{{ tag }}</button>
          </li>
        </ul>
        <p v-if="excerpt" class="blog-post__excerpt">{{ excerpt }}</p>
        <a class="button blog-post__button " :href="path">Ler mais ></a>
    </section>
</template>

<style lang="stylus" scoped>
primary-color = #22AAFF

.blog-post {
    margin-bottom: 2.5rem;
}

.blog-post__button {
	display: inline-block;
}

.blog-post__excerpt {
    margin-top: 0;
    font-size: 1.2rem;
}

.blog-post__link {
    font-weight: 700;
    color: #2c3e50;

    &:hover {
        text-decoration: underline;
    }
}

.blog-post__time {
    font-family: 'Poppins';
    font-weight: 500;
}

.blog-post__title {
	margin-top: 0.5rem;
    margin-bottom: 0;
}

.blog-post__tags {
    list-style: none; 
    display: inline-block;
    padding: 0;
    margin-bottom: 10px;
}

.blog-post__tags li {
    display: inline-block;
    padding: 5px;    
}

.blog-post__tags button {
    display: inline-block;
    padding: 0 25px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    border-radius: 25px;
    border: 1px solid;
    border-color: primary-color;
    background-color: #fff;
    cursor: pointer;
    color: primary-color;
}

.blog-post__tags button:hover {
    background-color: rgba(34, 170, 255, .1);
}

.button {
    font-family: 'Poppins';
    font-weight: 500;
	border: 1px solid primary-color;
	border-radius: 4px;
	color: primary-color;
	font-size: 0.9rem;
	padding: 0.3rem 0.6rem;
	text-transform: uppercase;
	box-shadow: 0 0;
	transition: background-color 0.2s ease-in, color 0.2s ease-in;
}

.button:hover {
    background-color: primary-color;
    color: #fff;
    text-decoration: none;
}

.tag-list {
    list-style: none;
    padding-left: 0;
    display: flex;
    margin-bottom: 25px;
}

.tag-list__item {
    margin-left: 10px;
}

.tag-list__item:first-child {
    margin-left: 0;
}

.tag-list__btn {
    padding: 5px;
    font-size: 0.9rem;
    background-color: #fff;
}
</style>

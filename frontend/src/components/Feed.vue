<template>
    <section id="feed" class="mt-5">
        <div class="feed-posts mx-auto">
            <ul v-if="posts.length > 0" class="mx-auto">
                <li v-for="(post) in posts" :key="post.id" class="mb-5">
                    <PostItem v-bind:post="post" @postdeleted="getAllPosts()" @postupdated="getAllPosts()" />
                </li>
            </ul>
            <p v-else class="zero-post text-center">No posts published yet!</p>
        </div>
    </section>
</template>

<script>
import PostItem from "@/components/PostItem.vue";
import Api from '../services/Api';

export default {
  name: 'FeedCompo',
  components: {
    PostItem
  },
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    async getAllPosts() {
      const token = localStorage.getItem("token");

      try {
          const response = await Api.get('posts', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });

          this.posts = response.data;

          //console.log('posts dans Feed', this.posts);

          this.$store.dispatch('setPosts', response.data);
          
      } catch (error) {
          console.log(error);  
      }
    }
  },
  async beforeMount() {
    this.getAllPosts();
  }
}

</script>

<style scoped>
    ul {
      list-style-type: none;
      padding-left: 0;
    }

    .feed-title {
      font-size: 1.5rem;
      display: inline-block;
      border-bottom: 3px solid #FD5835;
    }

    .zero-post {
      font-size: 2rem;
      font-weight: 500;
    }
    
</style>
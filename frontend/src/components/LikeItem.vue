<template>
    <div class="card d-flex bg-white p-3 border-0 like-item">
        <div class="like-btn-container py-1 d-flex align-items-center justify-content-between">
            <button type="button" @click="handleLike" class="p-2 like-btn border-0 d-flex justify-content-center align-items-center" >
                <i v-if="!isLiked" class="far fa-heart like-icon me-2" ref="icon"></i>
                <i v-if="isLiked" class="fas fa-heart like-icon me-2" ref="icon"></i>
                <span v-if="!isLiked" class="like-text color-grey" ref="text">I like</span>
                <span v-if="isLiked" class="like-text color-groupo" ref="text">Like</span>
            </button>
            <span class="count-like p-2">{{ countLikes }} Like</span>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import Api from '../services/Api';

    export default {
        name: 'LikeItem',
        props: {
            postId: Number,
            likes: Array
        },
        data() {
            return {
                countLikes: this.$props.likes.length
            };
        },
        computed: {
            ...mapGetters(["user"]),
            isLiked() {
                const likesUserIdList = this.$props.likes.map(like => like.User.id);
                const userId = this.$store.state.user.id;
                return likesUserIdList.includes(userId);
            }
        },
        methods: {
            async handleLike() {

                // Affichage du like                
                this.displayLike();

                // Logique du like
                const postId = this.$props.postId;
                const token = localStorage.getItem("token");

                try {
                    await Api.post(`posts/${postId}/like`, null, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                } catch (error) {
                    console.log(error.response.data);
                }

            },
            displayLike() {
                const likeIcon = this.$refs.icon;
                const likeText = this.$refs.text;

                if (likeIcon.classList.contains('far')) {
                    likeIcon.classList.replace('far', 'fas');
                    likeIcon.classList.add('anim');
                    likeText.classList.replace('color-grey','color-groupo');
                    this.countLikes++;
                } else {
                    likeIcon.classList.replace('fas', 'far');
                    likeIcon.classList.remove('anim');
                    likeText.classList.replace('color-groupo','color-grey');
                    this.countLikes--;
                }
            }
        }
    }
</script>

<style scoped>
    .like-btn-container {
        border-top: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
    }

    .like-btn {
        border-radius: 5px;
        background-color: #fff;
    }

    .like-btn:hover {
        background-color: #efefef;
        cursor: pointer;
    }

    .like-icon {
        font-size: 18px;
    }

    @keyframes like-button-animation {
        0% {
            -webkit-transform: scale(1);
            transform: scale(1)
        }

        25% {
            -webkit-transform: scale(1.2);
            transform: scale(1.2)
        }

        50% {
            -webkit-transform: scale(.95);
            transform: scale(.95)
        }
        100% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }

    .anim {
        -webkit-animation-duration: .45s;
        animation-duration: .45s;
        -webkit-animation-name: like-button-animation;
        animation-name: like-button-animation;
        -webkit-animation-timing-function: ease-in-out;
        animation-timing-function: ease-in-out;
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    .like-text {
        font-weight: 500;
        user-select: none;
    }

    .fas {
        color: #FD5835;
    }

    .color-groupo {
        color: #FD5835;
    }

    .color-grey {
        color: #2C3E50;
    }

    .count-like {
        font-weight: 500;
    }
    
</style>
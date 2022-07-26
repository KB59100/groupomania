<template>
    <div class="card newcomment-card border-0" id="newcomment">
        <form class="bg-white p-3" @submit.prevent="handleSubmit" id="commentForm" enctype="multipart/form-data">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="me-2">
                    <img class="rounded-circle avatar" :src="user.avatar" alt="avatar">
                </div>
                <div class="me-auto w-100">
                    <textarea @click="resetErrorMessage" v-model="message" type="text" class="form-control"
                        v-bind:id="'newCommentInput' + postId" placeholder="Write a comment..." rows="3" />
                    </div>
            </div>
        
            <p v-if="!valid" class="validFeedback">{{ errorMessage }}</p>

            <div class="d-flex justify-content-end mb-2 card-btns">
                <button type="submit" class="btn btn-groupo">Answer</button>
            </div>

        </form>
    </div>

</template>

<script>
    import { mapGetters } from "vuex";
    import Api from '../services/Api';

    export default {
        name: 'NewComment',
        props: {
            postId: Number
        },
        data() {
            return {
                valid: true,
                errorMessage: '',
                message: ''
            };
        },
        computed: {
            ...mapGetters(["user"])
        },
        methods: {
            async handleSubmit() {
                const body = { content: this.message };
                const postId = this.$props.postId;
                const token = localStorage.getItem("token");

                try {
                    await Api.post(`posts/${postId}/comment`, body, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    this.message = '';
                    this.errorMessage = '';
                    this.$router.go();

                } catch (error) {
                    console.log(error.response.data);
                    this.valid = false;
                    this.errorMessage = error.response.data.message;
                }


            },
            resetErrorMessage() {
                this.valid = true;
            }
        }
    }
</script>

<style scoped>
    textarea {
        resize: none;
        background: #fcfbfb;
    }

    .newcomment-card {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        border-top: 0;
    }

    .newcomment-card form {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
    }
    
    .avatar {
        width: 30px;
        height: 30px;
        object-fit: cover;
    }

    .validFeedback {
        color: red;
    }
</style>
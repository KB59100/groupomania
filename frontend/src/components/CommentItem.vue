<template>
    <div class="card comment-card border-0 px-3">
        <div class="card-header border-0 px-3 py-2">
            <div class="d-flex justify-content-between align-items-center">

                <div class="d-flex justify-content-between align-items-center">
                    <div class="me-1">
                        <img class="rounded-circle avatar" :src="comment.User.avatar" alt="avatar">
                    </div>
                    <div class="ms-1">
                        <div class="h5 m-0 comment-username">{{ comment.User.username }}</div>
                        
                    </div>
                </div>

                <div v-if="user.id === comment.User.id || user.isAdmin" class="dropdown">
                    <a class="btn btn-white" type="button" v-bind:id="'dropdownMenuButton' + comment.id" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fas fa-ellipsis-h ellipsis-icon"></i>
                    </a>

                    <ul class="dropdown-menu dropdown-menu-right" v-bind:aria-labelledby="'dropdownMenuButton' + comment.id">
                        <li><button v-if="user.id === comment.User.id" class="dropdown-item" @click="editComment(comment.id)">Edit</button></li>
                        <li><button class="dropdown-item dropdown-item-delete" @click="deleteComment(comment.id)">To delete</button></li>
                    </ul>
                    
                </div>

            </div>
        </div>

        <div v-show="!toModify" class="card-body px-3 pt-1">
            <p class="card-text" ref="commentContent"></p>
        </div>

        <!-- Display when editing the comment -->
        <div v-show="toModify" class="card-body px-3 pt-1">
            <h3 class="text-center mb-3">Edit comment</h3>
            <form @submit.prevent="handleSubmit" id="commentEditForm" enctype="multipart/form-data" class="mb-5">
                <div class="mb-3">
                    <label v-bind:for="'commentInput' + comment.id" class="form-label">Comment</label>
                    <textarea @click="resetErrorMessage" v-model="messageEdit" type="text" class="form-control" v-bind:id="'commentInput' + comment.id" rows="3" />
                </div>
                <p v-if="!validEdit" class="validFeedback">{{ errorMessageEdit }}</p>
                <button @click.prevent="abort" class="btn btn-white btn-space btn-abort">Cancel</button>
                <button :disabled="!validEdit" type="submit" class="btn btn-groupo">Save</button>
            </form>
        </div>

        <div class="card-footer bg-white border-0 px-3 pt-0 pb-1">
            <p class="text-muted comment-time mb-1">{{ formatTime(comment.createdAt) }}</p>
        </div>
    </div>

</template>

<script>
    import { mapGetters } from "vuex";
    import moment from 'moment';
    
    moment.locale('en');
    
    import Api from '../services/Api';
    import getClickableLink from '../utils/getClickableLink';

    export default {
        name: 'CommentItem',
        props: {
            comment: Object,
            postId: Number
        },
        data() {
            return {
                commentId: null,
                messageEdit: this.$props.comment.content,
                validEdit: true,
                errorMessageEdit: '',
                toModify: false,
            };
        },
        computed: {
            ...mapGetters(["user"])
        },
        methods: {
            
            formatTime(time) {
                const now = moment();
                

                moment.relativeTimeThreshold('m', 60);
                moment.relativeTimeThreshold('h', 24);
                

                if (now.diff(time, 'years') > 0) {
                    return moment(time).format('Do MMM ');
                } else if (now.diff(time, 'minutes') > 2025 ) {
                    return moment(time).format('Do MMM, h:mm: a ');
                } else {
                    return moment(time).fromNow();
                }
                
            },
            async deleteComment(id) {

                const token = localStorage.getItem("token");
                const postId = this.$props.postId;
                const commentId = id;

                let okToDelete = confirm('Are you sure you want to delete this comment?')
                if (!okToDelete) {
                    return
                }

                try {
                    await Api.delete(`posts/${postId}/comment/${commentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    alert('Comment deleted!');
                    this.$router.go();

                } catch (error) {
                    console.log(error.response.data);
                }
            },
            editComment(id) {
                this.toModify = true;
                this.commentId = id;
            },
            async handleSubmit() {
      
                const token = localStorage.getItem("token");
                const postId = this.$props.postId;
                const commentId = this.commentId;

                const body = { content: this.messageEdit };

                try {
                    await Api.put(`posts/${postId}/comment/${commentId}`, body, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });

                    alert('The comment has been edited successfully.');

                    this.messageEdit = '';
                    this.toModify = false;
                    this.$router.go();

                } catch (error) {
                    console.log(error.response.data);
                    this.validEdit = false;
                    this.errorMessageEdit = error.response.data.message;
                }
            },
            abort() {
                this.toModify = false;
                this.messageEdit = this.$props.comment.content;
                this.errorMessageEdit = '';
                this.validEdit = true;
            },
            resetErrorMessage() {
                this.validEdit = true;
            }
        },
        mounted() {
            this.$refs.commentContent.innerHTML = getClickableLink(this.$props.comment.content);
        }
    }
</script>

<style scoped>
    .comment-card .card-header, .comment-card .card-body {
        background-color: #f7f8fa;
    }

    .comment-card .card-header {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }

    .comment-card .card-body {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
    }
    
    .avatar {
        width: 30px;
        height: 30px;
        object-fit: cover;
    }

    .comment-username {
        font-size: 1rem;
    }

    .ellipsis-icon {
        color: #65676B;
        font-size: 13px;
    }

    .card-text {
        font-size: 0.9rem;
        white-space: pre-wrap;
    }

    .comment-time {
        font-size: 0.8rem;
    }

    textarea {
        resize: none;
        background: #fcfbfb;
    }

    .btn-space {
        margin-right: 10px;
    }

    .btn-abort {
        background-color: #FFF;
    }

    .btn-abort:hover {
        background-color: #d6d6d6;
    }
    
    .validFeedback {
        color: red;
    }

    .dropdown-item {
        font-weight: 500;
    }

    .dropdown-item:active {
        color: #fff;
    }

    .dropdown-item.dropdown-item-delete:active {
        background-color: red;
    }
    
</style>
import { createStore } from 'vuex'
import jwt_decode from "jwt-decode";




export default createStore({
  state: {
    user: null,
    logged: false,
    posts: []
  },
  getters: {
    user(state) {
      return state.user
    },
    loggedIn(state) {
      return state.logged
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_LOGIN(state) {
      state.logged = true
    },
    SET_LOGOUT(state) {
      state.logged = false
      state.user = null
      state.posts = []
    },
    SET_POSTS(state, posts) {
      state.posts = posts
    }
  },
  actions: {
    setUser(context, user) {
      context.commit('SET_USER', user)
    },
    setLogin({ commit }) {
      commit('SET_LOGIN')
    },
    setLogout({ commit }) {
      commit('SET_LOGOUT')
    },
    setPosts(context, posts) {
      context.commit('SET_POSTS', posts)
    },
    checkToken({ commit }) {
      if(localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        
        const decodedToken = jwt_decode(token);
        //console.log('*** Hours Left Until Token Expiration ***', Math.round(((decodedToken.exp * 1000) - Date.now())/1000/3600*100)/100);

        // Check if token is expired

        if(Date.now() >= decodedToken.exp * 1000) {
          console.log('expired token');
          alert('Session expired - please log in again');
          localStorage.clear();
          commit('SET_LOGOUT');
        } else {
            commit('SET_LOGIN')
            commit('SET_USER', JSON.parse(localStorage.getItem("user")))
        }

      } else {
        console.log('no token')
        commit('SET_LOGOUT')
      }
    }
    
  },
  modules: {
  }
})
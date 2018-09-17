import Vuex from 'vuex'
import share from './modules/share'
import books from './modules/books'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    share,
    books,
  },
  strict: debug,
})

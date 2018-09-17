import Vuex from 'vuex'
import position from './modules/position'


const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    position,
  },
  strict: debug,
})

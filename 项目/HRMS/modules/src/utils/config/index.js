import init from './init'
import basic from './basic'
import request from './request'
import dictionary from './dictionary'

export default {
  init,
  ...basic,
  ...request,
  dictionary,
}

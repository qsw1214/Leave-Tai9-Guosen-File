<template>
  <div class="images" v-if='imgList.length > 0'>
    <template v-for='(img,index) in imgList'>
      <div class="image" v-tap='{ methods: zoomPicture, index: index}'>
        <img :src="img.img_thumb">
      </div>
    </template>
  </div>
</template>

<script>
  import JSBridge from 'helper/JSBridge'

  export default {
    name: 'Images',
    props: {
      imgList: {
        type: Array,
        required: false
      }
    },
    methods: {
      zoomPicture (params) {
        let data = {}
        data.currentIndex = params.index
        data.imgsURL = this.imgList.map((item) => {
          return item.img_url
        })
        // todo... JSBrige to zoom pic
        let imgsParams = JSON.stringify(data)
        // console.log(imgsParams)
        JSBridge.native('scanPhoto', imgsParams)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../style/mixin';
  @import '~bourbon/app/assets/stylesheets/bourbon';
  .images {
    overflow: hidden;
    margin-top: px2rem(16);
    margin-right: px2rem(-5);

    .image{
      float: left;
      overflow: hidden;
      width: 33.3333%;
      height: px2rem(100);
      padding-right: px2rem(5);
      padding-bottom: px2rem(5);
      box-sizing: border-box;

      img {
        display: block;
        height: 100%;
        width: 100%;
        border-radius: px2rem(3);
      }
    }
  }
</style>
<template>
  <div class="nickname">
      <div class="title">
         {{title}}
      </div>
      <div class="mode" v-if="type==1">
        <div class="input" >
          <van-field
          :value="name"
          placeholder="请输入用户名"
          :border="false"
          @change="onChange"
          />
        </div>
    
    </div>
    <div class="mode" v-if="type == 2">
        <div class="sex-stauts">性别确认后不可修改</div>
        <div class="sex">
            <van-radio-group :value="radio" @change="onradio">
              <van-cell-group>
                <van-cell title="男" clickable data-name="1">
                  <van-radio slot="right-icon" name="1" />
                </van-cell> 
                  <van-cell title="女" clickable data-name="2">
                  <van-radio slot="right-icon" name="2" />
                </van-cell> 
                  <van-cell title="保密" clickable data-name="0">
                  <van-radio slot="right-icon" name="0" />
                </van-cell> 
              </van-cell-group>
            </van-radio-group>
        </div>
    </div>
      <van-button type="default" class="btn-po" size="large" @click="save" >保存</van-button>  
  </div>
</template>

<script>
import Toast from '@/../static/vant/toast/toast'
export default {
  props: ['userinfo', 'type'],
  data () {
    return {
      name: '',
      radio: '0',
      title: ''
    }
  },
  methods: {
    onChange (val) {
      this.name = val.mp.detail
    },
    onradio (val) {
      this.radio = val.mp.detail
    },
    save () {
      switch (this.type) {
        case 1:
          this.setname()
          break
        case 2:
          this.setsex()
          break
      }
    },
    setsex () {
      this.$http.post({
        url: 'shop/setting/editGender',
        data: {
          'id': this.userinfo.id,
          'gender': this.radio
        }
      }).then(res => {
        console.log(res)
        if (res.code === 200) {
          Toast.success('保存成功')
          let sexname = ''
          if (this.radio === '0') {
            sexname = '保密'
          } else if (this.radio === '1') {
            sexname = '男'
          } else if (this.radio === '2') {
            sexname = '女'
          }
          wx.setStorageSync('sex', sexname)
        }
      })
    },
    setname () {
      this.$http.post({
        url: 'shop/setting/editNickName',
        data: {
          'id': this.userinfo.id,
          'nickname': this.name
        }
      }).then(res => {
        if (res.code === 200) {
          wx.setStorageSync('nickname', this.name)
          this.$emit('callback', false)
          Toast.success('保存成功')
        }
      })
    }
  },
  watch: {
    type (val) {
      if (this.type === 1) {
        this.title = '昵称'
      } else {
        this.title = '性别设置'
        if (wx.getStorageSync('sex') === '保密') {
          this.radio = '0'
        } else if (this.radio === '男') {
          this.radio = '1'
        } else if (this.radio === '女') {
          this.radio = '2'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .nickname {
    padding:0 30rpx;
    .title {
      text-align: center;
      line-height: 80rpx;
    }
    .input {
      border: 1px solid #eee;
    }
    .btn-po {
      width: 90%;
      margin:0 auto;
    }
    .sex-stauts {
      color: #666;
      line-height: 80rpx;
    }
    .mode {
      margin-bottom: 60rpx;
    }
  }
</style>

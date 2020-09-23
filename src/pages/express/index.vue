<template>
  <div class="expressTrace">
    <div class="main">
      <!-- <search v-if="!this.$route.query.express_no" @Search="Search"></search> -->
      <div v-if="JSON.stringify(TraceInfo) !== '{}'" class="item">
        <van-cell-group>
          <van-cell >
            <view slot="title">
              <!-- <div class="van-cell-text">订单号: {{TraceInfo.number}}</div> -->
              <div class="van-cell-text">国内承运人: {{TraceInfo.expName}}</div>
              <div class="van-cell-text">快递单号: {{TraceInfo.number}}</div>
            </view>
          </van-cell>
        </van-cell-group>
      </div>
      <div style="padding:30px 0;" v-else>暂无物流</div>
      <div class="item">
        <van-steps
          :steps="steps"
          :active="0"
          direction="vertical"
          active-color="#ee0a24"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      express_no: '',
      TraceInfo: {
        number: '75357129628247',
        type: 'ZTO',
        deliverystatus: '3',
        issign: '1',
        expName: '中通快递',
        expSite: 'www.zto.com ',
        expPhone: '95311',
        logo: 'https://img3.fegine.com/express/zto.jpg',
        courier: '',
        courierPhone: '17660913793',
        updateTime: '2020-06-02 16:35:05',
        takeTime: '1天21小时53分',
        list: [{time: '2020-06-02 16:35:05',
          status: '您的快递已签收, 签收人在【菜鸟的青岛东张社区店】(文一西路588号)领取。如有疑问请电联:（17660913793）, 投诉电话:（4001787878）, 您的快递已经妥投。风里来雨里去, 只为客官您满意。上有老下有小, 赏个好评好不好？【请在评价快递员处帮忙点亮五颗星星哦~】'
        }, {
          time: '2020-06-02 05:41:20',
          status: '快件已经到达 【青岛夏庄】'
        }]
      },
      steps: []
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    Search (keywords) {
      this.express_no = keywords
      this._expressTrace()
    },
    _expressTrace () {
      this.$http.post({
        url: 'shop/goods/goodsSpecs',
        data: {
          'express_no': this.express_no
        }
      }).then(res => {
        let arr = []
        this.TraceInfo = res.data
        this.TraceInfo.list.map(data => {
          arr.push({
            text: data.status,
            desc: data.time
          })
        })
        this.steps = arr
      })
    }
  },
  onLoad (options) {
    let arr = []
    this.TraceInfo.list.map(data => {
      arr.push({
        text: data.status,
        desc: data.time
      })
    })
    this.steps = arr
    if (options.express_no) {
      this.express_no = options.express_no
      this._expressTrace()
    }
  }
}
</script>
<style lang="scss" scoped>
  .expressBack.van-icon{
    transform: rotate(180deg);
    color: #323232 !important;
  }
  .expressTrace{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    .main{
      flex: 1;
      overflow-y: auto;
      .item{
        text-align: left;
      }
    }
  }
</style>

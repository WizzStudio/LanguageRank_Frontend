import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtAvatar, AtDivider, AtTabs, AtTabsPane } from "taro-ui";
import myApi from "../../service/api";
import "./userRank.scss";
const myUserId = Taro.getStorageSync("login").userId;
export default class UserRank extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 0,
      clazzId: 0,
      userRankInfo: {}
    };
  }
  componentDidMount() {
    const { params } = this.$router || "";
    this.setState({
      clazzId: params.clazzId
    });
    // const userId = Taro.getStorageSync("login").userId;
    this.getAllUserRank(myUserId, params.clazzId);
    this.getPopularRank(myUserId);
  }
  //获取所有人中某用户的信息。
  getAllUserRank = (userId, clazzId) => {
    const data = {
      clazzId,
      userId
    };
    myApi("/getuserpunchcardmessagetoday", "POST", data).then(res => {
      this.setState({
        userRankInfo: res.data
      });
    });
  };
  //获取人气排行榜单
  getPopularRank = (userId, pageIndex = 1) => {
    const { clazzId } = this.$router.params;
    const data = {
      userId,
      clazzId,
      pageIndex
    };
    myApi("/getpopularityrank", "POST", data).then(res => {
      console.log("res", res);
    });
  };
  //获取班级勤奋排行
  getHardRank = (userId, pageIndex = 1) => {
    const { clazzId } = this.$router.params;
    const data = {
      userId,
      clazzId,
      pageIndex
    };
    myApi("/gethardworkingrank", "POST", data).then(res => {
      console.log("res", res);
    });
  };
  tabClick = value => {
    this.setState({
      currentTab: value
    });
  };
  render() {
    const tabList = [{ title: "勤奋排行" }, { title: "人气排行" }];
    const { currentTab, userRankInfo } = this.state;
    return (
      <View className="userRank">
        <View className="title-wrap">
          <View className="avatar-wrap">
            <Image className="avatar" src="https://jdc.jd.com/img/200" />
          </View>
          <View className="right-score">总积分：{userRankInfo.totalScore}</View>
          <View className="card-wrap">
            <View className="per-item">
              <View className="name">连续打卡</View>
              <View className="num">
                {userRankInfo.uninterruptedStudyPlanDay}
              </View>
            </View>
            <View className="per-item">
              <View className="name">总计打卡</View>
              <View className="num">{userRankInfo.totalPunchCardDay}</View>
            </View>
            <View className="per-item">
              <View className="name">获得积分</View>
              <View className="num">{userRankInfo.todayScore}</View>
            </View>
          </View>
          <View className="btn-wrap">
            {/* <View className="envy">
              <AtButton type="primary">膜拜TA</AtButton>
            </View> */}
            <View className="achieve">
              <AtButton type="primary">生成成就卡</AtButton>
            </View>
          </View>
        </View>
        <AtDivider />
        <AtTabs
          current={currentTab}
          tabList={tabList}
          onClick={this.tabClick.bind(this)}>
          <AtTabsPane current={currentTab} index={0}>
            <View className="member-list">
              <View className="member-item">
                <View className="rank">1</View>
                <View className="avatar-wrap">
                  <Image className="avatar" src="https://jdc.jd.com/img/200" />
                </View>
                <View className="name">二哈</View>
                <View className="total">30</View>
              </View>
              <View className="member-item">
                <View className="rank">1</View>
                <View className="avatar-wrap">
                  <Image className="avatar" src="https://jdc.jd.com/img/200" />
                </View>
                <View className="name">二哈</View>
                <View className="total">30</View>
              </View>
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            人气排行
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}

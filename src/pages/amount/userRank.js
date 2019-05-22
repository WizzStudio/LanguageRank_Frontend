import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtMessage, AtDivider, AtTabs, AtTabsPane } from "taro-ui";
import myApi from "../../service/api";
import checkToLogin from "../../utils/checkToLogin";
import "./userRank.scss";
import fistImg from "../../assets/img/fist.png";
const myUserId = Taro.getStorageSync("login").userId;
export default class UserRank extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 0,
      clazzId: 0,
      userRankInfo: {},
      currUserId: myUserId,
      popRank: {},
      hardRank: {},
      todayPlan: ""
    };
  }
  componentWillMount() {
    checkToLogin();
  }
  componentDidMount() {
    const { params } = this.$router || "";
    const { clazzId } = params;
    Promise.all([
      this.getAllUserRank(myUserId),
      this.getHardRank(myUserId),
      this.getPopRank(myUserId),
      this.getTodayPlan()
    ]).then(res => {
      console.log("resPROMISE", res);
      const userRankInfo = res[0],
        hardRank = res[1],
        popRank = res[2],
        todayPlan = res[3];
      this.setState({
        clazzId,
        userRankInfo,
        hardRank,
        popRank,
        todayPlan
      });
    });
  }
  //获取所有人中某用户的信息。
  getAllUserRank = async userId => {
    const { clazzId } = this.$router.params;
    const data = {
      clazzId,
      userId
    };
    const res = await myApi("/getuserpunchcardmessagetoday", "POST", data);
    this.setState({
      userRankInfo: res.data
    });
    if (res.code === 0) {
      return res.data;
    }
    return;
  };
  //获取班级勤奋排行
  getHardRank = async (userId, pageIndex = 1) => {
    const { clazzId } = this.$router.params;
    const data = {
      userId,
      clazzId,
      pageIndex
    };
    const res = await myApi("/gethardworkingrank", "POST", data);
    if (res.code === 0) {
      return res.data;
    }
    return;
  };
  //获取人气排行榜单
  getPopRank = async (userId, pageIndex = 1) => {
    const { clazzId } = this.$router.params;
    const data = {
      userId,
      clazzId,
      pageIndex
    };
    const res = await myApi("/getpopularityrank", "POST", data);
    if (res.code === 0) {
      return res.data;
    }
    return;
  };
  //查看百度网盘链接
  getTodayPlan = async () => {
    const { clazzId } = this.$router.params;
    const data = {
      userId: myUserId,
      clazzId
    };
    const res = await myApi("/getuserclazzstudyplantoday", "POST", data);
    if (res.code === 0) {
      return res.data;
    }
    return;
  };
  //改变当前user
  changeCurrUser = userId => {
    this.getAllUserRank(userId).then(res => {
      if (res) {
        this.setState({
          userRankInfo: res,
          currUserId: userId
        });
      }
    });
  };
  //膜拜他人
  worshipOther = (currUserId = this.state.currUserId) => {
    // const { currUserId } = this.state;
    const data = {
      worshippingUser: myUserId,
      worshippedUser: currUserId
    };
    myApi("/worship", "POST", data)
      .then(res => {
        console.log("膜拜成功");
        if (res.code === 0) {
          Taro.atMessage({
            message: "膜拜成功",
            type: "info"
          });
        } else if (res.code === 6) {
          Taro.atMessage({
            message: "你已经膜拜过TA了",
            type: "warning"
          });
        }
      })
      .catch(e => {
        Taro.atMessage({
          message: "你已经膜拜过TA了",
          type: "warning"
        });
      });
  };
  tabClick = value => {
    this.setState({
      currentTab: value
    });
  };
  render() {
    const tabList = [{ title: "勤奋排行" }, { title: "人气排行" }];
    const {
      currentTab,
      currUserId,
      userRankInfo,
      popRank,
      hardRank
    } = this.state;
    return (
      <View className="userRank">
        <AtMessage />
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
            {currUserId !== myUserId && (
              <View className="envy">
                <AtButton type="primary" onClick={this.worshipOther}>
                  膜拜TA
                </AtButton>
              </View>
            )}
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
                <View className="rank title">排名</View>
                <View className="avatar-wrap title" />
                <View className="name title">用户</View>
                <View className="total title">积分</View>
                <View className="title">膜拜</View>
              </View>
              {hardRank.members.map((item, index) => (
                <View
                  className={`member-item ${item.userId === currUserId &&
                    "selected-item"}`}
                  key={item.nickName}
                  onClick={this.changeCurrUser.bind(this, item.userId)}>
                  <View className="rank">{index + 1}</View>
                  <View className="avatar-wrap">
                    <Image
                      className="avatar"
                      src="https://jdc.jd.com/img/200"
                    />
                  </View>
                  <View className="name">{item.nickName}</View>
                  <View className="total">{item.todayScore}</View>
                  <View>
                    <Image
                      src={fistImg}
                      className="fist-img"
                      onClick={this.worshipOther.bind(this, item.userId)}
                    />
                  </View>
                </View>
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className="member-list">
              {popRank.members.map((item, index) => (
                <View
                  className={`member-item ${item.userId === currUserId &&
                    "selected-item"}`}
                  key={item.nickName}
                  onClick={this.changeCurrUser.bind(this, item.userId)}>
                  <View className="rank">{index + 1}</View>
                  <View className="avatar-wrap">
                    <Image
                      className="avatar"
                      src="https://jdc.jd.com/img/200"
                    />
                  </View>
                  <View className="name">{item.nickName}</View>
                  <View className="total">{item.worship}人膜拜</View>
                </View>
              ))}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}

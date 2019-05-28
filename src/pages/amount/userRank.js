import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  AtButton,
  AtMessage,
  AtDivider,
  AtTabs,
  AtTabsPane,
  AtPagination,
  AtIcon
} from "taro-ui";
import myApi from "../../service/api";
import "./userRank.scss";
import fistImg from "../../assets/img/fist.png";
import CanvasAchieve from "../../components/canvasPost/canvasAchieve";
let myUserId = Taro.getStorageSync("login").userId;
let basicInfo;
export default class UserRank extends Component {
  config = {
    navigationBarTitleText: "好友排行"
  };
  constructor() {
    super();
    this.state = {
      currentTab: 0,
      clazzId: 0,
      userRankInfo: {},
      currUserId: myUserId,
      popRank: {},
      hardRank: {},
      todayPlan: "",
      myHardRank: {},
      myPopRank: {},
      isShowCanvas: false
    };
    this.myRankInfo = {};
  }
  componentDidMount() {
    let myUserId = Taro.getStorageSync("login").userId;

    const { params } = this.$router || "";
    const { clazzId } = params;
    Promise.all([
      this.getAllUserRank(myUserId),
      this.getHardRank(myUserId),
      this.getPopRank(myUserId),
      this.getTodayPlan()
    ]).then(res => {
      const userRankInfo = res[0],
        hardRank = res[1],
        popRank = res[2],
        todayPlan = res[3].data.qrCode;
      let myHardRank = hardRank.me,
        myPopRank = popRank.me;
      this.myRankInfo = userRankInfo;
      this.setState({
        clazzId,
        userRankInfo,
        hardRank,
        popRank,
        todayPlan,
        myHardRank,
        myPopRank
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
    let myUserId = Taro.getStorageSync("login").userId;
    const { clazzId } = this.$router.params;
    const data = {
      userId: myUserId,
      clazzId
    };
    const res = await myApi("/getuserclazzstudyplantoday", "POST", data);
    if (res.code === 0) {
      return res;
    }
    return;
  };
  //改变当前user
  changeCurrUser = userId => {
    this.getAllUserRank(userId).then(res => {
      if (res) {
        this.setState(
          {
            userRankInfo: res,
            currUserId: userId
          },
          () => {
            Taro.pageScrollTo({
              scrollTop: 0,
              duration: 0
            });
          }
        );
      }
    });
  };
  //膜拜他人
  worshipOther = toUserId => {
    let myUserId = Taro.getStorageSync("login").userId;
    const data = {
      worshippingUser: myUserId,
      worshippedUser: toUserId
    };
    if (myUserId === toUserId) {
      Taro.atMessage({
        message: "不可以膜拜自己哦",
        type: "warning"
      });
      return;
    }
    myApi("/worship", "POST", data)
      .then(res => {
        if (res.code === 0) {
          Taro.atMessage({
            message: "膜拜成功",
            type: "success"
          });
          Promise.all([
            this.getHardRank(myUserId),
            this.getPopRank(myUserId)
          ]).then(res => {
            this.setState({
              hardRank: res[0],
              popRank: res[1]
            });
          });
        } else if (res.code === 6) {
          Taro.atMessage({
            message: "一天只可以膜拜一次哦",
            type: "warning"
          });
        }
      })
      .catch(e => {
        Taro.atMessage({
          message: "膜拜失败",
          type: "warning"
        });
      });
  };
  tabClick = value => {
    this.setState({
      currentTab: value
    });
  };

  changeHardPage = params => {
    let myUserId = Taro.getStorageSync("login").userId;
    this.getHardRank(myUserId, params.current).then(res => {
      this.setState({
        hardRank: res
      });
    });
  };
  changePopPage = params => {
    let myUserId = Taro.getStorageSync("login").userId;
    this.getPopRank(myUserId, params.current).then(res => {
      this.setState({
        popRank: res
      });
    });
  };
  showImage = url => {
    Taro.previewImage({
      urls: [url],
      current: url
    });
  };
  openCanvas = () => {
    this.setState({
      isShowCanvas: true
    });
  };
  closeCanvas = () => {
    this.setState({
      isShowCanvas: false
    });
  };
  render() {
    let myUserId = Taro.getStorageSync("login").userId;
    let basicInfo = Taro.getStorageSync("basicInfo");
    const tabList = [{ title: "勤奋排行" }, { title: "人气排行" }];
    const {
      currentTab,
      currUserId,
      userRankInfo,
      popRank,
      hardRank,
      myHardRank,
      myPopRank,
      todayPlan,
      isShowCanvas
    } = this.state;
    let hardTotal = hardRank.total,
      popTotal = popRank.total,
      hardPageSize = hardRank.pageSize,
      popPageSize = popRank.pageSize,
      hardPageIndex = hardRank.pageIndex,
      popPageIndex = popRank.pageIndex;
    return (
      <View className="userRank">
        <AtMessage />
        {isShowCanvas ? (
          <View className="share-bg">
            <View className="close-canvas">
              <AtIcon
                value="close-circle"
                size="40"
                color="#FFF"
                onClick={this.closeCanvas}
              />
            </View>
            <View className="share-wrap">
              <CanvasAchieve
                nickName={basicInfo.nickName}
                avatar={basicInfo.avatar}
                dayNum={this.myRankInfo.totalPunchCardDay}
                type="achieve"
              />
            </View>
          </View>
        ) : (
          <View>
            <View className="title-wrap">
              <View className="avatar-wrap">
                <Image className="avatar" src={userRankInfo.avatarUrl} />
              </View>
              <View className="right-score">
                总积分：{userRankInfo.totalScore}
              </View>
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
                    <AtButton
                      type="primary"
                      onClick={this.worshipOther.bind(this, currUserId)}>
                      膜拜TA
                    </AtButton>
                  </View>
                )}
                <View className="achieve">
                  <AtButton type="primary" onClick={this.openCanvas}>
                    生成成就卡
                  </AtButton>
                </View>
              </View>
            </View>
            <View
              className="plan-wrap"
              onClick={this.showImage.bind(this, todayPlan)}>
              <Image src={todayPlan} className="plan-img" />
              <View className="plan-text">
                点击预览图片，\n长按识别二维码，\n获取今日学习资料
              </View>
            </View>
            <AtDivider />
            <AtTabs
              current={currentTab}
              tabList={tabList}
              onClick={this.tabClick.bind(this)}>
              <AtTabsPane current={currentTab} index={0}>
                <View className="member-list">
                  <View className="member-item  member-item-title">
                    <View className="rank title">排名</View>
                    <View className="avatar-wrap title" />
                    <View className="name title">用户</View>
                    <View className="total title">积分</View>
                    <View className="title">膜拜</View>
                  </View>
                  <View className="member-item">
                    <View className="rank">我</View>
                    <View className="avatar-wrap">
                      <Image className="avatar" src={myHardRank.avatarUrl} />
                    </View>
                    <View className="name">{myHardRank.nickName}</View>
                    <View className="total" />
                    <View />
                  </View>
                  {hardRank.members.map((item, index) => (
                    <View
                      className={`member-item ${item.userId === currUserId &&
                        "selected-item"}`}
                      key={item.nickName}>
                      <View
                        className="rank"
                        onClick={this.changeCurrUser.bind(this, item.userId)}>
                        {(hardPageIndex - 1) * hardPageSize + index + 1}
                      </View>
                      <View
                        className="avatar-wrap"
                        onClick={this.changeCurrUser.bind(this, item.userId)}>
                        <Image className="avatar" src={item.avatarUrl} />
                      </View>
                      <View
                        className="name"
                        onClick={this.changeCurrUser.bind(this, item.userId)}>
                        {item.nickName}
                      </View>
                      <View
                        className="total"
                        onClick={this.changeCurrUser.bind(this, item.userId)}>
                        {item.todayScore}
                      </View>
                      <View>
                        <Image
                          src={fistImg}
                          className="fist-img"
                          onClick={this.worshipOther.bind(this, item.userId)}
                        />
                      </View>
                    </View>
                  ))}
                  <AtPagination
                    icon
                    total={hardTotal || 0}
                    pageSize={hardPageSize}
                    onPageChange={this.changeHardPage}
                  />
                </View>
              </AtTabsPane>
              <AtTabsPane current={currentTab} index={1}>
                <View className="member-list">
                  <View className="member-item">
                    <View className="rank title">排名</View>
                    <View className="avatar-wrap title" />
                    <View className="name title">用户</View>
                    <View className="total title">膜拜数</View>
                  </View>
                  <View className="member-item">
                    <View className="rank">我</View>
                    <View className="avatar-wrap">
                      <Image className="avatar" src={myPopRank.avatarUrl} />
                    </View>
                    <View className="name">{myPopRank.nickName}</View>
                    <View className="total">{myPopRank.worship}人膜拜</View>
                  </View>
                  {popRank.members.map((item, index) => (
                    <View
                      className={`member-item ${item.userId === currUserId &&
                        "selected-item"}`}
                      key={item.nickName}
                      onClick={this.changeCurrUser.bind(this, item.userId)}>
                      <View className="rank">
                        {(popPageIndex - 1) * popPageSize + index + 1}
                      </View>
                      <View className="avatar-wrap">
                        <Image className="avatar" src={item.avatarUrl} />
                      </View>
                      <View className="name">{item.nickName}</View>
                      <View className="total">{item.worship}人膜拜</View>
                    </View>
                  ))}
                  <AtPagination
                    icon
                    total={popTotal || 0}
                    pageSize={popPageSize}
                    onPageChange={this.changePopPage}
                  />
                </View>
              </AtTabsPane>
            </AtTabs>
          </View>
        )}
      </View>
    );
  }
}

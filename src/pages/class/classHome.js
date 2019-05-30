import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import {
  AtButton,
  AtDivider,
  AtTabs,
  AtTabsPane,
  AtFloatLayout,
  AtForm,
  AtIcon
} from "taro-ui";
import CmtList from "../../components/detail/cmtList";
import ClassMember from "../../components/class/classMember";
import ClassFriend from "../../components/class/classFriend";
import AddComment from "../../components/detail/addComment";
import DailyPlan from "../amount/dailyPlan";
import JoinClass from "../../components/class/joinClass";
import myApi from "../../service/api";
import more from "../../assets/img/more.png";
import ShareBtn from "../../components/class/shareBtn";
import CanvasAchieve from "../../components/canvasPost/canvasAchieve";
import { getClassMsg, ajaxGetUserClass } from "../../actions/classInfo";
import { connect } from "@tarojs/redux";
import { getLoginInfo } from "../../utils/getlocalInfo";
import "./classHome.scss";
let myUserId;
let basicInfo;
@connect(
  ({ classInfo, cmtInfo }) => ({ classInfo, cmtInfo }),
  dispatch => ({
    getClassMsg(data) {
      return dispatch(getClassMsg(data));
    },
    ajaxGetUserClass(userId) {
      return dispatch(ajaxGetUserClass(userId));
    }
  })
)
export default class ClassHome extends Component {
  config = {
    navigationBarTitleText: "班级主页"
  };
  constructor() {
    super();
    this.state = {
      currentTab: 0,
      ruleOpened: false,
      isAdded: -1,
      isPunched: -1,
      clazzId: 0,
      isShowCanvas: false,
      classMsgState: {}
    };
  }
  componentDidMount() {
    myUserId = getLoginInfo().userId;
    basicInfo = Taro.getStorageSync("basicInfo");
    const param = this.$router.params || "";
    if (param) {
      const { clazzId } = param;
      this.setState({
        clazzId
      });
      this.checkIsAdded();
      this.getClassMessage(clazzId).then(res => {
        if (res.code === 0) {
          this.setState({
            isPunched: res.data.isPunchCard ? 1 : 0,
            classMsgState: res.data
          });
        }
      });
    }
  }
  componentDidUpdate(prevProps) {
    const { clazzId } = this.$router.params;
    if (this.props.classInfo.userClassId != prevProps.classInfo.userClassId) {
      this.checkIsAdded();
      console.log("第一次进入", this.props, prevProps);
      this.getClassMessage(clazzId).then(res => {
        if (res.code === 0) {
          let { isAdded } = this.state;
          this.setState({
            isPunched: res.data.isPunchCard ? 1 : 0,
            classMsgState: res.data
          });
        }
      });
    }
    // if (
    //   this.props.cmtInfo.classCmt &&
    //   this.props.cmtInfo.classCmt.total != prevProps.cmtInfo.classCmt.total
    //   // this.props.cmtInfo.classCmt != prevProps.cmtInfo.classCmt
    // ) {
    //   console.log("第二次进入", this.props, prevProps);
    //   this.getClassMessage(clazzId).then(res => {
    //     if (res.code === 0) {
    //       this.setState({
    //         classMsgState: res.data
    //       });
    //     }
    //   });
    // }
  }
  checkIsAdded = () => {
    const { clazzId } = this.$router.params;
    const userId = Taro.getStorageSync("login").userId || "";
    if (!this.props.classInfo.userClassId) {
      const data = {
        userId
      };
      this.props.ajaxGetUserClass(data);
    }
    const { userClassId } = this.props.classInfo;
    if (userClassId.indexOf(parseInt(clazzId)) == -1) {
      this.setState({
        isAdded: 0
      });
    } else {
      this.setState({
        isAdded: 1
      });
    }
  };
  changeAddTrue = () => {
    this.setState({
      isAdded: 1,
      isPunched: 0
    });
  };
  getClassMessage = clazzId => {
    const dataMsg = {
      clazzId
    };
    return this.props.getClassMsg(dataMsg);
  };

  tabClick = value => {
    this.setState({
      currentTab: value
    });
  };
  toUserRank = () => {
    const { clazzId } = this.state;
    Taro.navigateTo({
      url: `/pages/amount/userRank?clazzId=${clazzId}`
    });
  };
  punchToUserRank = e => {
    const { formId } = e.detail;
    const { clazzId } = this.state;
    const userId = Taro.getStorageSync("login").userId || "";
    const data = {
      // userId: myUserId,
      userId,
      clazzId,
      formId
    };
    myApi("/punchcard", "POST", data).then(res => {
      if (res.code === 0) {
        Taro.showToast({
          title: "打卡成功"
        });
        this.setState(
          {
            isPunched: 1
          },
          () => {
            this.toUserRank();
          }
        );
      }
    });
  };
  openRule = () => {
    this.setState({
      ruleOpened: true
    });
  };
  closeRule = () => {
    this.setState({
      ruleOpened: false
    });
  };
  toClassDetail = () => {
    const { clazzId } = this.state;
    Taro.navigateTo({
      url: `/pages/class/classDetail?clazzId=${clazzId}`
    });
  };
  openSheet = () => {
    Taro.showActionSheet({
      itemList: ["生成邀请卡", "退出班级"],
      itemColor: "#4f5fc5"
    }).then(res => {
      if (res.tapIndex === 0) {
        this.openCanvas();
      } else if (res.tapIndex === 1) {
        this.isToQuitClass();
      }
    });
  };
  isToQuitClass = () => {
    Taro.showModal({
      title: "退出班级",
      content: "退出班级将清空之前的学习记录，确定要退出吗",
      confirmText: "确认",
      confirmColor: "#4f5fc5"
    }).then(res => {
      if (res.confirm) {
        this.quitClass();
      }
    });
  };
  quitClass = () => {
    const { clazzId } = this.state;
    const userId = Taro.getStorageSync("login").userId || "";
    let data = {
      userId,
      clazzId
    };
    myApi("/quitclazz", "POST", data).then(res => {
      if (res.code === 0) {
        Taro.showToast({
          title: "退出成功"
        });
        this.props.ajaxGetUserClass({ userId });
        this.setState({
          isAdded: 0
        });
      }
    });
  };
  refCmt = node => (this.cmtNode = node);
  updateCmt = () => {
    this.cmtNode.getCmtList();
  };
  onShareAppMessage = res => {
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: `/pages/index/index?shareId=${myUserId}`
    };
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
    const tabList = [{ title: "讨论" }, { title: "成员" }, { title: "好友" }];
    const {
      currentTab,
      isAdded,
      clazzId,
      ruleOpened,
      isShowCanvas,
      isPunched
    } = this.state;
    const classMsg = this.state.classMsgState;
    // let basicInfo = Taro.getStorageSync("basicInfo");
    return (
      <View>
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
                clazzName={classMsg.clazzName}
                type="home"
              />
            </View>
          </View>
        ) : (
          <View className="classHome">
            <View className="title-wrap">
              <View className="img-wrap">
                <Image src={classMsg.clazzImage} className="img" />
              </View>
              <View className="title-content">
                <View className="title-name">
                  <View className="content">
                    {classMsg.clazzName}
                    <View className="lesson-detail">
                      <AtButton
                        type="secondary"
                        size="small"
                        onClick={this.toClassDetail}>
                        课程详情
                      </AtButton>
                    </View>
                  </View>
                </View>
                <View className="title-state">
                  {classMsg.studentNumber}人加入 | {classMsg.commentNumber}
                  条讨论
                </View>
                <View className="title-action">
                  {isAdded ? (
                    <ShareBtn />
                  ) : (
                    <JoinClass
                      clazzId={clazzId}
                      index={-1}
                      onChangeAdd={this.changeAddTrue}
                      type="classHome"
                    />
                  )}
                  {isAdded && (
                    <Image
                      className="icon more-img"
                      src={more}
                      onClick={this.openSheet}
                    />
                  )}
                </View>
              </View>
            </View>
            <AtDivider />
            {isAdded ? (
              isPunched ? (
                <View>
                  <DailyPlan
                    canvas={isShowCanvas}
                    className={classMsg.clazzName}
                    clazzId={clazzId}
                  />
                  <View className="content-wrap">
                    <View className="punch-btn">
                      <AtButton
                        type="primary"
                        size="normal"
                        onClick={this.toUserRank}>
                        查看今日排行
                      </AtButton>
                    </View>
                    <View className="punch-rule" onClick={this.openRule}>
                      打卡规则
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <View className="no-plan">打卡成功后查看内容</View>
                  <View className="content-wrap">
                    <View className="punch-btn">
                      <AtForm
                        reportSubmit={true}
                        onSubmit={this.punchToUserRank}>
                        <AtButton
                          type="primary"
                          size="normal"
                          formType="submit">
                          打卡
                        </AtButton>
                      </AtForm>
                    </View>
                    <View className="punch-rule" onClick={this.openRule}>
                      打卡规则
                    </View>
                  </View>
                </View>
              )
            ) : (
              <View>
                <View className="no-plan">加入班级后查看内容</View>
                <View className="content-wrap">
                  <View className="punch-btn">
                    <AtButton
                      disabled
                      type="primary"
                      size="normal"
                      formType="submit">
                      打卡
                    </AtButton>
                  </View>
                  <View className="punch-rule" onClick={this.openRule}>
                    打卡规则
                  </View>
                </View>
              </View>
            )}
            <AtDivider />
            <AtFloatLayout
              isOpened={ruleOpened}
              onClose={this.closeRule.bind(this)}>
              <View>
                <View className="intro-title">打卡规则</View>
                <View className="intro-content">
                  【1、打卡积分的用途】 \n①去积分商城兑换海量好礼
                  \n②参与排行，与好友pk\n 【2、积分获取规则】
                  \n连续第N天打卡成功，当天获得10×N个积分。\n 例如：\n
                  连续第1天12点前打卡，当天获得10分，累计10分。\n
                  连续第2天12点前打卡，当天获得20分，累计30分。\n
                  连续第3天12点前打卡，当天获得30分，累计60分。\n ......\n
                  某天12点之后打卡，当天奖励正常积分数的一半。\n
                  中断打卡后，当天奖励重新从10分开始计算，总积分累计。\n
                  【3、收集膜拜奖励 每获得一个好友膜拜奖10分】 \n
                  【4、奖励上限:每人每天最多可获得300分】\n
                </View>
                <View className="intro-close">
                  <AtButton type="primary" onClick={this.closeRule.bind(this)}>
                    确定
                  </AtButton>
                </View>
              </View>
            </AtFloatLayout>
            <AtTabs
              current={currentTab}
              tabList={tabList}
              onClick={this.tabClick.bind(this)}>
              <AtTabsPane current={currentTab} index={0}>
                <CmtList typeCmt="class" clazzId={clazzId} ref={this.refCmt} />
              </AtTabsPane>
              <AtTabsPane current={currentTab} index={1}>
                <ClassMember
                  isAdded={isAdded}
                  isPunched={isPunched}
                  clazzId={clazzId}
                  type="class"
                  canvas={isShowCanvas}
                />
              </AtTabsPane>
              <AtTabsPane current={currentTab} index={2}>
                <ClassFriend
                  isAdded={isAdded}
                  isPunched={isPunched}
                  clazzId={clazzId}
                />
              </AtTabsPane>
            </AtTabs>
            {currentTab === 0 ? (
              <AddComment
                type="class"
                clazzId={clazzId}
                isAdded={isAdded}
                onRefresh={this.updateCmt}
              />
            ) : (
              ""
            )}
          </View>
        )}
      </View>
    );
  }
}

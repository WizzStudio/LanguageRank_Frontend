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
import AddComment from "../../components/detail/addComment";
import DailyPlan from "../amount/dailyPlan";
import JoinClass from "../../components/class/joinClass";
import myApi from "../../service/api";
import more from "../../assets/img/more.png";
import ShareBtn from "../../components/class/shareBtn";
import CanvasHome from "../../components/canvasPost/canvasHome";
import { getClassMsg, ajaxGetUserClass } from "../../actions/classInfo";
import { connect } from "@tarojs/redux";
import { getLoginInfo } from "../../utils/getlocalInfo";
import checkToLogin from "../../utils/checkToLogin";
import "./classHome.scss";
let myUserId;
let basicInfo;
@connect(
  ({ classInfo }) => ({ classInfo }),
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
    navigationBarTitleText: "猿圈"
  };
  constructor() {
    super();
    this.state = {
      currentTab: 0,
      ruleOpened: false,
      isAdded: false,
      isPunched: true,
      clazzId: 0,
      isShowCanvas: false,
      classMsgState: {}
    };
  }
  componentWillMount() {}
  // componentDidUpdate = prevProps => {
  //   if (prevProps.classInfo.userClassId != this.props.classInfo.userClassId) {
  //     this.checkIsAdded();
  //   }
  // };
  componentDidMount() {
    // checkToLogin();
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
            isPunched: res.data.isPunchCard,
            classMsgState: res.data
          });
        }
      });
    }
  }
  checkIsAdded = () => {
    const { clazzId } = this.$router.params;
    if (!this.props.classInfo.userClassId) {
      const data = {
        userId: myUserId
      };
      this.props.ajaxGetUserClass(data);
    }
    const { userClassId } = this.props.classInfo;
    if (userClassId.indexOf(parseInt(clazzId)) == -1) {
      this.setState({
        isAdded: false
      });
    } else {
      this.setState({
        isAdded: true
      });
    }
  };
  changeAddTrue = () => {
    this.setState({
      isAdded: true,
      isPunched: false
    });
  };
  getClassMessage = clazzId => {
    const dataMsg = {
      clazzId
    };
    console.log("msg接口发送的dataMsg", dataMsg);
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
    const data = {
      userId: myUserId,
      clazzId,
      formId
    };
    console.log("打卡发送的data", data);
    myApi("/punchcard", "POST", data).then(res => {
      console.log("打卡返回的res", res);
      if (res.code === 0) {
        Taro.showToast({
          title: "打卡成功"
        });
        this.setState({
          isPunched: true
        });
        this.toUserRank();
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
        this.quitClass();
      }
    });
  };
  quitClass = () => {
    const { clazzId } = this.state;
    let data = {
      userId: myUserId,
      clazzId
    };
    console.log("退出班级发送的data", data);
    myApi("/quitclazz", "POST", data).then(res => {
      console.log("退出班级收到的res", res);
      if (res.code === 0) {
        Taro.showToast({
          title: "退出成功"
        });
        this.props.ajaxGetUserClass({ userId: myUserId });
        this.setState({
          isAdded: false
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
      isShowCanvas
    } = this.state;
    const classMsg = this.state.classMsgState;
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
              <CanvasHome
                nickName={basicInfo.nickName}
                avatar={basicInfo.avatar}
                clazzName={classMsg.clazzName}
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
                    <AtButton
                      type="secondary"
                      size="small"
                      onClick={this.toClassDetail}>
                      课程详情
                    </AtButton>
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
                  <DailyPlan className={classMsg.clazzName} clazzId={clazzId} />
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
                <ClassMember clazzId={clazzId} type="class" />
              </AtTabsPane>
              <AtTabsPane current={currentTab} index={2}>
                <ClassMember clazzId={clazzId} type="friend" />
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

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  AtButton,
  AtDivider,
  AtTabs,
  AtTabsPane,
  AtFloatLayout
} from "taro-ui";
import "./classHome.scss";
import CmtList from "../../components/detail/cmtList";
import AddComment from "../../components/detail/addComment";
import DailyPlan from "../amount/dailyPlan";
import imgTest from "../../assets/img/canvasAuth.png";
import JoinClass from "../../components/class/joinClass";
import myApi from "../../service/api";
import more from "../../assets/img/more.png";
import share from "../../assets/img/share.png";
import ShareBtn from "../../components/class/shareBtn";
import {
  ajaxGetClassMember,
  getClassMsg,
  ajaxGetUserClass
} from "../../actions/classInfo";
import { connect } from "@tarojs/redux";
import { getLoginInfo } from "../../utils/getlocalInfo";

import checkToLogin from "../../utils/checkToLogin";
const myUserId = getLoginInfo().userId;
@connect(
  ({ classInfo }) => ({ classInfo }),
  dispatch => ({
    ajaxGetClassMember(data) {
      return dispatch(ajaxGetClassMember(data));
    },
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
      clazzId: 0
    };
  }
  componentWillMount() {
    checkToLogin();
  }
  componentDidMount() {
    const param = this.$router.params || "";
    if (param) {
      console.log("param", param);
      const { clazzId } = param;
      this.setState({
        clazzId
      });
      this.checkIsAdded();
      this.getClassMessage(clazzId).then(res => {
        if (res.code === 0) {
          this.setState({
            isPunched: res.data.isPunchCard
          });
        }
      });
      this.getClassMember(clazzId);
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
      isAdded: true
    });
  };
  getClassMessage = clazzId => {
    const dataMsg = {
      clazzId
    };
    return this.props.getClassMsg(dataMsg);
  };
  getClassMember = clazzId => {
    const data = {
      clazzId,
      pageIndex: 1
    };
    return this.props.ajaxGetClassMember(data);
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
  punchToUserRank = () => {
    const { clazzId } = this.state;
    const data = {
      userId: myUserId,
      clazzId
    };
    myApi("/punchcard", "POST", data).then(res => {
      console.log("res", res);
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
      console.log("res", res);
      if (res.tapIndex === 0) {
        this.showInvitation();
      } else if (res.tapIndex === 1) {
        this.quitClass();
      }
    });
  };
  showInvitation = () => {};
  quitClass = () => {
    const { clazzId } = this.state;
    let data = {
      userId: myUserId,
      clazzId
    };
    myApi("/quitclazz", "POST", data).then(res => {
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
  onReachBottom() {
    console.log("到底了");
    this.cmtNode.getCmtList();
  }
  refCmt = node => (this.cmtNode = node);
  updateCmt = () => {
    this.cmtNode.getCmtList();
  };
  render() {
    const tabList = [{ title: "讨论" }, { title: "成员" }];
    const { currentTab, isAdded, clazzId, ruleOpened } = this.state;
    const { classMember, classMsg } = this.props.classInfo || [];
    return (
      <View className="classHome">
        <View className="title-wrap">
          <View className="img-wrap">
            <Image src={imgTest} className="img" />
          </View>
          <View className="title-content">
            <View className="title-name">
              <View className="content">{classMsg.clazzName}</View>
              <AtButton
                type="secondary"
                size="small"
                onClick={this.toClassDetail}>
                课程详情
              </AtButton>
            </View>
            <View className="title-state">
              {classMsg.studentNumber}人加入 | {classMsg.commentNumber}条讨论
            </View>
            <View className="title-action">
              {isAdded ? (
                // <Image className="icon share-img" src={share} />
                <ShareBtn />
              ) : (
                <JoinClass
                  clazzId={clazzId}
                  index={-1}
                  onChangeAdd={this.changeAddTrue}
                  type="classHome"
                />
              )}
              <Image
                className="icon more-img"
                src={more}
                onClick={this.openSheet}
              />
            </View>
          </View>
        </View>
        <AtDivider />

        {isAdded ? (
          isPunched ? (
            <DailyPlan className={classMsg.clazzName} clazzId={clazzId} />
          ) : (
            <View className="no-plan">打卡成功后查看内容</View>
          )
        ) : (
          <View className="no-plan">加入班级后查看内容</View>
        )}

        <View className="content-wrap">
          <View className="punch-btn">
            {isPunched ? (
              <AtButton type="primary" size="normal" onClick={this.toUserRank}>
                查看排行
              </AtButton>
            ) : (
              <AtButton
                type="primary"
                size="normal"
                onClick={this.punchToUserRank}>
                打卡
              </AtButton>
            )}
          </View>
          <View className="punch-rule" onClick={this.openRule}>
            打卡规则
          </View>
          <AtFloatLayout
            isOpened={ruleOpened}
            onClose={this.closeRule.bind(this)}>
            <View>
              <View className="intro-title" ref={this.refTest}>
                榜单介绍
              </View>
              <View className="intro-content">打卡规则</View>
              <View className="intro-close">
                <AtButton type="primary" onClick={this.closeRule.bind(this)}>
                  确定
                </AtButton>
              </View>
            </View>
          </AtFloatLayout>
        </View>
        <AtDivider />
        <AtTabs
          current={currentTab}
          tabList={tabList}
          onClick={this.tabClick.bind(this)}>
          <AtTabsPane current={currentTab} index={0}>
            <CmtList typeCmt="class" clazzId={clazzId} ref={this.refCmt} />
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className="member-list">
              <View className="member-item">
                <View className="rank">排名</View>
                <View className="avatar-wrap">头像</View>
                <View className="name">昵称</View>
                <View className="total">打卡天数</View>
              </View>
              {classMember.members.map((item, index) => (
                <View className="member-item" key={item.userId}>
                  <View className="rank">{index + 1}</View>
                  <View className="avatar-wrap">
                    <Image
                      className="avatar"
                      src="https://jdc.jd.com/img/200"
                    />
                  </View>
                  <View className="name">{item.nickName}</View>
                  <View className="total">
                    {item.uninterruptedStudyPlanDay}
                  </View>
                </View>
              ))}
            </View>
          </AtTabsPane>
        </AtTabs>
        {currentTab === 0 ? (
          <AddComment
            type="class"
            clazzId={clazzId}
            onRefresh={this.updateCmt}
          />
        ) : (
          ""
        )}
      </View>
    );
  }
}

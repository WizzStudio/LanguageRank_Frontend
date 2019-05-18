import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  AtButton,
  AtDivider,
  AtTabs,
  AtTabsPane,
  AtFloatLayout,
  AtIcon
} from "taro-ui";
import "./classHome.scss";
import CmtList from "../../components/detail/cmtList";
import AddComment from "../../components/detail/addComment";
import DailyPlan from "../amount/dailyPlan";
import imgTest from "../../assets/img/canvasAuth.png";
import JoinClass from "../../components/class/joinClass";
import QuitClass from "../../components/class/quitClass";
import { ajaxGetClassMember, getClassMsg } from "../../actions/classInfo";
import { connect } from "@tarojs/redux";
@connect(
  ({ classInfo }) => ({ classInfo }),
  dispatch => ({
    ajaxGetClassMember(data) {
      return dispatch(ajaxGetClassMember(data));
    },
    getClassMsg(data) {
      return dispatch(getClassMsg(data));
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
  componentDidMount() {
    const param = this.$router.params || "";
    if (param) {
      console.log("param", param);
      const { clazzId } = param;
      this.setState({
        clazzId
      });
      this.getClassMessage(clazzId);
      this.getClassMember(clazzId);
    }
  }
  getClassMessage = clazzId => {
    const dataMsg = {
      clazzId
    };
    this.props.getClassMsg(dataMsg);
  };
  getClassMember = clazzId => {
    const data = {
      clazzId,
      pageIndex: 1
    };
    this.props.ajaxGetClassMember(data).then(res => {
      console.log("res", res);
    });
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
    const clazzId = 1;
    Taro.navigateTo({
      url: `/pages/class/classDetail?clazzId=${clazzId}`
    });
  };
  render() {
    const tabList = [{ title: "讨论" }, { title: "成员" }];
    const { currentTab, isAdded, clazzId } = this.state;
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
                // <QuitClass clazzId={clazzId} />
                <AtIcon value="share" size="28" color="#4f5fc5" />
              ) : (
                <JoinClass clazzId={clazzId} />
              )}
            </View>
          </View>
        </View>
        <AtDivider />

        {isAdded ? (
          <DailyPlan clazzId={clazzId} />
        ) : (
          <View>尚未加入此班级</View>
        )}

        <View className="content-wrap">
          <View className="punch-btn">
            {classMsg.isPunched ? (
              <AtButton type="primary" size="normal" onClick={this.toUserRank}>
                查看排行
              </AtButton>
            ) : (
              <AtButton type="primary" size="normal" onClick={this.toUserRank}>
                打卡
              </AtButton>
            )}
          </View>
          <View className="punch-rule" onClick={this.openRule}>
            打卡规则
          </View>
          <AtFloatLayout
            isOpened={this.state.ruleOpened}
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
            <CmtList typeCmt="class" clazzId={clazzId} />
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className="member-list">
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
        {currentTab === 0 ? <AddComment type="class" clazzId={clazzId} /> : ""}
      </View>
    );
  }
}

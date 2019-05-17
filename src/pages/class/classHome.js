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
import CommentList from "../../components/detail/CommentList";
import DailyPlan from "../amount/dailyPlan";
import imgTest from "../../assets/img/canvasAuth.png";
import AddClass from "../../components/class/addClass";
import QuitClass from "../../components/class/quitClass";
import { ajaxGetClassMember } from "../../actions/classInfo";
import { connect } from "@tarojs/redux";
@connect(
  ({ classInfo }) => ({ classInfo }),
  dispatch => ({
    ajaxGetClassMember(data) {
      return dispatch(ajaxGetClassMember(data));
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
      isAdded: false
    };
  }
  componentDidMount() {
    this.getClassMember();
    const param = this.$router.params || "";
    if (param) {
      this.setState({
        isAdded: true
      });
    }
  }
  getClassMember = () => {
    const clazzId = 1;
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
    Taro.navigateTo({
      url: "/pages/amount/userRank"
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
    const { currentTab, isAdded } = this.state;
    const { classMember } = this.props.classInfo || [];
    const clazzId = 1;
    return (
      <View className="classHome">
        <View className="title-wrap">
          <View className="img-wrap">
            <Image src={imgTest} className="img" />
          </View>
          <View className="title-content">
            <View className="title-name">七天认识Java</View>
            <View className="title-state">180人加入|800条讨论</View>
            <View className="title-action">
              <AtButton
                type="secondary"
                size="small"
                onClick={this.toClassDetail}>
                课程详情
              </AtButton>
              {isAdded ? (
                <QuitClass clazzId={clazzId} />
              ) : (
                <AddClass clazzId={clazzId} />
              )}
            </View>
          </View>
        </View>
        <AtDivider />

        <View className="content-name">第一天</View>
        <DailyPlan clazzId={clazzId} />
        <View className="content-wrap">
          <View className="punch-btn">
            <AtButton type="primary" size="normal" onClick={this.toUserRank}>
              打卡
            </AtButton>
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
            <CommentList typeCmt="class" />
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className="member-list">
              {classMember.map((item, index) => (
                <View className="member-item" key={item.userId}>
                  <View className="rank">{index + 1}</View>
                  <View className="avatar-wrap">
                    <Image
                      className="avatar"
                      src="https://jdc.jd.com/img/200"
                    />
                  </View>
                  <View className="name">{"item.nickName"}</View>
                  <View className="total">30</View>
                </View>
              ))}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}

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
import CommentItem from "../../components/detail/CommentList";
import imgTest from "../../assets/img/canvasAuth.png";

export default class ClassHome extends Component {
  config = {
    navigationBarTitleText: "猿圈"
  };
  constructor() {
    super();
    this.state = {
      currentTab: 0,
      ruleOpened: false
    };
  }
  componentDidMount() {
    console.log("进入home");
  }
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
  render() {
    const tabList = [{ title: "讨论" }, { title: "成员" }];
    const { currentTab } = this.state;
    return (
      <View className="classHome">
        <View className="title-wrap">
          <View className="img-wrap">
            <Image src={imgTest} className="img" />
          </View>
          <View className="title-content">
            <View className="title-name">七天认识Java</View>
            <View className="title-state">180人加入|800条讨论</View>
            <View className="title-action">分享</View>
          </View>
        </View>
        <AtDivider />

        <View className="content-name">第一天</View>
        <View className="content-wrap">
          <View className="content-detail">打卡获取链接</View>
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
            <CommentItem />
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            成员列表
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import {
  AtRate,
  AtBadge,
  AtTabs,
  AtTabsPane,
  AtIcon,
  AtDivider,
  AtInput
} from "taro-ui";
import "./langDetail.scss";
import AddPlan from "../../components/rank/addPlan";
import { connect } from "@tarojs/redux";
import { ajaxGetLangHome } from "../../actions/rankList";
import LangHome from "./langHome";
import DemandHome from "./demandHome";
import CommentList from "../../components/detail/CommentList";
@connect(
  ({ rankList }) => ({
    rankList
  }),
  dispatch => ({
    ajaxGetLangHome(langName) {
      return dispatch(ajaxGetLangHome(langName));
    }
  })
)
export default class LangIndex extends Component {
  config = {
    navigationBarTitleText: "语言热度详情"
  };
  constructor() {
    super();
    this.state = {
      langName: "",
      rankIndex: "",
      isModalOpen: false,
      currentTab: 0
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const { langName, rankIndex } = this.$router.params;
    this.props.ajaxGetLangHome(langName);
    this.setState({
      langName,
      rankIndex
    });
  }
  componentWillReceiveProps(nextprops) {}
  refLineChart = node => (this.lineChart = node);
  onShareAppMessage = res => {
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: "/pages/index/index"
    };
  };
  tabClick = value => {
    this.setState({
      currentTab: value
    });
  };
  render() {
    const { langName, currentTab, rankIndex } = this.state;
    const { langHome } = this.props.rankList || {};
    const tabList = [{ title: "语言热度详情" }, { title: "评论" }];
    return (
      <View className="wrap-content">
        <View className="lang-title">
          <View className="icon">
            <Image src={langHome.languageSymbol} className="logo" />
          </View>
          <View className="name">
            <View>
              {langName}&nbsp;&nbsp;&nbsp;
              <AtBadge value="HOT" className="badge" />
            </View>
            <View>
              <AtRate value={langHome.languageDifficultyIndex} />
            </View>
          </View>
          <View className="state">
            {/* <View>{langHome.joinedNumber}人</View>
              <View>已加入学习计划</View> */}
            <AddPlan langName={langName} />
          </View>
        </View>
        <View className="intro-card">
          <View className="per-content">
            <View className="tend-name">热度指数</View>
            <View className="tend-num">{langHome.fixedFinalExponent}</View>
          </View>
          <View className="divider" />
          <View className="per-content">
            <View className="tend-name">排名</View>
            <View className="tend-num">1</View>
          </View>
          <View className="divider" />
          <View className="per-content">
            <View className="tend-name">粉丝</View>
            <View className="tend-num">99</View>
          </View>
        </View>
        {/* <View className="data-info">
            <View className="tend-wrap">
              <View className="tend-num">{langHome.fixedFinalExponent}</View>
              <View className="tend-title">热度指数</View>
            </View>
            <View className="tend-wrap">
              <View className="tend-num">
                {langHome.fixedFinalExponentIncreasing}
              </View>
              <View className="tend-title">成长指数</View>
            </View>
          </View> */}
        <View className="wrap-title">好友在用</View>
        <View className="avatar-wrap">
          <View className="per-avatar">
            <Image src="https://jdc.jd.com/img/200" />
          </View>
          <View className="per-avatar">
            <Image src="https://jdc.jd.com/img/200" />
          </View>
          <View className="per-avatar">
            <Image src="https://jdc.jd.com/img/200" />
          </View>

          <View className="per-avatar per-avatar-add">
            <button open-type="share">
              <AtIcon value="add" size="30" color="#4f5fc5" />
            </button>
          </View>
        </View>
        <AtDivider />
        <AtTabs
          current={currentTab}
          tabList={tabList}
          onClick={this.tabClick.bind(this)}>
          <AtTabsPane current={currentTab} index={0}>
            {/* {rankIndex == "auth" ? (
              <LangHome langNameProp={langName} />
            ) : (
              <DemandHome demandNameProp={langName} />
            )} */}
            {rankIndex == "auth" && <LangHome langNameProp={langName} />}
            {rankIndex == "demand" && <DemandHome demandNameProp={langName} />}
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <CommentList />
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}

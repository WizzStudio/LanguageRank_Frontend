import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import {
  AtRate,
  AtBadge,
  AtTabs,
  AtTabsPane,
  AtIcon,
  AtDivider,
  AtInput,
  AtButton,
  AtMessage
} from "taro-ui";
import "./langDetail.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetLangHome } from "../../actions/rankList";
import LangHome from "./langHome";
import DemandHome from "./demandHome";
import CommentList from "../../components/detail/CommentList";
import AddComment from "../../components/detail/addComment";
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
      currentTab: 0,
      inputValue: ""
    };
  }
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
  handleInputChange = val => {
    this.setState({
      inputValue: val
    });
    return val;
  };
  toClassHome = () => {
    Taro.navigateTo({
      url: "/pages/class/classHome"
    });
  };
  updateCmt = () => {
    const languageName = this.state.langName;
    const comment = this.state.inputValue;
    console.log("inputValue", this.state);
    Taro.request({
      url: "https://pgrk.wizzstudio.com/updateemployeerankcomment",
      method: "POST",
      data: {
        languageName,
        comment,
        userId: 1
      }
    }).then(response => {
      const res = response.data;
      if (res.code === 0) {
        Taro.atMessage({
          message: "评论成功",
          type: "success"
        });
      }
      this.setState({
        inputValue: ""
      });
    });
  };
  render() {
    const { langName, currentTab, rankIndex } = this.state;
    const { langHome } = this.props.rankList || {};
    const tabList = [{ title: "语言热度详情" }, { title: "评论" }];
    return (
      <View className="wrap-content">
        <AtMessage />
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
            {/* <AddPlan langName={langName} /> */}
            <AtButton type="primary" size="small" onClick={this.toClassHome}>
              进入猿圈
            </AtButton>
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
            <CommentList type={rankIndex} langName={langName} fresh={1} />
          </AtTabsPane>
        </AtTabs>
        {currentTab && (
          <View>
            {/* <View className="input-top" />
            <View className="input-wrap">
              <AtInput
                type="text"
                maxLength="999"
                placeholder="我有问题想问"
                value={this.state.inputValue}
                onChange={this.handleInputChange.bind(this)}
              />
              <AtButton type="primary" size="small" onClick={this.updateCmt}>
                提交
              </AtButton>
            </View> */}
            <AddComment />
          </View>
        )}
      </View>
    );
  }
}

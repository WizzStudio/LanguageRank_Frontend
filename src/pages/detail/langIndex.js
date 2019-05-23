import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import {
  AtBadge,
  AtTabs,
  AtTabsPane,
  AtDivider,
  AtButton,
  AtMessage
} from "taro-ui";
import "./langDetail.scss";
import myApi from "../../service/api";
import LangHome from "./langHome";
import DemandHome from "./demandHome";
import CmtList from "../../components/detail/cmtList";
import AddComment from "../../components/detail/addComment";
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
      languageFans: 0,
      languageSymbol: "",
      exponent: "",
      rankNum: 0
    };
  }
  componentDidMount() {
    const { langName, rankIndex, rankNum, exponent, tab } = this.$router.params;
    this.getLangTop(langName).then(res => {
      if (res.code === 0) {
        this.setState({
          langName,
          rankIndex,
          languageFans: res.data.languageFans || "暂无",
          languageSymbol: res.data.languageSymbol,
          rankNum,
          exponent,
          currentTab: parseInt(tab)
        });
      }
    });
  }
  getLangTop = async langName => {
    if (langName === "C#") {
      langName = "C%23";
    }
    const res = await myApi(`/${langName}/message`);
    return res;
  };

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
  toClassList = () => {
    Taro.navigateTo({
      url: "/pages/class/classList"
    });
  };
  refCmt = node => (this.cmtNode = node);
  updateCmt = () => {
    this.cmtNode.getCmtList();
  };
  render() {
    const {
      langName,
      currentTab,
      rankIndex,
      langHome,
      languageFans,
      languageSymbol,
      rankNum,
      exponent
    } = this.state;
    const tabList = [{ title: "语言热度详情" }, { title: "评论" }];
    return (
      <View className="wrap-content">
        <AtMessage />
        <View className="lang-title">
          <View className="icon">
            <Image src={languageSymbol} className="logo" />
          </View>
          <View className="name">
            <View>
              {langName}&nbsp;&nbsp;&nbsp;
              <AtBadge value="HOT" className="badge" />
            </View>
          </View>
          <View className="state">
            <AtButton
              className="tostudy-btn"
              type="primary"
              size="normal"
              onClick={this.toClassList}>
              我想学
            </AtButton>
          </View>
        </View>
        <View className="intro-card">
          <View className="per-content">
            <View className="tend-name">热度指数</View>
            <View className="tend-num">{exponent}</View>
          </View>
          <View className="divider" />
          <View className="per-content">
            <View className="tend-name">排名</View>
            <View className="tend-num">{rankNum}</View>
          </View>
          <View className="divider" />
          <View className="per-content">
            <View className="tend-name">粉丝</View>
            <View className="tend-num">{languageFans}</View>
          </View>
        </View>
        <AtTabs
          current={currentTab}
          tabList={tabList}
          onClick={this.tabClick.bind(this)}>
          <AtTabsPane current={currentTab} index={0}>
            {rankIndex == "auth" && (
              <LangHome langHomeData={langHome} langNameProp={langName} />
            )}
            {rankIndex == "demand" && <DemandHome demandNameProp={langName} />}
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <CmtList
              ref={this.refCmt}
              typeCmt={rankIndex}
              langName={langName}
            />
          </AtTabsPane>
        </AtTabs>
        {currentTab && (
          <View>
            <AddComment
              type={rankIndex}
              langName={langName}
              onRefresh={this.updateCmt}
            />
          </View>
        )}
      </View>
    );
  }
}

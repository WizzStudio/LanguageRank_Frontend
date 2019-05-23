import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtFloatLayout, AtIcon } from "taro-ui";
import AuthItem from "../../components/rank/authItem";
import "./authRankList.scss";
import ShareCanvasRank from "../../components/canvasPost/shareCanvasRank";
import myApi from "../../service/api";

export default class DemandRankList extends Component {
  constructor() {
    super();
    this.state = {
      isOpened: false,
      isShared: false,
      demandRank: []
    };
  }
  componentDidMount() {
    myApi("/employerdemandrank").then(res => {
      this.setState({
        demandRank: res.data
      });
    });
  }
  openIntro = () => {
    this.setState({
      isOpened: true
    });
  };
  closeIntro = () => {
    this.setState({
      isOpened: false
    });
  };
  openCanvas = () => {
    this.setState({
      isShared: true
    });
  };
  closeCanvas = () => {
    this.setState({
      isShared: false
    });
  };
  componentDidShow() {}
  render() {
    // const { demandRank } = this.props.rankList ? this.props.rankList : [];
    const { demandRank } = this.state;
    return (
      <View>
        {demandRank.map((rank, index) => {
          return (
            <View key={index}>
              <AuthItem
                langImg={rank.languageSymbol}
                langName={rank.languageName}
                heatNum={rank.employeeFinalExponent}
                tend={rank.languageTend}
                index={index}
                type="demand"
              />
            </View>
          );
        })}
        <View className="share" onClick={this.openCanvas}>
          <AtIcon value="share" size="30" color="#FFF" />
        </View>
        {isShared ? (
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
              <ShareCanvasRank rankListData={demandRank} />
            </View>
          </View>
        ) : (
          ""
        )}
        <View className="rank-intro" onClick={this.openIntro.bind(this)}>
          榜单介绍
        </View>
        <AtFloatLayout
          isOpened={this.state.isOpened}
          onClose={this.closeIntro.bind(this)}>
          <View>
            <View className="intro-title">榜单介绍</View>
            <View className="intro-content">
              <View className="pre-intro-content">
                1、雇主需求榜是根据国内各大互联网公司相关技术岗位的招聘需求统计出排名数据，反应某个编程语言在行业中需求的热门程度。\n
              </View>
              <View className="pre-intro-content">
                2、雇主需求榜每周更新一次，依据的指数是基于该编程语言在行业内的岗位需求数量、薪资待遇、热门城市、发展趋势，其结果可为开发者的就业选择提供依据。\n
              </View>
              <View className="pre-intro-content">
                3、该指数可以用来检阅开发者的编程技能是否是雇主需要的，或是否有必要作出战略改变，以及什么编程语言是应该及时掌握的。
              </View>
            </View>
            <View className="intro-close">
              <AtButton type="primary" onClick={this.closeIntro.bind(this)}>
                确定
              </AtButton>
            </View>
          </View>
        </AtFloatLayout>
      </View>
    );
  }
}

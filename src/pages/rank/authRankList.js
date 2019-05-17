import Taro, { Component } from "@tarojs/taro";
import { View, CoverView } from "@tarojs/components";
import { AtFloatLayout, AtButton, AtIcon } from "taro-ui";
import "./authRankList.scss";
import AuthItem from "../../components/rank/authItem";
import cmt from "../../assets/icon/cmt.png";
import ShareCanvasAuth from "../../components/canvasPost/shareCanvasAuth";
import { connect } from "@tarojs/redux";
import { ajaxGetAuth } from "../../actions/rankList";
@connect(
  ({ rankList }) => ({
    rankList
  }),
  dispatch => ({
    ajaxGetAuth() {
      //加个return 就可以then了！！！！！！！！！！！！！！
      return dispatch(ajaxGetAuth());
    }
  })
)
class AuthRankList extends Component {
  constructor() {
    super();
    this.state = {
      pageLoaded: false,
      isOpened: false,
      isShared: false,
      responsive: 1
    };
  }
  static defaultProps = {
    rankList: {
      authRank: []
    }
  };
  componentDidMount() {
    this.props.ajaxGetAuth();
  }
  handleNavigate(name) {
    Taro.navigateTo({
      url: `/pages/detail/langIndex?rankIndex=${"auth"}&langName=${encodeURI(
        name
      )}`
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
    const rankList = this.props.rankList ? this.props.rankList.authRank : [];
    const { isShared } = this.state;
    return (
      <View>
        {rankList.map((rank, index) => {
          return (
            <View
              key={index}
              onClick={this.handleNavigate.bind(this, rank.languageName)}
              className="item-wrap">
              {/* <View className="item-left"> */}
              <AuthItem
                langImg={rank.languageSymbol}
                langName={rank.languageName}
                heatNum={rank.fixedFinalExponent}
                tend={rank.languageTend}
                index={index}
              />
              {/* </View> */}
              {/* <View className="item-right">
                <Image src={cmt} className="cmt-logo" />
              </View> */}
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
              <ShareCanvasAuth rankContent="213" />
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
            <View className="intro-title" ref={this.refTest}>
              榜单介绍
            </View>
            <View className="intro-content">
              <View className="pre-intro-content">
                1、语言热度榜（世界编程语言排行榜）是根据互联网上有经验的程序员、课程和第三方厂商的数量，并使用搜索引擎（如Google、Bing、Yahoo!）以及Wikipedia、Amazon、YouTube统计出排名数据，只是反映某个编程语言的热门程度，并不能说明一门编程语言好不好，或者一门语言所编写的代码数量多少。\n
              </View>
              <View className="pre-intro-content">
                2、语言热度排行榜每日更新一次，依据的指数是基于世界范围内的资深软件工程师和第三方供应商提供，其结果作为当前业内程序开发语言的流行使用程度的有效指标。\n
              </View>
              <View className="pre-intro-content">
                3、该指数可以用来检阅开发者的编程技能能否跟上趋势，或是否有必要作出战略改变，以及什么编程语言是应该及时掌握的。
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
export default AuthRankList;

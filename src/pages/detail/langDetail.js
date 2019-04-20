import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider, AtRate, AtIcon } from "taro-ui";
import "./langDetail.scss";
import AddPlan from "../../components/rank/addPlan";
import { connect } from "@tarojs/redux";
import { ajaxGetLangMore } from "../../actions/rankList";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
@connect(
  ({ rankList, userInfo }) => ({
    rankList,
    userInfo
  }),
  dispatch => ({
    ajaxGetLangMore(langName) {
      dispatch(ajaxGetLangMore(langName));
    },
    ajaxGetUserAllInfo(data) {
      dispatch(ajaxGetUserAllInfo(data));
    }
  })
)
export default class LangDetail extends Component {
  config = {
    navigationBarTitleText: "语言介绍"
  };
  constructor() {
    super();
    this.state = {
      langName: ""
    };
  }
  componentWillMount() {
    const { langName } = this.$router.params;
    this.setState({
      langName
    });
    this.props.ajaxGetLangMore(langName);
  }
  componentDidMount() {}
  onShareAppMessage = res => {
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: "/pages/index/index"
    };
  };
  render() {
    const { langName } = this.state;
    const { langMore } = this.props.rankList;
    return (
      <View className="lang-detail">
        <View className="wrap-content">
          <View className="lang-title">
            <View className="icon">
              <Image src={langMore.language.languageSymbol} className="logo" />
            </View>
            <View className="name">
              <View>{langName}</View>
              <View>
                <AtRate value={langMore.language.languageDifficultyIndex} />
              </View>
              <View className="new-intro">
                始于{langMore.language.languageBeginTime}
              </View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View class="wrap-content">
          <View className="wrap-title">语言简史</View>
          <View className="history">
            {langMore.language.languageDevelopmentHistory}
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}可以用来做</View>
          <View className="app">
            {Object.keys(langMore.languageUse).map((key, index) => (
              <View className="wrap-item" key={index}>
                <View className="wrap-img">
                  <Image src={langMore.languageUse[key]} className="img" />
                </View>
                <View className="little-title">{key}</View>
              </View>
            ))}
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}的优缺点</View>
          <View className="ad-disad">
            {langMore.languageAdvantage.map((item, index) => (
              <View key={index} className="row-wrap">
                <AtIcon value="check-circle" color="#65DF63" className="icon" />
                {item}
              </View>
            ))}
            {langMore.languageDisadvantage.map((item, index) => (
              <View key={index} className="row-wrap">
                <AtIcon value="close-circle" color="#FF8080" className="icon" />
                {item}
              </View>
            ))}
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}应用领域</View>
          <View className="app">
            {Object.keys(langMore.languageApplicationFields).map(
              (key, index) => (
                <View className="wrap-item" key={index}>
                  <View className="wrap-img">
                    <Image
                      src={langMore.languageApplicationFields[key]}
                      className="img"
                    />
                  </View>
                  <View className="little-title">{key}</View>
                </View>
              )
            )}
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}的顶级雇主</View>
          <View className="app">
            {langMore.companyList.map((item, index) => (
              <View className="wrap-item" key={index}>
                <View className="wrap-img">
                  <Image src={item.companySymbol} className="img" />
                </View>
                <View className="little-title">{item.companyName}</View>
              </View>
            ))}
          </View>
        </View>
        <View className="blank"> </View>
        <AddPlan langName={langName} />
      </View>
    );
  }
}

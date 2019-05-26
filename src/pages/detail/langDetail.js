import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider, AtRate, AtIcon, AtBadge } from "taro-ui";
import "./langDetail.scss";
import myApi from "../../service/api";
let myUserId;
export default class LangDetail extends Component {
  config = {
    navigationBarTitleText: "语言介绍"
  };
  constructor() {
    super();
    this.state = {
      langName: "",
      langMore: {
        language: {},
        languageUse: {},
        languageAdvantage: [],
        languageDisadvantage: [],
        languageApplicationFields: {},
        companyList: []
      }
    };
  }
  componentWillMount() {}
  componentDidMount() {
    myUserId = Taro.getStorageSync("login").userId;
    let { langName } = this.$router.params;
    console.log("router中的langName", langName);
    this.getLangDetail(langName);
  }
  getLangDetail = langName => {
    if (langName === "C#") {
      langName = "C%23";
    }
    let url = `/languagerank/${langName}/more`;
    myApi(url).then(res => {
      if (res.code === 0) {
        this.setState({
          langName,
          langMore: res.data
        });
      }
    });
  };
  onShareAppMessage = res => {
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: `/pages/index/index?shareId=${myUserId}`
    };
  };
  render() {
    const { langMore } = this.state;
    return (
      <View>
        {langMore ? (
          <View className="lang-detail">
            <View className="wrap-content">
              <View className="lang-title">
                <View className="icon">
                  <Image
                    src={langMore.language.languageSymbol}
                    className="logo"
                  />
                </View>
                <View className="name">
                  {/* <View>{langName}</View> */}
                  <View>{langMore.language.languageName}</View>
                  <View className="difficult">
                    <AtRate value={langMore.language.languageDifficultyIndex} />
                    <AtBadge value="难度" className="badge" />
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
              <View className="wrap-title">
                {langMore.language.languageName}可以用来做
              </View>
              <View className="app">
                {Object.keys(langMore.languageUse || {}).map((key, index) => (
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
              <View className="wrap-title">
                {langMore.language.languageName}的优缺点
              </View>
              <View className="ad-disad">
                {langMore.languageAdvantage.map((item, index) => (
                  <View key={index} className="row-wrap">
                    <AtIcon
                      value="check-circle"
                      color="#65DF63"
                      className="icon"
                    />
                    {item}
                  </View>
                ))}
                {langMore.languageDisadvantage.map((item, index) => (
                  <View key={index} className="row-wrap">
                    <AtIcon
                      value="close-circle"
                      color="#FF8080"
                      className="icon"
                    />
                    {item}
                  </View>
                ))}
              </View>
            </View>
            <AtDivider />
            <View className="wrap-content">
              <View className="wrap-title">
                {langMore.language.languageName}应用领域
              </View>
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
              <View className="wrap-title">
                {langMore.language.languageName}的顶级雇主
              </View>
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
          </View>
        ) : (
          ""
        )}
      </View>
    );
  }
}

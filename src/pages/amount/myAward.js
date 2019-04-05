import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./myAward.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAward } from "../../actions/useInfo";

@connect(
  ({ userAward }) => ({
    userAward
  }),
  dispatch => ({
    ajaxGetUserAward(id) {
      dispatch(ajaxGetUserAward(id));
    }
  })
)
export default class MyAward extends Component {
  constructor() {
    super();
  }
  static defaultProps = {
    userInfo: {
      userAward: {
        studyedLanguage: []
      }
    }
  };
  componentDidMount() {
    const loginInfo = Taro.getStorageSync("login");
    this.props.ajaxGetUserAward(loginInfo.userid);
  }
  componentWillReceiveProps(nextprops) {
    console.log("nextprops", nextprops);
  }
  render() {
    const award = this.props.userInfo.userAward.studyedLanguage;
    console.log("award", award);
    return (
      <View>
        {award.map((item, index) => (
          <View className="my-award" key={index}>
            <View className="award-title">{item.languageName}</View>
            <View className="award-wrap">
              <View className="per-award">
                <View className="award-content">容器</View>
                <View className="award-name">Java入门书籍</View>
              </View>
              <View className="per-award">
                <View className="award-content">容器</View>
                <View className="award-name">Java入门书籍</View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }
}

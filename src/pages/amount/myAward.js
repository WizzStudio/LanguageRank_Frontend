import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./myAward.scss";
import { AtDivider } from "taro-ui";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAward } from "../../actions/useInfo";
import awardimg from "../../assets/img/award.png";
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserAward(id) {
      dispatch(ajaxGetUserAward(id));
    }
  })
)
export default class MyAward extends Component {
  config = {
    navigationBarTitleText: "我的奖励"
  };
  constructor() {
    super();
  }
  // static defaultProps = {
  //   userInfo: {
  //     userAward: {
  //       studyedLanguage: []
  //     }
  //   }
  // };
  componentDidMount() {
    const loginInfo = Taro.getStorageSync("login");
    this.props.ajaxGetUserAward(loginInfo.userid);
    console.log("this.stat11e", this.state);
  }

  componentWillReceiveProps(nextprops) {
    console.log("nextprops", nextprops);
  }
  getNoAward = () => {
    Taro.showToast({
      title: "完成七日计划,即可领取奖励~",
      icon: "none"
    });
  };
  getPerAward = (num, index) => {
    console.log("num,index", num, index);
    let content = "";
    if (index === -1) {
      num === 1
        ? (content = this.props.userInfo.userAward.studyingLanguage.linkOne)
        : (content = this.props.userInfo.userAward.studyingLanguage.linkTwo);
    } else {
      num === 1
        ? (content = this.props.userInfo.userAward.studyedLanguage[index]
            .linkOne)
        : (content = this.props.userInfo.userAward.studyedLanguage[index]
            .linkTwo);
    }

    Taro.showModal({
      title: "领取奖励",
      content: content,
      cancelText: "关闭",
      confirmText: "点击复制",
      confirmColor: "#4f5fc5",
      success(res) {
        if (res.confirm) {
          console.log("用户点击确定");
          Taro.setClipboardData({
            data: content,
            success: function() {
              Taro.showToast({
                title: "复制成功"
              });
            },
            fail: function(params) {
              Taro.showToast({
                title: "复试失败"
              });
            }
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };
  render() {
    const hadAward = this.props.userInfo.userAward.studyedLanguage;
    const havingAward = this.props.userInfo.userAward.studyingLanguage;
    return (
      <View>
        <View className="my-award" key={index}>
          <View className="pre-award-title">待领取的奖励</View>
          {havingAward.isViewed ? (
            ""
          ) : (
            <View>
              <View className="award-title">{havingAward.languageName}</View>
              <View className="award-wrap">
                <View className="per-award">
                  <View className="award-content">
                    <Image
                      src={havingAward.imageOne}
                      className="award-img"
                      onClick={this.getNoAward}
                    />
                  </View>
                  <View className="award-name">{havingAward.contentOne}</View>
                </View>
                <View className="per-award">
                  <View className="award-content">
                    <Image
                      src={havingAward.imageTwo}
                      className="award-img"
                      onClick={this.getNoAward}
                    />
                  </View>
                  <View className="award-name">{havingAward.contentTwo}</View>
                </View>
              </View>
            </View>
          )}

          {hadAward.map((item, index) =>
            item.isViewed ? (
              ""
            ) : (
              <View key={index}>
                <View className="award-title">{item.languageName}</View>
                <View className="award-wrap">
                  <View className="per-award">
                    <View className="award-content">
                      <Image
                        src={item.imageOne}
                        className="award-img"
                        onClick={this.getNoAward}
                      />
                    </View>
                    <View className="award-name">{havingAward.contentOne}</View>
                  </View>
                  <View className="per-award">
                    <View className="award-content">
                      <Image
                        src={item.imageTwo}
                        className="award-img"
                        onClick={this.getNoAward}
                      />
                    </View>
                    <View className="award-name">{havingAward.contentTwo}</View>
                  </View>
                </View>
              </View>
            )
          )}
        </View>
        <AtDivider />
        <View className="pre-award-title">已获得的奖励</View>
        {havingAward.isViewed ? (
          <View>
            <View className="award-title">{havingAward.languageName}</View>
            <View className="award-wrap">
              <View className="per-award">
                <View className="award-content">
                  <Image
                    src={havingAward.imageOne}
                    className="award-img"
                    onClick={this.getPerAward.bind(this, 1, -1)}
                  />
                </View>
                <View className="award-name">{havingAward.contentOne}</View>
              </View>
              <View className="per-award">
                <View className="award-content">
                  <Image
                    src={havingAward.imageTwo}
                    className="award-img"
                    onClick={this.getPerAward.bind(this, 2, -1)}
                  />
                </View>
                <View className="award-name">{havingAward.contentTwo}</View>
              </View>
            </View>
          </View>
        ) : (
          ""
        )}
        {hadAward.map((item, index) =>
          item.isViewed ? (
            <View className="my-award" key={index}>
              <View className="award-title">{item.languageName}</View>
              <View className="award-wrap">
                <View className="per-award">
                  <View
                    className="award-content"
                    onClick={this.getPerAward.bind(this, 1, index)}>
                    <Image src={item.imageOne} className="award-img" />
                  </View>
                  <View className="award-name">{item.contentOne}</View>
                </View>
                <View className="per-award">
                  <View
                    className="award-content"
                    onClick={this.getPerAward.bind(this, 2, index)}>
                    <Image src={item.imageTwo} className="award-img" />
                  </View>
                  <View className="award-name">{item.contentTwo}</View>
                </View>
              </View>
            </View>
          ) : (
            ""
          )
        )}
        <View className="blank" />
      </View>
    );
  }
}

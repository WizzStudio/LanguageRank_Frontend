import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtAvatar, AtDivider, AtProgress, AtButton } from "taro-ui";
import "./myInfo.scss";
import avatar from "../../assets/img/avatar.jpg";

export default class MyInfo extends Component {
  constructor() {
    super();
    this.state = {
      isLogin: false
    };
  }
  handleNavigate = () => {
    Taro.navigateTo({
      url: "/pages/amount/dailyPlan"
    });
  };
  handleLogin = () => {
    Taro.login({
      success(res) {
        if (res.code) {
          console.log("res.code", res.code);
          Taro.request({
            url: "http://pgrk.wizzstudio.com/login",
            method: "POST",
            data: {
              code: res.code
            }
          }).then(res => {
            console.log("re的res", res);
          });
        }
      }
    });
  };
  render() {
    const { isLogin } = this.state;
    return (
      <View className="top-bg">
        <View className="blank" />
        {isLogin ? (
          <View className="intro">
            <View className="my-avatar center">
              <AtAvatar circle={true} size="large" image={avatar} />
            </View>
            <View className="my-name center">taleyoung</View>
          </View>
        ) : (
          <View className="intro" onClick={this.handleLogin}>
            <View className="my-avatar center">
              <AtAvatar circle={true} size="large" image={avatar} />
            </View>
            <View className="my-name center">点击登陆</View>
          </View>
        )}

        <View className="blank" />

        <View className="study-plan">
          <View className="blank" />
          <View className="plan-title-wrap" onClick={this.handleNavigate}>
            <View className="plan-title">我的学习计划</View>
            <View className="isPlaned">未加入</View>
          </View>
          <View className="plan-state">
            <View className="per-plan-state">
              <View>1369</View>
              <View>已加入学习计划 </View>
            </View>
            <View className="per-plan-state">
              <View>120</View>
              <View>今日新增 </View>
            </View>
          </View>
          <View className="plan-progress">
            <AtProgress percent={50} strokeWidth={10} status="progress" />
            <View className="progress-intro">完成计划可获得相应奖励</View>
          </View>
          <View className="plan-action">
            <View>
              <AtButton type="secondary" className="my-award my-button">
                我的奖励
              </AtButton>
              <AtButton type="secondary" className="my-question my-button">
                问题反馈
              </AtButton>
            </View>
            <View>
              <AtButton type="primary" className="login-out my-button">
                退出登录
              </AtButton>
            </View>
          </View>

          {/* <View className="kinds">
            <View className="kinds-title">编程语言种类</View>
            <View className="kinds-img">语言图片</View>
          </View>
          <View className="plan-graph">学习路线图</View>
          <View className="books">
            <View className="per-book">
              <View>java推荐书籍</View>
              <Image />
            </View>
            <View className="per-book">
              <View>java推荐书籍</View>
              <Image />
            </View>
          </View> */}
        </View>
      </View>
    );
  }
}

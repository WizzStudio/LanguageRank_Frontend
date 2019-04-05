import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";

import { AtSegmentedControl } from "taro-ui";
import AuthRankList from "../rank/authRankList";
import DemandRankList from "../rank/demandRankList";

import "./index.scss";

class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };
  constructor() {
    super();
    this.state = {
      current: 0
    };
  }
  componentDidMount() {
    if (!Taro.getStorageSync("login")) {
      this.handleLogin();
    }
  }
  handleClick(value) {
    this.setState({
      current: value
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleLogin = () => {
    Taro.login({
      success(res) {
        if (res.code) {
          console.log("res.code", res.code);
          Taro.request({
            url: "https://pgrk.wizzstudio.com/login",
            method: "POST",
            data: {
              code: res.code
            }
          }).then(res => {
            console.log("re的res", res);
            if (res.data.code === 0) {
              const data = res.data.data;
              Taro.setStorageSync("login", {
                userid: data.userId,
                openId: data.openId,
                session_key: data.session_key
              });
            }
          });
        }
      }
    });
  };
  render() {
    return (
      <View className="top-bg">
        <View className="blank" />
        <View className="wrap">
          <View className="tab-wrap">
            <AtSegmentedControl
              values={["语言热度榜", "雇主需求榜"]}
              onClick={this.handleClick.bind(this)}
              current={this.state.current}
              className="tab-seg"
            />
          </View>
          {this.state.current === 0 ? (
            <View className="tab-content">
              <AuthRankList />
            </View>
          ) : null}
          {this.state.current === 1 ? (
            <View className="tab-content">
              <DemandRankList />
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

export default Index;

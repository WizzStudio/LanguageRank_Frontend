import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";

import Index from "./pages/index";
import configStore from "./store";

import "./app.scss";
import "./custom-variables.scss";
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  config = {
    pages: [
      "pages/index/index",
      "pages/amount/myInfo",
      "pages/class/classIndex",
      "pages/class/classHome",
      "pages/class/classList",
      // "pages/amount/dailyPlan",
      "pages/amount/myAward",
      "pages/amount/userRank",
      "pages/detail/langIndex",
      "pages/detail/langDetail"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#4f5fc5",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "white"
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/index/index",
          text: "排行榜",
          iconPath: "./assets/icon/rank2.png",
          selectedIconPath: "./assets/icon/rank.png"
        },
        {
          pagePath: "pages/class/classIndex",
          text: "猿圈",
          iconPath: "./assets/icon/class.png",
          selectedIconPath: "./assets/icon/class2.png"
        },
        {
          pagePath: "pages/amount/myInfo",
          text: "我",
          iconPath: "./assets/icon/me.png",
          selectedIconPath: "./assets/icon/me2.png"
        }
      ],
      color: "#8a8a8a",
      selectedColor: "#4f5fc5",
      backgroundColor: "#fefefe",
      borderStyle: "black"
    }
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./classIndex.scss";
import testImg from "../../assets/img/canvasAuth.png";
import { connect } from "@tarojs/redux";
import { ajaxGetUserClass } from "../../actions/classInfo";
import { getLoginInfo } from "../../utils/getlocalInfo";
@connect(
  ({ classInfo }) => ({
    classInfo
  }),
  dispatch => ({
    ajaxGetUserClass(userId) {
      return dispatch(ajaxGetUserClass(userId));
    }
  })
)
export default class ClassIndex extends Component {
  config = {
    navigationBarTitleText: "猿圈"
  };
  constructor() {
    super();
  }
  componentDidMount() {
    const resInfo = getLoginInfo();
    if (resInfo) {
      Taro.showLoading({
        title: "正在加载中...."
      });
      const data = {
        userId: resInfo.userId
      };
      this.props.ajaxGetUserClass(data).then(res => {
        console.log("res", res);
        Taro.hideLoading();
      });
    } else {
    }
  }
  toClassList = () => {
    Taro.navigateTo({
      url: "/pages/class/classList"
    });
  };
  toClassHome = () => {
    Taro.navigateTo({
      url: "/pages/class/classHome?isAdded=1"
    });
  };
  render() {
    const { userClass } = this.props.classInfo || [];
    // userClass.push({
    //   clazzName: "Java入门班",
    //   monitor: 2,
    //   clazzImage: "https://xxx.jpg"
    // });
    return (
      <View>
        <View className="blank" />
        <View className="my-award">
          <View className="award-wrap">
            {userClass.map((item, index) => (
              <View
                key={item.clazzName}
                className="per-award"
                onClick={this.toClassHome}>
                <View className="award-content">
                  <Image src={testImg} className="award-img" />
                </View>
                <View className="award-name">{item.clazzName}</View>
              </View>
            ))}
          </View>
        </View>
        <View className="award-wrap">
          <View className="per-award">
            <View
              className="add-award-content award-img"
              onClick={this.toClassList}>
              <View>+</View>
              <View>加入项目</View>
            </View>
          </View>
        </View>
        <View className="blank" />
      </View>
    );
  }
}

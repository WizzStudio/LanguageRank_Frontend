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
    const data = {
      userId: resInfo.userId
    };
    this.props.ajaxGetUserClass(data).then(res => {
      console.log("res", res);
    });
  }
  toClassList = () => {
    Taro.navigateTo({
      url: "/pages/class/classList"
    });
  };
  toClassHome = clazzId => {
    Taro.navigateTo({
      url: `/pages/class/classHome?clazzId=${clazzId}`
    });
  };
  render() {
    const { userClass } = this.props.classInfo || [];
    return (
      <View>
        <View className="blank" />
        <View className="my-award">
          <View className="award-wrap">
            {userClass.map((item, index) => (
              <View
                key={item.clazzName}
                className="per-award"
                onClick={this.toClassHome.bind(this, item.clazzId)}>
                <View className="award-content">
                  <Image src={testImg} className="award-img" />
                  <View className="monitor-name">
                    班长：{item.monitorNickName}
                  </View>
                </View>

                <View className="award-name">{item.clazzName}</View>
              </View>
            ))}
            <View className="per-award">
              <View
                className="add-award-content award-img"
                onClick={this.toClassList}>
                <View className="add">+</View>
                <View>加入班级</View>
              </View>
            </View>
          </View>
        </View>

        <View className="blank" />
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { AddClass } from "../../components/class/addClass";
import "./classList.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetAllClass } from "../../actions/classInfo";
@connect(
  ({ classInfo }) => ({
    classInfo
  }),
  dispatch => ({
    ajaxGetAllClass(userId) {
      return dispatch(ajaxGetAllClass(userId));
    }
  })
)
export default class ClassList extends Component {
  config = {
    navigationBarTitleText: "圈内项目"
  };
  constructor() {
    super();
  }
  componentDidMount() {
    this.props.ajaxGetAllClass();
  }
  render() {
    const { allClass } = this.props.classInfo || [];
    return (
      <View>
        {allClass.map((item, index) => (
          <View className="per-class" key={item.clazzName}>
            <View className="title">{item.clazzName}</View>
            <View className="person-num">{item.studentNumber}人</View>
            <View className="add-btn">
              {/* <AtButton type="primary" size="small">
                加入
              </AtButton> */}
              <AddClass clazzId={item.clazzId} />
            </View>
          </View>
        ))}
      </View>
    );
  }
}

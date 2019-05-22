import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { JoinClass } from "../../components/class/joinClass";
import "./classList.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetAllClass, ajaxGetUserClass } from "../../actions/classInfo";
import { getLoginInfo } from "../../utils/getlocalInfo";
const myUserId = getLoginInfo().userId;
@connect(
  ({ classInfo }) => ({
    classInfo
  }),
  dispatch => ({
    ajaxGetAllClass(userId) {
      return dispatch(ajaxGetAllClass(userId));
    },
    ajaxGetUserClass(data) {
      return dispatch(ajaxGetUserClass(data));
    }
  })
)
export default class ClassList extends Component {
  config = {
    navigationBarTitleText: "圈内项目"
  };
  constructor() {
    super();
    this.state = {
      isAddedArr: []
    };
  }
  componentDidMount() {
    this.props.ajaxGetAllClass().then(res => {
      if (res.code === 0) {
        if (this.props.classInfo.userClassId) {
          this.checkIsAdded(res.data);
        } else {
          const data = {
            userId: myUserId
          };
          this.props.ajaxGetUserClass(data).then(res => {
            this.checkIsAdded(res.data);
          });
        }
      }
    });
  }

  checkIsAdded = allClass => {
    const { userClassId } = this.props.classInfo;
    let isAddedArr = [];
    allClass.forEach((item, index) => {
      if (userClassId.indexOf(parseInt(item.clazzId)) == -1) {
        isAddedArr[index] = false;
      } else {
        isAddedArr[index] = true;
      }
    });
    this.setState({
      isAddedArr
    });
  };
  changeAddStatu = index => {
    let isAddedArr = [];
    isAddedArr[index] = true;
    console.log("index", index, this.state.isAddedArr);
    this.setState({
      isAddedArr
    });
  };
  toClassHome = clazzId => {
    Taro.navigateTo({
      url: `/pages/class/classHome?clazzId=${clazzId}`
    });
  };
  render() {
    const { allClass } = this.props.classInfo || [];
    const { isAddedArr } = this.state;
    return (
      <View>
        {allClass.map((item, index) => (
          <View className="per-class" key={item.clazzName}>
            <View className="title">{item.clazzName}</View>
            <View className="person-num">{item.studentNumber}人</View>
            <View className="btn-wrap">
              <AtButton
                type="secondary"
                size="small"
                onClick={this.toClassHome.bind(this, item.clazzId)}>
                查看
              </AtButton>
            </View>
            <View className="btn-wrap">
              {isAddedArr[index] ? (
                <AtButton type="primary" size="small" disabled>
                  已加
                </AtButton>
              ) : (
                <JoinClass
                  clazzId={item.clazzId}
                  index={index}
                  onChangeAdd={this.changeAddStatu}
                  type="classList"
                />
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }
}

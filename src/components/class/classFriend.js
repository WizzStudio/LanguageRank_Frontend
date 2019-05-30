import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./classMember.scss";
import myApi from "../../service/api";
import { getLoginInfo } from "../../utils/getlocalInfo";
import cutStr from "../../utils/cutStr";
let myUserId;
class ClassFriend extends Component {
  constructor() {
    super();
    this.state = {
      friends: []
    };
  }
  componentDidMount() {
    myUserId = getLoginInfo().userId;
    const { clazzId } = this.props;
    if (clazzId) {
      this.getFriend();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.clazzId !== prevProps.clazzId) {
      this.getFriend();
    } else if (this.props.isAdded != prevProps.isAdded) {
      if (prevProps.isAdded != -1) {
        this.getFriend();
      }
    } else if (
      this.props.isPunched != prevProps.isPunched &&
      this.props.isPunched != 0
    ) {
      if (prevProps.isPunched != -1) {
        this.getFriend();
      }
    }
  }
  getFriend = () => {
    const { clazzId } = this.props;
    const data = {
      userId: myUserId,
      clazzId
    };
    myApi("/getspecialclazzmember", "POST", data).then(res => {
      this.setState({
        friends: res.data
      });
    });
  };
  render() {
    const { friends } = this.state;
    return (
      <View className="member-list">
        {friends.length === 0 && (
          <View className="no-friend-note">当前班级中暂无您的好友</View>
        )}
        {friends.map((item, index) => (
          <View className="member-item" key={item.userId}>
            <View className="rank">{index + 1}</View>
            <View className="avatar-wrap">
              <Image className="avatar" src={item.avatarUrl} />
            </View>
            <View className="name">{cutStr(item.nickName)}</View>
            <View className="total">
              连续打卡{item.uninterruptedStudyPlanDay}天
            </View>
          </View>
        ))}
      </View>
    );
  }
}
ClassFriend.defaultProps = {
  clazzId: ""
};
export default ClassFriend;

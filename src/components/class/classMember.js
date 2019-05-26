import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtPagination } from "taro-ui";
import "./classMember.scss";
import myApi from "../../service/api";
import { getLoginInfo } from "../../utils/getlocalInfo";
let myUserId;
class ClassMember extends Component {
  constructor() {
    super();
    this.state = {
      members: [],
      total: 0,
      friends: [],
      pageSize: 20,
      pageIndex: 1
    };
  }
  componentDidMount() {
    myUserId = getLoginInfo().userId;
  }
  componentDidUpdate(prevProps) {
    const { type } = this.props;
    if (this.props.clazzId !== prevProps.clazzId) {
      if (type == "class") {
        this.getClassMember();
      } else {
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
  getClassMember = (pageIndex = 1) => {
    const { clazzId } = this.props;
    const data = {
      userId: myUserId,
      clazzId,
      pageIndex
    };
    myApi("/getclazzmember", "POST", data).then(res => {
      if (res.code === 0) {
        this.setState({
          members: res.data.members,
          total: res.data.total,
          pageSize: res.data.pageSize,
          pageIndex: res.data.pageIndex
        });
      }
    });
  };
  changeMemberPage = params => {
    this.getClassMember(params.current);
  };
  render() {
    const { members, total, friends, pageSize, pageIndex } = this.state;
    const { type } = this.props;
    return (
      <View>
        {type === "class" ? (
          <View className="member-list">
            {members.map((item, index) => (
              <View className="member-item" key={item.userId}>
                <View className="rank">
                  {(pageIndex - 1) * pageSize + index + 1}
                </View>
                <View className="avatar-wrap">
                  <Image className="avatar" src={item.avatarUrl} />
                </View>
                <View className="name">{item.nickName}</View>
                <View className="total">
                  连续打卡{item.uninterruptedStudyPlanDay}天
                </View>
              </View>
            ))}
            <AtPagination
              icon
              total={total}
              pageSize={pageSize}
              onPageChange={this.changeMemberPage}
            />
          </View>
        ) : (
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
                <View className="name">{item.nickName}</View>
                <View className="total">
                  连续打卡{item.uninterruptedStudyPlanDay}天
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }
}
ClassMember.defaultProps = {
  clazzId: "",
  type: ""
};
export default ClassMember;

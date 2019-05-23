import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtPagination } from "taro-ui";
import "./classMember.scss";
import myApi from "../../service/api";
import { getLoginInfo } from "../../utils/getlocalInfo";
const myUserId = getLoginInfo().userId;
class ClassMember extends Component {
  constructor() {
    super();
    this.state = {
      members: [],
      total: 0
    };
  }
  componentDidMount() {
    this.getClassMember();
  }
  componentDidUpdate(prevProps) {
    if (this.props.clazzId !== prevProps.clazzId) {
      this.getClassMember();
    }
  }
  getClassMember = (pageIndex = 1) => {
    console.log("this.props", this.props);
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
          total: res.data.total
        });
      }
    });
  };
  changeMemberPage = params => {
    this.getClassMember(params.current);
  };
  render() {
    const { members, total } = this.state;
    return (
      <View className="member-list">
        <View className="member-item">
          <View className="rank title">排名</View>
          <View className="avatar-wrap title" />
          <View className="name title">用户</View>
          <View className="total title">打卡天数</View>
        </View>
        {members.map((item, index) => (
          <View className="member-item" key={item.userId}>
            <View className="rank">{index + 1}</View>
            <View className="avatar-wrap">
              <Image className="avatar" src={item.avatarUrl} />
            </View>
            <View className="name">{item.nickName}</View>
            <View className="total">{item.uninterruptedStudyPlanDay}</View>
          </View>
        ))}
        <AtPagination
          icon
          total={total}
          pageSize={20}
          onPageChange={this.changeCmtPage}
        />
      </View>
    );
  }
}
ClassMember.defaultProps = {
  clazzId: ""
};
export default ClassMember;

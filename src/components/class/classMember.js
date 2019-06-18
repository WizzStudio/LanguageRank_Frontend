import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtPagination } from "taro-ui";
import "./classMember.scss";
import myApi from "../../service/api";
import cutStr from "../../utils/cutStr";
import { getLoginInfo } from "../../utils/getlocalInfo";
let myUserId;
class ClassMember extends Component {
  constructor() {
    super();
    this.state = {
      members: [],
      total: 0,
      pageSize: 20,
      pageIndex: 1
    };
  }
  componentDidMount() {
    myUserId = getLoginInfo().userId;
    const { clazzId } = this.props;
    if (clazzId) {
      this.getClassMember();
    }
  }
  shouldComponentUpdate(nextProps) {}
  componentDidUpdate(prevProps) {
    if (this.props.clazzId !== prevProps.clazzId) {
      this.getClassMember();
    } else if (this.props.isAdded != prevProps.isAdded) {
      if (prevProps.isAdded != -1) {
        this.getClassMember();
      }
    } else if (
      this.props.isPunched != prevProps.isPunched &&
      this.props.isPunched != 0
    ) {
      if (prevProps.isPunched != -1) {
        this.getClassMember();
      }
    }
  }
  getClassMember = async (pageIndex = 1) => {
    const { clazzId } = this.props;
    const data = {
      userId: myUserId,
      clazzId,
      pageIndex
    };
    const res = await myApi("/getclazzmember", "POST", data);
    if (res.code === 0) {
      this.setState({
        members: res.data.members,
        total: res.data.total,
        pageSize: res.data.pageSize,
        pageIndex: res.data.pageIndex
      });
    }
    return res;
  };
  changeMemberPage = params => {
    this.getClassMember(params.current).then(() => {
      Taro.pageScrollTo({
        scrollTop: 500,
        duration: 0
      });
    });
  };
  render() {
    const { members, total, pageSize, pageIndex } = this.state;
    return (
      <View className="member-list">
        {members.map((item, index) => (
          <View className="member-item" key={item.userId}>
            <View className="rank">
              {(pageIndex - 1) * pageSize + index + 1}
            </View>
            <View className="avatar-wrap">
              <Image className="avatar" src={item.avatarUrl} />
            </View>
            <View className="name">{cutStr(item.nickName)}</View>
            <View className="total">
              连续打卡{item.uninterruptedStudyPlanDay}天
            </View>
          </View>
        ))}
        <AtPagination
          icon
          total={total}
          pageSize={pageSize}
          current={pageIndex}
          onPageChange={this.changeMemberPage}
        />
      </View>
    );
  }
}
ClassMember.defaultProps = {
  clazzId: "",
  isAdded: false,
  isPunched: false
};
export default ClassMember;

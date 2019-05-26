import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtSegmentedControl, AtNoticebar } from "taro-ui";
import AuthRankList from "../rank/authRankList";
import DemandRankList from "../rank/demandRankList";
import Notice from "../../components/rank/notice";
import "./index.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
import checkToLogin from "../../utils/checkToLogin";
import { getLoginInfo } from "../../utils/getlocalInfo";
let myUserId;
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserAllInfo(id) {
      return dispatch(ajaxGetUserAllInfo(id));
    }
  })
)
class Index extends Component {
  config = {
    navigationBarTitleText: "HelloWorld Rank"
  };
  constructor() {
    super();
    this.state = {
      current: 0,
      basicInfo: {},
      isViewedJoinMyApplet: false
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const params = this.$router.params || {};
    console.log("this.$router", this.$router);
    if (params && params.shareId) {
      checkToLogin(params.shareId);
    } else {
      checkToLogin();
    }
    myUserId = getLoginInfo().userId;
  }
  handleClick(value) {
    this.setState({
      current: value
    });
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage = res => {
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: `/pages/index/index?shareId=${myUserId}`
    };
  };
  render() {
    const { isViewedJoinMyApplet } = this.state;
    return (
      <View className="top-bg">
        <View className="blank" />
        <View className="wrap">
          {isViewedJoinMyApplet && <Notice />}
          {/* <Notice /> */}
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
              <AuthRankList isViewed={this.state.isViewedStudyPlan} />
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

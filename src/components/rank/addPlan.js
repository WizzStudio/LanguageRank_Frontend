import Taro, { Component } from "@tarojs/taro";
import { View, CoverView, CoverImage } from "@tarojs/components";
import { AtButton } from "taro-ui";
import "./addPlan.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
import shareimg from "../../assets/icon/share2.png";
import addPlanimg from "../../assets/icon/addPlan.png";
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserAllInfo(data) {
      dispatch(ajaxGetUserAllInfo(data));
    }
  })
)
export default class AuthItem extends Component {
  constructor() {
    super();
    this.state = {
      lang: "",
      isShared: false,
      isStudying: false
    };
  }
  componentWillMount() {
    this.setState({
      lang: this.props.langName
    });
    const loginInfo = Taro.getStorageSync("login");
    if (Taro.getStorageSync("allInfo")) {
    } else {
      this.props.ajaxGetUserAllInfo(loginInfo.userid);
    }
  }
  componentWillReceiveProps(nextprops) {
    if (
      nextprops &&
      this.props.langName == nextprops.userInfo.allInfo.myLanguage
    ) {
      this.setState({
        isStudying: true
      });
    }
  }
  tryAddPlan = () => {
    let allInfo;
    if (Taro.getStorageSync("allInfo")) {
      allInfo = Taro.getStorageSync("allInfo");
    } else {
      allInfo = this.props.userInfo.allInfo;
    }
    if (!Taro.getStorageSync("basicInfo")) {
      Taro.switchTab({
        url: "/pages/amount/myInfo"
      });
      Taro.showToast({
        title: "请先进行登陆哦",
        icon: "none"
      });
    } else {
      if (allInfo.myLanguage) {
        Taro.showModal({
          title: "提示",
          content:
            "领取新的奖励会导致之前的领取计划进度中断，建议您按计划领取完当前奖励再来哦",
          confirmText: "继续添加",
          confirmColor: "#4f5fc5",
          success: res => {
            if (res.confirm) {
              this.addPlan();
            } else if (res.cancel) {
            }
          }
        });
      } else {
        this.addPlan();
      }
    }
  };
  addPlan = () => {
    const loginInfo = Taro.getStorageSync("login");
    Taro.request({
      url: "https://pgrk.wizzstudio.com/updatelanguage",
      method: "POST",
      data: {
        languageName: this.props.langName,
        userId: loginInfo.userid
      }
    }).then(response => {
      const res = response.data;
      if (res.code === 0) {
        this.setState({
          isStudying: true
        });
        Taro.navigateTo({
          url: "/pages/amount/dailyPlan"
        });
        Taro.showToast({
          title: "加入成功"
        });
      } else if (res.code === 2) {
        Taro.showToast({
          title: "该语言奖励礼包正在火速赶来，先试试其他语言吧",
          icon: "none"
        });
      } else if (res.code === 3) {
        Taro.showToast({
          title: "你已经在学习该语言了~",
          icon: "none"
        });
      } else {
        Taro.showToast({
          title: "加入失败，请检查网络环境",
          icon: "none"
        });
      }
    });
  };
  cancelPlan = () => {};
  showCanvas = () => {
    // this.setState({
    //   isShared: true
    // });
    this.props.onHandleCanvas();
  };
  closeCanvas = () => {
    this.setState({
      isShared: false
    });
  };

  render() {
    const { isShared, isStudying } = this.state;
    return (
      <View>
        {isShared ? (
          <View className="share-canvas-wrap">
            <View className="share-bg">
              <View className="share-wrap">
                <ShareCanvasOne
                  rankContent="213"
                  handleClose={this.closeCanvas}
                />
                <View onClick={this.closeCanvas} className="close-canvas">
                  关闭
                </View>
              </View>
            </View>
          </View>
        ) : (
          ""
        )}
        <View>
          <View className="footer-wrap">
            <View className="fix-footer">
              {isStudying ? (
                // <View className="add-plan no-add-plan">正在学习中</View>
                <AtButton disabled circle type="primary" size="small">
                  正在学习中
                </AtButton>
              ) : (
                // <View className="add-plan" onClick={this.tryAddPlan}>
                <AtButton
                  circle
                  type="primary"
                  size="small"
                  onClick={this.tryAddPlan}>
                  进入猿圈
                </AtButton>
                // </View>
              )}

              {/* <View className="cl-share">
                <button open-type="share" className="share-button">
                  <View className="share-button-next">
                    <Image src={shareimg} className="img" />
                    <View className="share-title">分享给好友</View>
                  </View>
                </button>
              </View> */}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

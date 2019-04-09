import Taro, { Component } from "@tarojs/taro";
import { View, CoverView, CoverImage } from "@tarojs/components";
import "./addPlan.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
import shareimg from "../../assets/icon/share.png";
import saveimg from "../../assets/icon/saveimg.png";
// import ShareCanvasAuth from "../../components/rank/shareCanvasAuth";
import ShareCanvasDemand from "../../components/rank/shareCanvasDemand";

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
  componentDidMount() {
    this.setState({
      lang: this.props.langName
    });
    const loginInfo = Taro.getStorageSync("login");
    this.props.ajaxGetUserAllInfo(loginInfo.userid);
  }
  componentWillReceiveProps(nextprops) {
    console.log("nextprops", nextprops);
    if (
      nextprops &&
      this.props.langName == nextprops.userInfo.allInfo.myLanguage
    ) {
      console.log(
        "object",
        this.props.langName,
        nextprops.userInfo.allInfo.myLanguage
      );
      this.setState({
        isStudying: true
      });
    }
  }
  tryAddPlan = () => {
    const { allInfo } = this.props.userInfo;

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
          title: "该语言奖励礼包正在在火速赶来，先试试其他语言吧",
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
    this.setState({
      isShared: true
    });
  };
  closeCanvas = () => {
    this.setState({
      isShared: false
    });
  };
  render() {
    const { isShared, isStudying } = this.state;
    console.log("this.isS", isStudying);
    return (
      <View>
        {isShared ? (
          <View className="share-canvas-wrap">
            <View className="share-bg">
              <View className="share-wrap">
                <ShareCanvasDemand
                  rankContent="213"
                  handleClose={this.closeCanvas}
                />
                {/* <AtButton onClick={this.closeCanvas}>关闭</AtButton> */}
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
                <View className="add-plan no-add-plan">正在学习中</View>
              ) : (
                <View className="add-plan" onClick={this.tryAddPlan}>
                  学习领奖励
                </View>
              )}

              <View className="cl-share">
                <button open-type="share" className="share-button">
                  <View className="share-button-next">
                    <Image src={shareimg} className="img" />
                    <View className="share-title">分享</View>
                  </View>
                </button>
              </View>

              <View className="ge-img" onClick={this.showCanvas}>
                <Image src={saveimg} className="img" />
                <View className="save-title">生成图片</View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

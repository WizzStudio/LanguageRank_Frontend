import Taro, { Component } from "@tarojs/taro";
import { View, CoverView, CoverImage } from "@tarojs/components";
import "./addPlan.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
import shareimg from "../../assets/icon/share.png";
import saveimg from "../../assets/icon/saveimg.png";
import ShareCanvasAuth from "../../components/rank/shareCanvasAuth";

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
      isShared: false
    };
  }
  componentDidMount() {
    this.setState({
      lang: this.props.langName
    });
    const loginInfo = Taro.getStorageSync("login");
    this.props.ajaxGetUserAllInfo(loginInfo.userid);
  }
  tryAddPlan = () => {
    const { allInfo } = this.props.userInfo;
    console.log("allInfo", allInfo);
    if (allInfo.myLanguage) {
      Taro.showModal({
        title: "提示",
        content: "继续添加将覆盖之前的学习记录，确定添加吗？",
        confirmText: "继续添加",
        confirmColor: "#4f5fc5",
        success: res => {
          if (res.confirm) {
            this.addPlan();
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    } else {
      this.addPlan();
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
        Taro.showToast({
          title: "加入成功"
        });
      } else {
        Taro.showToast({
          title: "加入失败，请检查网络环境"
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
    const { isShared } = this.state;
    return (
      <View>
        {isShared ? (
          <View className="share-canvas-wrap">
            <View className="share-bg">
              <View className="share-wrap">
                <ShareCanvasAuth
                  rankContent="213"
                  handleClose={this.closeCanvas}
                />
                <AtButton onClick={this.closeCanvas}>关闭</AtButton>
              </View>
            </View>
          </View>
        ) : (
          ""
        )}
        <View>
          <View className="footer-wrap">
            <View className="fix-footer">
              <View className="add-plan" onClick={this.tryAddPlan}>
                加入学习计划
              </View>
              <View className="cl-share">
                <button open-type="share" className="share-button">
                  <View className="share-button-next">
                    <Image src={shareimg} className="img" />
                    <View className="share-title">分享</View>
                  </View>
                </button>
              </View>

              <View className="ge-img">
                <Image src={saveimg} className="img" />
                <View className="save-title" onClick={this.showCanvas}>
                  生成图片
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View, CoverView, CoverImage } from "@tarojs/components";
import "./addPlan.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
import share from "../../assets/icon/share.png";
import saveimg from "../../assets/icon/saveimg.png";
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
      lang: ""
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
  render() {
    return (
      <View>
        <CoverView>
          <CoverView className="footer-wrap">
            <CoverView className="fix-footer">
              <CoverView className="add-plan" onClick={this.tryAddPlan}>
                加入学习计划
              </CoverView>
              <CoverView className="share">
                <button open-type="share" className="share">
                  <CoverImage src={share} className="img" />
                  <CoverView className="share-title">分享</CoverView>
                </button>
              </CoverView>
              <CoverView className="ge-img">
                <CoverImage src={saveimg} className="img" />
                <CoverView className="save-title">生成图片</CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        </CoverView>
      </View>
    );
  }
}

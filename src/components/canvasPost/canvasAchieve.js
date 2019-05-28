import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { TaroCanvasDrawer } from "taro-plugin-canvas"; // npm 引入方式
import load from "../../assets/img/load.png";
import "./canvasPost.scss";
const canvasAchieveImg =
  "https://pgrk.wizzstudio.com/image/achievementCard.jpg";
const canvasHomeImg = "https://pgrk.wizzstudio.com/image/invitationCard.jpg";
class CanvasAchieve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 绘图配置文件
      isShow: false,
      config: null,
      styleRes: {
        transform: "scale(0)"
      },
      // 绘制的图片
      shareImage: null,
      // TaroCanvasDrawer 组件状态
      canvasStatus: false,
      rssConfig: {
        width: 650,
        height: 1000,
        backgroundColor: "#EDEDED",
        debug: true,
        blocks: [],
        texts: [],
        images: [
          {
            url: props.type === "home" ? canvasHomeImg : canvasAchieveImg,
            width: 650,
            height: 1000,
            opacity: 1,
            y: 0,
            x: 0,
            borderRadius: 12,
            zIndex: 1
            // borderRadius: 150
            // borderWidth: 10,
            // borderColor: 'red',
          }
        ],
        lines: [
          {
            startY: 540,
            startX: 80,
            endX: 670,
            endY: 541,
            width: 1,
            color: "#eee"
          }
        ]
      }
    };
  }
  componentWillMount() {
    const designWidth = 375;
    const designHeight = 603; // 这是在顶部位置定义，底部无tabbar情况下的设计稿高度

    // 以iphone6为设计稿，计算相应的缩放比例
    const { windowWidth, windowHeight } = Taro.getSystemInfoSync();
    const responsiveScale =
      windowHeight / ((windowWidth / designWidth) * designHeight);
    if (responsiveScale < 1) {
      this.setState({
        styleRes: {
          transform: `scale(${responsiveScale * 0.8})`
        }
      });
    } else {
      this.setState({
        styleRes: {
          transform: "scale(1)"
        }
      });
    }
  }
  componentDidMount() {
    this.canvasDrawFunc();
  }

  // 调用绘画 => canvasStatus 置为true、同时设置config
  canvasDrawFunc = (config = this.state.rssConfig) => {
    const { nickName, avatar, dayNum, clazzName, type } = this.props;
    if (type == "home") {
      config.images.push({
        url: avatar,
        width: 140,
        height: 140,
        x: 100,
        y: 120,
        zIndex: 99,
        opacity: 1,
        borderRadius: 20,
        color: "#000"
      });
      config.texts.push({
        x: 400,
        y: 150,
        text: nickName,
        fontSize: 30,
        color: "#000",
        opacity: 1,
        baseLine: "middle",
        lineHeight: 48,
        lineNum: 2,
        textAlign: "center",
        width: 580,
        zIndex: 999
      });
      config.texts.push({
        x: 400,
        y: 200,
        text: "邀请你加入",
        fontSize: 30,
        color: "#000",
        opacity: 1,
        baseLine: "middle",
        lineHeight: 48,
        lineNum: 2,
        textAlign: "center",
        width: 580,
        zIndex: 999
      });
      config.texts.push({
        x: 350,
        y: 340,
        text: clazzName,
        fontSize: 50,
        color: "#000",
        opacity: 1,
        baseLine: "middle",
        lineHeight: 48,
        lineNum: 2,
        textAlign: "center",
        width: 480,
        zIndex: 999,
        fontWeight: "bold"
      });
    } else {
      config.images.push({
        url: avatar,
        width: 150,
        height: 150,
        color: "#000",
        x: 260,
        y: 100,
        zIndex: 99,
        opacity: 1,
        borderRadius: 20
      });
      config.texts.push({
        x: 335,
        y: 320,
        text: nickName,
        fontSize: 30,
        color: "#000",
        opacity: 1,
        baseLine: "middle",
        lineHeight: 48,
        lineNum: 2,
        textAlign: "center",
        width: 580,
        zIndex: 999
      });
      config.texts.push({
        x: 335,
        y: 400,
        text: "已打卡" + dayNum + "天",
        fontSize: 40,
        color: "#000",
        opacity: 1,
        fontWeight: "bold",
        baseLine: "middle",
        lineHeight: 48,
        lineNum: 2,
        textAlign: "center",
        width: 580,
        zIndex: 999
      });
    }

    this.setState({
      canvasStatus: true,
      config: config
    });
    Taro.showLoading({
      title: "绘制中..."
    });
  };
  // 绘制成功回调函数 （必须实现）=> 接收绘制结果、重置 TaroCanvasDrawer 状态
  onCreateSuccess = result => {
    const { tempFilePath, errMsg } = result;

    if (errMsg === "canvasToTempFilePath:ok") {
      this.setState({
        isShow: true,
        shareImage: tempFilePath,
        // 重置 TaroCanvasDrawer 状态，方便下一次调用
        canvasStatus: false,
        config: null
      });
    } else {
      // 重置 TaroCanvasDrawer 状态，方便下一次调用
      this.setState({
        canvasStatus: false,
        config: null
      });
      Taro.showToast({ icon: "none", title: errMsg || "出现错误" });
      console.log(errMsg);
    }
    Taro.hideLoading();
  };

  // 绘制失败回调函数 （必须实现）=> 接收绘制错误信息、重置 TaroCanvasDrawer 状态
  onCreateFail = error => {
    Taro.hideLoading();
    // 重置 TaroCanvasDrawer 状态，方便下一次调用
    this.setState({
      canvasStatus: false,
      config: null
    });
    console.log(error);
  };

  // 保存图片至本地
  saveToAlbum = () => {
    console.log("this.state", this.state);
    let res;
    res = Taro.saveImageToPhotosAlbum({
      filePath: this.state.shareImage
    });
    if (res.errMsg === "saveImageToPhotosAlbum:ok") {
      Taro.showToast({
        title: "保存图片成功",
        icon: "success",
        duration: 2000
      });
    } else {
      res = Taro.saveImageToPhotosAlbum({
        filePath: this.state.shareImage
      });
    }
  };
  closeCanvas = () => {
    // this.props.closeCanvas();
  };
  render() {
    const { styleRes } = this.state;
    return (
      <View style={styleRes}>
        {this.state.shareImage ? (
          <View>
            <View className="share-canvas">
              <Image src={this.state.shareImage} mode="widthFix" lazy-load />
            </View>
            <View className="canvas-button">
              <View className="share-out">
                <AtButton
                  className="per-canvas-button"
                  type="secondary"
                  openType="share">
                  分享给好友
                </AtButton>
              </View>
              <View className="save-img">
                <AtButton
                  className="per-canvas-button"
                  type="primary"
                  onClick={this.saveToAlbum}>
                  保存图片分享
                </AtButton>
              </View>
            </View>
          </View>
        ) : (
          <View className="load-img-wrap">
            <Image className="load-img" src={load} mode="widthFix" lazy-load />
            <View>正在加载...</View>
          </View>
        )}

        {// 由于部分限制，目前组件通过状态的方式来动态加载
        this.state.canvasStatus && (
          <View className="canvas-wrap" style={styleRes}>
            <TaroCanvasDrawer
              config={this.state.config} // 绘制配置
              onCreateSuccess={this.onCreateSuccess} // 绘制成功回调
              onCreateFail={this.onCreateFail} // 绘制失败回调
            />
          </View>
        )}
      </View>
    );
  }
}
CanvasAchieve.defaultProps = {
  nickName: "",
  avatar: "",
  dayNum: 0,
  clazzName: "",
  type: ""
};
export default CanvasAchieve;

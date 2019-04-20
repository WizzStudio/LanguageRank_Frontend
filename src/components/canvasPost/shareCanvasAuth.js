import Taro, { Component } from "@tarojs/taro";
import { View, Button, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { TaroCanvasDrawer } from "taro-plugin-canvas"; // npm 引入方式

import canvasAuth from "../../assets/img/canvasAuth.png";
import load from "../../assets/img/load.png";
import { connect } from "@tarojs/redux";
import { ajaxGetAuth } from "../../actions/rankList";
import "./canvasPost.scss";
@connect(
  ({ rankList }) => ({
    rankList
  }),
  dispatch => ({
    ajaxGetAuth() {
      dispatch(ajaxGetAuth());
    }
  })
)
export default class ShareCanvasAuth extends Component {
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
        width: 750,
        height: 400,
        backgroundColor: "#ccc",
        debug: true,
        blocks: [
          {
            x: 0,
            y: 0,
            width: 750,
            height: 400,
            paddingLeft: 0,
            paddingRight: 0,
            borderWidth: 0,
            // borderColor: '#ccc',
            // backgroundColor: "#ccc",
            borderRadius: 0
          }
        ],
        texts: [],
        images: [
          {
            url: canvasAuth,
            width: 750,
            height: 1000,
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
    console.log("改变之前");

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
    this.props.ajaxGetAuth();
    this.canvasDrawFunc();
  }

  // 调用绘画 => canvasStatus 置为true、同时设置config
  canvasDrawFunc = (config = this.state.rssConfig) => {
    const { authRank } = this.props.rankList;
    authRank.map((rank, index) => {
      if (index <= 4) {
        config.texts.push({
          x: 230,
          y: 330 + index * 100,
          text: rank.languageName,
          fontSize: 40,
          color: "#fff",
          opacity: 1,
          baseLine: "middle",
          lineHeight: 48,
          lineNum: 2,
          textAlign: "left",
          width: 580,
          zIndex: 999
        });
        config.texts.push({
          x: 510,
          y: 330 + index * 100,
          text: rank.fixedFinalExponent,
          fontSize: 40,
          color: "#fff",
          opacity: 1,
          baseLine: "middle",
          lineHeight: 48,
          lineNum: 2,
          textAlign: "left",
          width: 580,
          zIndex: 999
        });
      }
    });
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
    //预览;
    // Taro.previewImage({
    //   current: tempFilePath,
    //   urls: [tempFilePath]
    // });

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
    // debugger;
    return (
      <View style={styleRes}>
        {/* {this.state.isShow ? (
            // Taro.hideLoading()
            <Image src={this.state.shareImage} mode="widthFix" lazy-load />
          ) : (
            Taro.hideLoading()
          )} */}
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

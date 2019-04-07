import Taro, { Component } from "@tarojs/taro";
import { View, Button, Image } from "@tarojs/components";
import { TaroCanvasDrawer } from "taro-plugin-canvas"; // npm 引入方式

import canvasBg from "../../assets/img/canvas-bg.png";
import { connect } from "@tarojs/redux";
import { ajaxGetAuth } from "../../actions/rankList";
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
      config: null,
      // 绘制的图片
      shareImage: null,
      // TaroCanvasDrawer 组件状态
      canvasStatus: false,
      rssConfig: {
        width: 750,
        height: 400,
        backgroundColor: "red",
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
          // {
          //   x: 40,
          //   y: 40,
          //   width: 670,
          //   height: 670,
          //   paddingLeft: 0,
          //   paddingRight: 0,
          //   borderWidth: 0,
          //   // borderColor: '#ccc',
          //   backgroundColor: "blue",
          //   borderRadius: 12
          // }
        ],
        texts: [
          // {
          //   x: 80,
          //   y: 590,
          //   text: "长按扫描二维码阅读完整内容",
          //   fontSize: 24,
          //   color: "#666",
          //   opacity: 1,
          //   baseLine: "middle",
          //   textAlign: "left",
          //   lineHeight: 36,
          //   lineNum: 1,
          //   zIndex: 999
          // },
          // {
          //   x: 80,
          //   y: 640,
          //   text: "分享来自 「 RssFeed 」",
          //   fontSize: 24,
          //   color: "#666",
          //   opacity: 1,
          //   baseLine: "middle",
          //   textAlign: "left",
          //   lineHeight: 36,
          //   lineNum: 1,
          //   zIndex: 999
          // }
        ],
        images: [
          {
            url: canvasBg,
            width: 375 * 2,
            // height: 1092 * 2,
            height: 200,
            y: 0,
            x: 0,
            borderRadius: 12,
            zIndex: 1
            // borderRadius: 150
            // borderWidth: 10,
            // borderColor: 'red',
          }
          // {
          //   url: canvasBg,
          //   width: 110,
          //   height: 110,
          //   y: 570,
          //   x: 560,
          //   borderRadius: 100,
          //   borderWidth: 0,
          //   zIndex: 10
          // }
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
  componentDidMount() {
    this.props.ajaxGetAuth();
    this.canvasDrawFunc();
  }

  // 调用绘画 => canvasStatus 置为true、同时设置config
  canvasDrawFunc = (config = this.state.rssConfig) => {
    const test = "hhh";
    const { authRank } = this.props.rankList;
    // authRank.map((rank, index) => {
    //   config.texts.push({
    //     x: 80,
    //     y: 200 + index * 100,
    //     text: rank.languageName,
    //     // text: ranklist.map((item, index) => item.toString()),
    //     fontSize: 32,
    //     color: "#000",
    //     opacity: 1,
    //     baseLine: "middle",
    //     lineHeight: 48,
    //     lineNum: 2,
    //     textAlign: "left",
    //     width: 580,
    //     zIndex: 999
    //   });
    // });

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
    console.log("result", result);
    const { tempFilePath, errMsg } = result;
    Taro.hideLoading();
    if (errMsg === "canvasToTempFilePath:ok") {
      this.setState({
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
    const res = Taro.saveImageToPhotosAlbum({
      filePath: this.state.shareImage
    });
    if (res.errMsg === "saveImageToPhotosAlbum:ok") {
      Taro.showToast({
        title: "保存图片成功",
        icon: "success",
        duration: 2000
      });
    }
  };
  closeCanvas = () => {
    // this.props.closeCanvas();
  };
  render() {
    console.log("this.props", this.props);
    return (
      <View>
        <View className="share-canvas">
          <Image src={this.state.shareImage} mode="widthFix" lazy-load />
          {// 由于部分限制，目前组件通过状态的方式来动态加载
          this.state.canvasStatus && (
            <TaroCanvasDrawer
              config={this.state.config} // 绘制配置
              onCreateSuccess={this.onCreateSuccess} // 绘制成功回调
              onCreateFail={this.onCreateFail} // 绘制失败回调
            />
          )}
        </View>
        <View>
          <View>
            <Button onClick={this.saveToAlbum}>保存到相册</Button>
          </View>
          <View>
            <Button onClick={this.closeCanvas}>保存到相册</Button>
          </View>
        </View>
      </View>
    );
  }
}

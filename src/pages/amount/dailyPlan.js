import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import { AtActivityIndicator, AtMessage, AtIcon } from "taro-ui";
import { connect } from "@tarojs/redux";
import { ajaxGetUserClassPlan } from "../../actions/classInfo";
import { getLoginInfo } from "../../utils/getlocalInfo";
import myApi from "../../service/api";
import "./dailyPlan.scss";
import "./attention.scss";
const myUserId = getLoginInfo().userId;
@connect(
  ({ classInfo }) => ({
    classInfo
  }),
  dispatch => ({
    ajaxGetUserClassPlan(data) {
      return dispatch(ajaxGetUserClassPlan(data));
    }
  })
)
class DailyPlan extends Component {
  constructor() {
    super();
    this.state = {
      current: 0,
      isLoading: true
    };
  }
  componentDidMount() {
    this.getUserPlan();
  }
  getUserPlan = () => {
    const clazzId = this.props.clazzId;
    const data = {
      userId: myUserId,
      clazzId
    };
    this.props.ajaxGetUserClassPlan(data).then(res => {
      if (res.code === 0) {
        this.setState({
          isLoading: false,
          current: this.props.classInfo.userClassPlan.length - 1
        });
      }
    });
  };
  handleSwiper = e => {
    this.setState({
      current: e.detail.current
    });
  };
  changeSwiper = type => {
    const { current } = this.state;
    switch (type) {
      case "left":
        this.setState({
          current: current - 1
        });
        break;
      case "right":
        this.setState({
          current: current + 1
        });
        break;
      default:
        break;
    }
  };
  showSheet = item => {
    Taro.showActionSheet({
      itemList: ["复制", "收藏"],
      itemColor: "#4f5fc5"
    }).then(res => {
      console.log("res", res);
      if (res.tapIndex === 0) {
        this.copyContent(item.link + "提取码：" + item.extractedCode);
      } else if (res.tapIndex === 1) {
        this.collectPlan(item);
      }
    });
  };
  collectPlan = item => {
    const { clazzId, className } = this.props;
    const data = {
      userId: myUserId,
      clazzId,
      studyPlanDay: item.studyPlanDay,
      clazzName: className
    };
    myApi("/collect", "POST", data).then(res => {
      if (res.code === 0) {
        Taro.atMessage({
          message: "收藏成功",
          type: "success"
        });
      } else if (res.code === 9) {
        Taro.atMessage({
          message: "你已经收藏过了",
          type: "warning"
        });
      }
    });
  };
  copyContent = content => {
    Taro.setClipboardData({
      data: content
    })
      .then(() => {
        Taro.showToast({
          title: "复制成功"
        });
      })
      .catch(() => {
        Taro.showToast({
          title: "复制失败"
        });
      });
  };
  render() {
    const { current, isLoading } = this.state;
    const { userClassPlan } = this.props.classInfo || [];
    return (
      <View>
        <AtMessage />
        <View className="main-plan">
          <View className="plan-content">
            {isLoading ? (
              <View className="loading-wrap">
                <AtActivityIndicator
                  content="正在为你加载学习内容..."
                  size={40}
                />
              </View>
            ) : (
              <Swiper
                indicatorColor="#999"
                indicatorActiveColor="#4f5fc5"
                // previousMargin="35px"
                // nextMargin="35px"
                current={current}
                onChange={this.handleSwiper}
                indicatorDots>
                {userClassPlan.map((item, index) => {
                  return (
                    <SwiperItem
                      className="swiper-wrap"
                      key={item.studyPlanDay}
                      index={index}>
                      <View className="arror">
                        {current === 0 ? (
                          <AtIcon value="chevron-left" size="30" color="#999" />
                        ) : (
                          <AtIcon
                            value="chevron-left"
                            size="30"
                            color="#4f5fc5"
                            onClick={this.changeSwiper.bind(this, "left")}
                          />
                        )}
                      </View>

                      <View className="content">
                        <View className="plan-title">
                          第{item.studyPlanDay}天
                        </View>
                        <View
                          className="content-wrap"
                          onClick={this.showSheet.bind(this, item)}>
                          <View className="brief">
                            {item.briefIntroduction}
                          </View>
                          <View className="content">{item.content}</View>
                          <View className="codeStr">
                            提取码：{item.extractedCode}
                          </View>
                          <View className="text-copy">
                            (点击复制链接，浏览器打开)
                          </View>
                        </View>
                      </View>

                      <View className="arror">
                        {current + 1 === userClassPlan.length ? (
                          <AtIcon
                            value="chevron-right"
                            size="30"
                            color="#999"
                          />
                        ) : (
                          <AtIcon
                            onClick={this.changeSwiper.bind(this, "right")}
                            value="chevron-right"
                            size="30"
                            color="#4f5fc5"
                          />
                        )}
                      </View>
                    </SwiperItem>
                  );
                })}
              </Swiper>
            )}
          </View>
        </View>
      </View>
    );
  }
}
DailyPlan.defaultProps = {
  className: "",
  clazzId: 0
};
export default DailyPlan;

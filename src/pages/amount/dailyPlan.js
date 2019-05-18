import Taro, { Component, getStorageSync } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import { AtCard, AtButton, AtActivityIndicator, AtIcon } from "taro-ui";
import "./dailyPlan.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserClassPlan } from "../../actions/classInfo";
import { getLoginInfo } from "../../utils/getlocalInfo";
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
export default class DailyPlan extends Component {
  constructor() {
    super();
    this.state = {
      current: 0,
      isLoading: true,
      allPlan: []
    };
  }
  componentDidMount() {
    this.getUserPlan();
  }
  getUserPlan = () => {
    const userId = getLoginInfo().userId;
    const clazzId = this.props.clazzId;
    const data = {
      userId,
      clazzId
    };
    this.props.ajaxGetUserClassPlan(data).then(res => {
      if (res.code === 0) {
        this.setState({
          isLoading: false
        });
      }
    });
  };

  handleSwiper = e => {
    this.setState({
      current: e.detail.current
    });
  };
  preview = url => {
    Taro.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    });
  };
  render() {
    const { current, isLoading } = this.state;
    const { userClassPlan } = this.props.classInfo || [];
    return (
      <View>
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
                className="swiper"
                indicatorColor="#999"
                indicatorActiveColor="#333"
                previousMargin="50px"
                nextMargin="50px"
                current={current}
                onChange={this.handleSwiper}
                indicatorDots>
                {userClassPlan.map((item, index) => {
                  return (
                    <SwiperItem key={item.studyPlanDay} index={index}>
                      <View className="plan-title">
                        第 {item.studyPlanDay} 天
                      </View>
                      {item.content}
                    </SwiperItem>
                    // <SwiperItem
                    //   index={index}
                    //   key={index}
                    //   // className={`plan-item ${current === index ? active : ""}`}
                    //   className={[
                    //     "plan-item",
                    //     current === index ? "active" : ""
                    //   ].join(" ")}>
                    //   <View className="plan-title">
                    //     {item.number
                    //       ? this.showPlanDay(item.studyPlanDay) + "(二)"
                    //       : this.showPlanDay(item.studyPlanDay) + "（一）"}
                    //   </View>

                    //   {item.show ? (
                    //     <AtCard
                    //       className="plan-card"
                    //       onClick={this.preview.bind(this, item.image)}>
                    //       {/* <Image className="full-plan" src={item.image} /> */}
                    //       改的资料
                    //     </AtCard>
                    //   ) : (
                    //     <AtCard className=" plan-card ">
                    //       <View className=" cover">
                    //         <View className="no-plan-note">点击下方按钮</View>
                    //         <View className="no-plan-note">
                    //           可领取第二份资料~
                    //         </View>
                    //         <View className="no-plan-note">
                    //           <AtIcon
                    //             value="arrow-down"
                    //             size="49"
                    //             color="#fff"
                    //           />
                    //         </View>
                    //       </View>
                    //     </AtCard>
                    //   )}
                    // </SwiperItem>
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

import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./authItem.scss";
import "taro-ui/dist/style/index.scss";
import up from "../../assets/icon/up.png";
import no from "../../assets/icon/no.png";
import down from "../../assets/icon/down.png";
import cmt from "../../assets/icon/cmt.png";
class AuthItem extends Component {
  toLangIndex = tab => {
    const { type, langName, heatNum, index } = this.props;
    Taro.navigateTo({
      url: `/pages/detail/langIndex?rankIndex=${type}&langName=${encodeURI(
        langName
      )}&exponent=${heatNum}&rankNum=${parseInt(index) + 1}&tab=${tab}`
    });
  };
  render() {
    const { langImg, langName, heatNum, tend, index } = this.props;
    return (
      <View className="authItem">
        <View className="at-row">
          <View
            className="at-col at-col-2 rank-num"
            onClick={this.toLangIndex.bind(this, 0)}>
            {parseInt(index) + 1}
          </View>
          <View
            className="at-col at-col-1 icon-wrap"
            onClick={this.toLangIndex.bind(this, 0)}>
            <Image src={langImg} className="langImg" />
          </View>
          <View
            className="at-col at-col-3 lang-name"
            onClick={this.toLangIndex.bind(this, 0)}>
            {langName}
          </View>
          <View
            className="at-col at-col-1"
            onClick={this.toLangIndex.bind(this, 0)}
          />
          <View
            className="at-col at-col-2 heat-num"
            onClick={this.toLangIndex.bind(this, 0)}>
            {heatNum}
          </View>
          <View
            className="at-col at-col-1 tend-wrap"
            onClick={this.toLangIndex.bind(this, 0)}>
            {tend === 0 && <Image src={no} className="tendlogo" />}
            {tend === 1 && <Image src={up} className="tendlogo" />}
            {tend === 2 && <Image src={down} className="tendlogo" />}
          </View>
          <View
            className="at-col at-col-2 tend-wrap"
            onClick={this.toLangIndex.bind(this, 1)}>
            <Image src={cmt} className="tendlogo" />
          </View>
        </View>
      </View>
    );
  }
}
AuthItem.defaultProps = {
  langImg: "",
  langName: "",
  heatNum: 0,
  tend: 0,
  index: 0,
  type: ""
};
export default AuthItem;

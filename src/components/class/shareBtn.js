import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import shareImg from "../../assets/img/share.png";
import "./shareBtn.scss";
class ShareBtn extends Component {
  render() {
    return (
      <View className="share-wrap">
        <button open-type="share" data-param={this.props.param}>
          <Image className="share-img" src={shareImg} />
        </button>
      </View>
    );
  }
}
ShareBtn.defaultProps = {
  param: ""
};
export default ShareBtn;

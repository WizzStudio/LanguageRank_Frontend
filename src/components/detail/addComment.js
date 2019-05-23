import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtButton, AtMessage } from "taro-ui";
import "./addComment.scss";
import { getLoginInfo } from "../../utils/getlocalInfo";
import myApi from "../../service/api";
const userId = getLoginInfo().userId || "";

class AddComment extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: ""
    };
  }
  handleInputChange = val => {
    this.setState({
      inputValue: val
    });
    return val;
  };
  //检测是否全空 全空返回true
  isBlank = str => {
    if (str == "") {
      return true;
    }
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  };
  updateCmt = () => {
    let comment = this.state.inputValue;
    const checkBlank = this.isBlank(comment);
    if (checkBlank) {
      Taro.atMessage({
        message: "请填写评论",
        type: "warning"
      });
      return;
    }
    const { type, clazzId, langName } = this.props;
    let data = {},
      url = "";
    switch (type) {
      case "class":
        data = {
          clazzId,
          comment,
          userId
        };
        url = "/updateclazzcomment";
        break;
      case "auth":
        data = {
          languageName: langName,
          comment,
          userId
        };
        url = "/updatefixedrankcomment";
        break;
      case "demand":
        data = {
          languageName: langName,
          comment,
          userId
        };
        url = "/updateemployeerankcomment";
      default:
        break;
    }
    myApi(url, "POST", data).then(res => {
      if (res.code === 0) {
        this.setState({
          inputValue: ""
        });
        Taro.atMessage({
          message: "评论成功",
          type: "success"
        });
        this.props.onRefresh();
      }
    });
  };
  render() {
    return (
      <View>
        <AtMessage />
        <View className="input-top" />
        <View className="input-wrap">
          {/* <View className="input"> */}
          <AtInput
            type="text"
            maxLength="999"
            placeholder="我有问题想问"
            value={this.state.inputValue}
            onChange={this.handleInputChange.bind(this)}
          />
          <AtButton type="primary" size="small" onClick={this.updateCmt}>
            提交
          </AtButton>
        </View>
      </View>
    );
  }
}
AddComment.defaultProps = {
  type: "",
  langName: "",
  clazzId: "",
  onRefresh: () => {}
};
export default AddComment;

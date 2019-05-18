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
  componentDidMount() {}
  componentDidUpdate(prevprops) {}
  handleInputChange = val => {
    this.setState({
      inputValue: val
    });
    return val;
  };
  updateCmt = () => {
    const comment = this.state.inputValue;
    const { type, clazzId, langName } = this.props;
    console.log("inputValue", this.state);
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
        myApi(url, "POST", data).then(res => {
          if (res.code === 0) {
            this.setState({
              inputValue: ""
            });
            Taro.atMessage({
              message: "评论成功",
              type: "success"
            });
          }
        });
        break;
      case "auth":
        data = {
          languageName: langName,
          comment,
          userId
        };
        url = "/updatefixedrankcomment";
        myApi(url, "POST", data).then(res => {
          if (res.code === 0) {
            this.setState({
              inputValue: ""
            });
            Taro.atMessage({
              message: "评论成功",
              type: "success"
            });
            console.log("this.props", this.props);
            this.props.onRefresh();
          }
        });
        break;
      case "demand":
        data = {
          languageName: langName,
          comment,
          userId
        };
        url = "/updateemployeerankcomment";
        myApi(url, "POST", data).then(res => {
          if (res.code === 0) {
            this.setState({
              inputValue: ""
            });
            Taro.atMessage({
              message: "评论成功",
              type: "success"
            });
          }
        });
      default:
        break;
    }
  };
  render() {
    this.props.onRefresh();
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
  onRefresh: () => {
    console.log("还在初始化");
  }
};
export default AddComment;

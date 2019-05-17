import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtButton } from "taro-ui";
import "./addComment.scss";
export default class AddComment extends Component {
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
  updateCmt = () => {
    const languageName = this.state.langName;
    const comment = this.state.inputValue;
    console.log("inputValue", this.state);
    Taro.request({
      url: "https://pgrk.wizzstudio.com/updateemployeerankcomment",
      method: "POST",
      data: {
        languageName,
        comment,
        userId: 1
      }
    }).then(response => {
      const res = response.data;
      if (res.code === 0) {
        Taro.atMessage({
          message: "评论成功",
          type: "success"
        });
      }
      this.setState({
        inputValue: ""
      });
    });
  };
  render() {
    return (
      <View>
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

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtInput, AtPagination, AtTextarea } from "taro-ui";
import CommentItem from "./commentItem";
import "./comment.scss";

export default class CommentList extends Component {
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
  render() {
    const { inputValue } = this.state;
    return (
      <View className="cmt-list">
        <View className="cmt-button">
          <View className="per-button">
            <AtButton type="primary" size="small">
              最新
            </AtButton>
          </View>
          <View className="per-button">
            <AtButton type="secondary" size="small">
              最先
            </AtButton>
          </View>
        </View>
        <CommentItem />
        <CommentItem />
        <CommentItem />
        <CommentItem />
        <AtPagination icon total={50} pageSize={10} current={1} />
        <View className="input-wrap">
          {/* <View className="input"> */}
          <AtInput
            type="text"
            maxLength="999"
            placeholder="输入"
            value={this.state.inputValue}
            onChange={this.handleInputChange.bind(this)}
          />
          {/* </View> */}
          {/* <View className="button"> */}
          <AtButton type="primary" size="small">
            提交
          </AtButton>
          {/* </View> */}
        </View>
      </View>
    );
  }
}

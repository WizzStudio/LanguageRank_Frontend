import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import "./comment.scss";

export default class CommentItem extends Component {
  constructor() {}
  render() {
    const { floor, userId, comment, saveTime, nickName, avatarUrl } =
      this.props.perCmt || "";
    let saveTimeRes = saveTime
      ? saveTime.slice(0, 10) + " " + saveTime.slice(11, 18)
      : "";
    return (
      <View className="comment-wrap">
        <View className="avatar">
          <AtAvatar image="https://jdc.jd.com/img/200" />
        </View>
        <View className="content-wrap">
          <View className="title">
            <View className="nickname">{"nickName"}</View>
            <View className="floor">#{floor}</View>
          </View>
          <View className="content">{comment}</View>
          <View className="time">{saveTimeRes}</View>
        </View>
      </View>
    );
  }
}

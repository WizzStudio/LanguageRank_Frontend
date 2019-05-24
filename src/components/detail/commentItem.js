import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./comment.scss";

export default class CommentItem extends Component {
  constructor() {}
  render() {
    const { floor, comment, saveTime, nickName, avatarUrl } =
      this.props.perCmt || "";
    let saveTimeRes = saveTime
      ? saveTime.slice(0, 10) + " " + saveTime.slice(11, 18)
      : "";
    return (
      <View className="comment-wrap">
        <View className="avatar-wrap">
          <Image className="avatar" src={avatarUrl} />
        </View>
        <View className="content-wrap">
          <View className="title">
            <View className="nickname">{nickName}</View>
            <View className="floor">#{floor}</View>
          </View>
          <View className="content">{comment}</View>
          <View className="time">{saveTimeRes}</View>
        </View>
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import "./comment.scss";

export default class CommentItem extends Component {
  constructor() {}
  render() {
    return (
      <View className="comment-wrap">
        <View className="avatar">
          <AtAvatar image="https://jdc.jd.com/img/200" />
        </View>
        <View className="content-wrap">
          <View className="title">
            <View className="nickname">昵称</View>
            <View className="floor">#432</View>
          </View>
          <View className="content">
            已连续打卡233天啦已连续打卡233天啦已连续打卡233天啦已连续打卡233天啦已连续打卡233天啦
          </View>
          <View className="time">今天9:02</View>
        </View>
      </View>
    );
  }
}

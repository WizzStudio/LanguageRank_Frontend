import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  AtButton,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction
} from "taro-ui";
import "./authRankList.scss";
import AuthItem from "../../components/rank/authItem";

import { connect } from "@tarojs/redux";
import { getAuth } from "../../actions/rankList";
@connect(
  ({ rankList }) => ({
    rankList
  }),
  dispatch => ({
    getAuth() {
      dispatch(getAuth());
    }
  })
)
export default class AuthRankList extends Component {
  constructor() {
    super();
  }
  componentWillMount() {
    this.props.getAuth();
  }
  handleNavigate(name) {
    Taro.navigateTo({
      url: "/pages/detail/langDetail?langName=" + encodeURI(name)
    });
  }
  render() {
    console.log("this.props.rankList", this.props.rankList.data);
    const rankList = this.props.rankList.data;

    return (
      <View>
        {rankList.map((rank, index) => {
          return (
            <View
              key={index}
              onClick={this.handleNavigate.bind(this, rank.name)}>
              <AuthItem
                langImg={rank.languageSymbol}
                langName={rank.languageName}
                heatNum={rank.languageNumber}
                tend={rank.languageTend}
                index={index}
              />
            </View>
          );
        })}
        <View>
          <Button onClick={this.props.getAuth}>首页</Button>
        </View>
      </View>
    );
  }
}

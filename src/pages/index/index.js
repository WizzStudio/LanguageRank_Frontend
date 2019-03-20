import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import { AtSegmentedControl } from "taro-ui";
import AuthRankList from "../rank/authRankList";
import DemandRankList from "../rank/demandRankList";

import { add, minus, asyncAdd } from "../../actions/counter";
import { getAuth } from "../../actions/rankList";

import "./index.scss";

@connect(
  ({ counter, rankList }) => ({
    counter,
    rankList
  }),
  dispatch => ({
    add() {
      dispatch(add());
    },
    getAuth() {
      dispatch(getAuth());
    }
  })
)
class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };
  constructor() {
    super();
    this.state = {
      current: 0
    };
  }
  handleClick(value) {
    this.setState({
      current: value
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="top-bg">
        <View className="blank" />
        <View className="wrap">
          <View className="tab-wrap">
            <AtSegmentedControl
              values={["语言热度榜", "雇主需求榜"]}
              onClick={this.handleClick.bind(this)}
              current={this.state.current}
              className="tab-seg"
            />
          </View>
          {this.state.current === 0 ? (
            <View className="tab-content">
              <AuthRankList />
            </View>
          ) : null}
          {this.state.current === 1 ? (
            <View className="tab-content">
              <DemandRankList />
            </View>
          ) : null}
        </View>

        {/* <View className="index">
          <Button className="add_btn" onClick={this.props.add}>
            +
          </Button>
          <Button className="dec_btn" onClick={this.props.dec}>
            -
          </Button>
          <Button className="dec_btn" onClick={this.props.asyncAdd}>
            async
          </Button>
          <View>
            <Text>{this.props.counter.num}</Text>
          </View>
        </View> */}
      </View>
    );
  }
}

export default Index;

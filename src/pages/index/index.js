import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import { AtTabs, AtTabsPane } from "taro-ui";
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
    const tabList = [{ title: "权威榜" }, { title: "雇主需求榜" }];
    return (
      <View>
        <AtTabs
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleClick}>
          <AtTabsPane current={this.state.current} index={0}>
            <View>
              <AuthRankList />
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View>
              <DemandRankList />
            </View>
          </AtTabsPane>
        </AtTabs>
        <View>
          <View>
            {/* <Button onClick={this.props.getAuth}>获取排行榜{this.props}</Button> */}
          </View>
        </View>
        <View className="index">
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
          <View>
            <Text>Hello, World</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;

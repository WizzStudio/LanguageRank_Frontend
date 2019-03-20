import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import AuthItem from "../../components/rank/authItem";
import "./demandRankList.scss";
import { connect } from "@tarojs/redux";

//本地静态数据
import lgIcon1 from "../../assets/img/language/C.png";
import lgIcon2 from "../../assets/img/language/python.png";
import lgIcon3 from "../../assets/img/language/php.png";
import lgIcon4 from "../../assets/img/language/vb.png";
import lgIcon5 from "../../assets/img/language/javascript.png";
import lgIcon6 from "../../assets/img/language/sql.png";
import { getDemand } from "../../actions/rankList";

@connect(
  ({ rankList }) => ({ rankList }),
  dispatch => ({
    getDemand() {
      dispatch(getDemand());
    }
  })
)
export default class DemandRankList extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    this.props.getDemand();
    console.log("this.props", this.props);
  }
  handleNavigate(name) {
    Taro.navigateTo({
      url: "/pages/detail/demandHome?langName=" + encodeURI(name)
    });
  }
  // handleNavigate(name) {
  //   Taro.navigateTo({
  //     url: "/pages/detail/langHome?langName=" + encodeURI(name)
  //   });
  // }
  render() {
    const { rankList } = this.props;

    return (
      <View>
        {rankList.map((rank, index) => {
          return (
            <View
              key={index}
              onClick={this.handleNavigate.bind(this, rank.languageName)}>
              <AuthItem
                langImg="logo"
                langName={rank.languageName}
                heatNum={rank.languageNumber}
                tend={rank.languageTend}
                index={index}
              />
            </View>
          );
        })}
      </View>
    );
  }
}

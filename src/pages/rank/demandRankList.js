import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import AuthItem from "../../components/rank/authItem";
import "./demandRankList.scss";

//本地静态数据
import lgIcon1 from "../../assets/img/language/C.png";
import lgIcon2 from "../../assets/img/language/python.png";
import lgIcon3 from "../../assets/img/language/php.png";
import lgIcon4 from "../../assets/img/language/vb.png";
import lgIcon5 from "../../assets/img/language/javascript.png";
import lgIcon6 from "../../assets/img/language/sql.png";

export default class DemandRankList extends Component {
  constructor() {
    super();
    this.state = {
      rankList: [
        {
          lgImg: lgIcon1,
          language: "C",
          exponent: 1231,
          trend: "up"
        },
        {
          lgImg: lgIcon2,
          language: "python",
          exponent: 345,
          trend: "up"
        },
        {
          lgImg: lgIcon3,
          language: "php",
          exponent: 45,
          trend: "up"
        },
        {
          lgImg: lgIcon4,
          language: "vb",
          exponent: 452,
          trend: "up"
        },
        {
          lgImg: lgIcon5,
          language: "javascript",
          exponent: 35634,
          trend: "up"
        },
        {
          lgImg: lgIcon6,
          language: "sql",
          exponent: 124,
          trend: "up"
        }
      ]
    };
  }
  render() {
    const { rankList } = this.state;

    return (
      <View>
        <View className="at-row">
          <View className="at-col at-col-3 auth-intro">
            <AtButton type="secondary" size="small" circle={true}>
              榜单介绍
            </AtButton>
          </View>
        </View>
        {rankList.map((rank, index) => {
          return (
            <View key={index}>
              <AuthItem
                lgImg={rank.lgImg}
                language={rank.language}
                exponent={rank.exponent}
                trend={rank.trend}
                index={index}
              />
            </View>
          );
        })}
      </View>
    );
  }
}

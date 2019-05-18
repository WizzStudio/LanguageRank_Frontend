import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtInput, AtPagination, AtTextarea } from "taro-ui";
import CommentItem from "./commentItem";
import "./comment.scss";
import { connect } from "@tarojs/redux";
import { getAuthCmt, getDemandCmt, getClassCmt } from "../../actions/comment";
@connect(
  ({ cmtInfo }) => ({
    cmtInfo
  }),
  dispatch => ({
    getAuthCmt(data) {
      return dispatch(getAuthCmt(data));
    },
    getDemandCmt(data) {
      return dispatch(getDemandCmt(data));
    },
    getClassCmt(data) {
      return dispatch(getClassCmt(data));
    }
  })
)
class CmtList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      btnMode: 1,
      pagination: {
        pageSize: 10,
        current: 1
      },
      commentList: []
    };
  }
  componentDidMount() {
    this.getCmtList(1, 1);
  }
  componentDidUpdate(prevProps) {
    if (this.props.typeCmt !== prevProps.typeCmt) {
      this.getCmtList(1, 1);
    }
  }
  getCmtList = (pageIndex = 1, commentDisplayMode = 1) => {
    console.log("执行了getCmt");
    const { typeCmt } = this.props || "";
    let data = {};
    if (typeCmt === "class") {
      data = {
        clazzId: this.props.clazzId,
        pageIndex,
        commentDisplayMode
      };
    } else {
      data = {
        languageName: this.props.langName,
        pageIndex,
        commentDisplayMode
      };
    }
    switch (typeCmt) {
      case "auth":
        this.props.getAuthCmt(data).then(res => {
          console.log("执行了getCmt111");
          this.setState({
            commentList: this.props.cmtInfo.authCmt.commentList
          });
        });
        return;
      case "demand":
        this.props.getDemandCmt(data).then(res => {
          this.setState({
            commentList: this.props.cmtInfo.demandCmt.commentList
          });
        });
        return;
      case "class":
        this.props.getClassCmt(data).then(res => {
          this.setState({
            commentList: this.props.cmtInfo.classCmt.commentList
          });
        });
        return;
      default:
        break;
    }
  };
  changeCmtPage = params => {
    this.getCmtList(params.current, 1);
  };
  changeCmtMode = type => {
    switch (type) {
      case "new":
        this.getCmtList(1, 1);
        this.setState({
          btnMode: 1
        });
        return;
      case "old":
        this.getCmtList(1, 2);
        this.setState({
          btnMode: 2
        });
        return;
      default:
        break;
    }
  };
  render() {
    const { commentList } = this.state;
    const { btnMode } = this.state;
    return (
      <View className="cmt-list">
        <View className="cmt-button">
          <View className="per-button">
            <AtButton
              type={btnMode === 1 ? "primary" : "secondary"}
              size="small"
              onClick={this.changeCmtMode.bind(this, "new")}>
              最新
            </AtButton>
          </View>
          <View className="per-button">
            <AtButton
              type={btnMode === 2 ? "primary" : "secondary"}
              size="small"
              onClick={this.changeCmtMode.bind(this, "old")}>
              最先
            </AtButton>
          </View>
        </View>
        {commentList.map(item => (
          <View key={item.floor}>
            <CommentItem perCmt={item} />
          </View>
        ))}
        <AtPagination
          icon
          total={50}
          pageSize={10}
          // current={1}
          onPageChange={this.changeCmtPage}
        />
      </View>
    );
  }
}

CmtList.defaultProps = {
  typeCmt: "",
  langName: "",
  clazzId: ""
};
export default CmtList;

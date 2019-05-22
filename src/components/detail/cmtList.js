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
      cmtTotal: 0,
      commentList: [],
      currPage: 0
    };
  }
  componentDidMount() {
    this.getCmtList(1, 1);
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.typeCmt !== prevProps.typeCmt ||
      this.props.clazzId !== prevProps.clazzId
    ) {
      console.log("属性改变了");
      this.getCmtList(1, 1);
    }
  }
  getCmtList = (pageIndex = 1, commentDisplayMode = 1) => {
    const { typeCmt } = this.props || "";
    const { commentList, cmtTotal } = this.state;
    let data = {};
    if (commentList.length + 1 >= cmtTotal) {
      return;
    }
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
          this.setState({
            commentList: commentList.concat(
              this.props.cmtInfo.authCmt.commentList
            ),
            cmtTotal: this.props.cmtInfo.authCmt.total
          });
        });
        return;
      case "demand":
        this.props.getDemandCmt(data).then(res => {
          this.setState({
            commentList: commentList.concat(
              this.props.cmtInfo.demandCmt.commentList
            ),
            cmtTotal: this.props.cmtInfo.demandCmt.total
          });
        });
        return;
      case "class":
        this.props.getClassCmt(data).then(res => {
          this.setState({
            commentList: commentList.concat(
              this.props.cmtInfo.classCmt.commentList
            ),
            cmtTotal: this.props.cmtInfo.classCmt.total
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
    const { commentList, btnMode, cmtTotal } = this.state;
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
          total={cmtTotal}
          pageSize={20}
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

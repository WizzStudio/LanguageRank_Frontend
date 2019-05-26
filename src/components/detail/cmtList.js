import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtPagination } from "taro-ui";
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
      cmtTotal: 1,
      commentList: [],
      currPage: 1,
      cmtPageSize: 20
    };
  }
  componentDidMount() {
    // this.getCmtList(1, 1);
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.typeCmt !== prevProps.typeCmt ||
      this.props.clazzId !== prevProps.clazzId
    ) {
      this.getCmtList(1, 1);
    }
  }
  getCmtList = (pageIndex = 1, commentDisplayMode = 1) => {
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
          this.setState({
            commentList: this.props.cmtInfo.authCmt.commentList,
            cmtTotal: this.props.cmtInfo.authCmt.total,
            currPage: this.props.cmtInfo.authCmt.pageIndex,
            cmtPageSize: this.props.cmtInfo.authCmt.pageISize
          });
        });
        return;
      case "demand":
        this.props.getDemandCmt(data).then(res => {
          this.setState({
            commentList: this.props.cmtInfo.demandCmt.commentList,
            cmtTotal: this.props.cmtInfo.demandCmt.total,
            currPage: this.props.cmtInfo.demandCmt.pageIndex,
            cmtPageSize: this.props.cmtInfo.demandCmt.pageISize
          });
        });
        return;
      case "class":
        this.props.getClassCmt(data).then(res => {
          this.setState({
            commentList: this.props.cmtInfo.classCmt.commentList,
            cmtTotal: this.props.cmtInfo.classCmt.total,
            currPage: this.props.cmtInfo.classCmt.pageIndex,
            cmtPageSize: this.props.cmtInfo.classCmt.pageISize
          });
        });
        return;
      default:
        break;
    }
  };
  changeCmtPage = params => {
    const { btnMode } = this.state;
    this.getCmtList(params.current, btnMode);
  };
  changeCmtMode = type => {
    switch (type) {
      case "new":
        this.getCmtList(1, 1);
        this.setState({
          btnMode: 1,
          currPage: 1
        });
        return;
      case "old":
        this.getCmtList(1, 2);
        this.setState({
          btnMode: 2,
          currPage: 1
        });
        return;
      default:
        break;
    }
  };
  render() {
    const {
      commentList,
      btnMode,
      cmtTotal,
      currPage,
      cmtPageSize
    } = this.state;
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
        {cmtTotal === 0 && (
          <View className="no-cmt">此处的评论有点秃，需要你的火力支援!</View>
        )}
        {commentList.map(item => (
          <View key={item.floor}>
            <CommentItem perCmt={item} />
          </View>
        ))}
        {cmtTotal !== 0 && (
          <AtPagination
            icon
            total={cmtTotal}
            pageSize={cmtPageSize}
            current={currPage}
            className="pagination"
            onPageChange={this.changeCmtPage}
          />
        )}
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

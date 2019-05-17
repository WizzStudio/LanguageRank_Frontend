import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtInput, AtPagination, AtTextarea } from "taro-ui";
import CommentItem from "./commentItem";
import "./comment.scss";
import { connect } from "@tarojs/redux";
import { getAuthCmt, getDemandCmt } from "../../actions/comment";
import AddComment from "./addComment";
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
export default class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      btnMode: 1,
      pagination: {
        pageSize: 10,
        current: 1
      }
    };
  }
  componentDidMount() {
    // this.getCmtList(1, 1);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.langName !== prevProps.langName) {
      this.getCmtList(1, 1);
    }
    // console.log("this.props222", this.props);
  }
  getCmtList = (pageIndex = 1, commentDisplayMode = 1) => {
    console.log("this.props", this.props);
    const { type } = this.props || "";
    const data = {
      languageName: this.props.langName,
      pageIndex,
      commentDisplayMode
    };
    this.props.getAuthCmt(data).then(res => {
      console.log("res", res);
    });
    // if (type) {
    //   switch (type) {
    //     case "auth":
    //       this.props.getAuthCmt(data).then(res => {
    //         console.log("res", res);
    //       });
    //       return;
    //     case "demand":
    //       this.props.getDemandCmt(data).then(res => {
    //         console.log("res", res);
    //       });
    //       return;
    //     case "class":
    //       this.props.getClassCmt(data).then(res => {
    //         console.log("res", res);
    //       });
    //       return;
    //     default:
    //       break;
    //   }
    // }
  };
  changeCmtPage = params => {
    console.log("params", params);
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
    const commentList =
      this.props.cmtInfo.authCmt && this.props.cmtInfo.authCmt.commentList;
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
        <AddComment />
      </View>
    );
  }
}

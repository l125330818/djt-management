/**
 * Created by luojie on 2017/6/1.
 */
import Upload from "antd/lib/upload";
import Icon from "antd/lib/Icon";
import Modal from "antd/lib/Modal";
import 'antd/lib/upload/style/css';
import 'antd/lib/Icon/style/css';
import 'antd/lib/Modal/style/css';
import "../../css/components/upload.scss";
export default class AntUpload extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            previewVisible: false,
            previewImage: '',
        };
        this.handlePreview = this.handlePreview.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }
    static defaultProps={
        fileList : []
    };
    componentDidMount() {


    }

    handleCancel(){
        this.setState({ previewVisible: false });
    }
    handlePreview(file){
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleChange(info){

    }

    onSuccess(e,f){
        let {removePreview,fileList} = this.props;
        f.url = e.data.imgurl;
        fileList.push(f);
        removePreview && $(".anticon-eye-o").remove();
        this.props.callback && this.props.callback(fileList);
    }
    onRemove(file){
        let {fileList} = this.props;
        let id = file.uid;
        let arr = fileList.filter((item)=>{
            return item.uid != id;
        });
        this.props.callback && this.props.callback(arr);
    }
    render(){
        const { previewVisible, previewImage,  } = this.state;
        const {length,fileList} = this.props;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="https://www.djtserver.cn/djt/web/upload/upimg.do"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    name = "img"
                    onChange={this.handleChange}
                    onRemove = {this.onRemove}
                    onSuccess = {this.onSuccess}
                >
                    {fileList.length >= length ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }

}
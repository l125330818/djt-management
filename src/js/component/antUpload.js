/**
 * Created by luojie on 2017/6/1.
 */
import Upload from "antd/lib/upload";
import Icon from "antd/lib/Icon";
import Modal from "antd/lib/Modal";
import "../../css/components/upload.scss";
export default class AntUpload extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
        };
        this.handlePreview = this.handlePreview.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

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
    handleChange(fileList){
        console.log(fileList);
        // this.setState({ fileList });
    }
    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
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
                    withCredentials = {true}
                    responseType = "json"
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }

}
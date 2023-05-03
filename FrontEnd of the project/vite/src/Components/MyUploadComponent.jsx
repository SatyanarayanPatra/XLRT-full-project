import { useState } from 'react';
import { Upload, message, Table } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const MyUploadComponent = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [columns] = useState([
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
  ]);

  const handleChange = (info) => {
    // console.log("hitting", info.file);

    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get the uploaded file URL
      const fileUrl = info.file.response.fileUrl;
      // Add the uploaded file to the fileList()
      console.log(info.file);
      setFileList([
        ...fileList,
        {
          // uid: info.file.uid,
          name: info.file.name,
          status: 'done',
          url: fileUrl,
        },
      ]);
      setLoading(false);
    }
  };
  // https://www.mocky.io/v2/5cc8019d300000980a055e76
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const props = {
    name: 'file',
    action: 'http://localhost:4500/',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      handleChange(info);
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <div>
      <Upload {...props}>{uploadButton}</Upload>
      <Table dataSource={fileList} columns={columns} />
    </div>
  );
};

export default MyUploadComponent;

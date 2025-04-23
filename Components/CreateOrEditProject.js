import React, { useState,useEffect } from 'react'
import { Modal, Button, Form, Input, } from 'antd';
import { ApiPost } from '../helpers/API/ApiData';

function CreateOrEditProject() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [postProject, setPostProject] =useState("")


    const handlePostProject = async () => {
        await ApiPost("project/add")
            .then((res) => {
                setPostProject(res)
            })
  
            .catch((err) => {
              console.log("error in post temp data!!");
            });
       
  
        };
      
        useEffect(() => {
            handlePostProject();
        }, []);


        const handleOk = (values) => {
            let bodyData = {
                "name": {...values},
                "description": {...values}
            }
            ApiPost('project/add', bodyData).then((res) => {
                if (res.status === 200) {
                    toast.success("project sucessfully create!!");
                    toggle()
                }
            }).catch(err => toast.error(err))
            setIsModalVisible(true);
        };


    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      };

    const showModal = () => {
        setIsModalVisible(true);
    };

    // const handleOk = () => {
    //     setIsModalVisible(postProject);
    // };

    const handleCancel = () => {
        setIsModalVisible(false);

        const onFinish = (values) => {
            console.log(values);
          };
    };

    // const validateMessages = {
    //     required: '${label} is required!',
    //     types: {
    //       email: '${label} is not a valid email!',
    //       number: '${label} is not a valid number!',
    //     },
    //     number: {
    //       range: '${label} must be between ${min} and ${max}',
    //     },
    //   };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Add Project
            </Button>
            <Modal title="Add Project" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>

                <Form {...layout} name="nest-messages" >
                    <Form.Item name={['name']} label="Project Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['description']} label="Discription">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
        </>
    );
}

export default CreateOrEditProject

import { Modal, Button, Form, Input,notification } from 'antd';
import React, { useState,useEffect } from 'react'
import { ApiPost ,ApiPut} from '../../helpers/API/ApiData';

const Searchbar =({searchLine,getData,selecttype,userData})=>{

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [getview, setview] = useState('Project');

  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [imageUser, setImageUser] = useState(null);


  const [postProject, setPostProject] = useState("");
  const [prodata, setdata] = useState({
    name:'',description:''
  });

    const [userdata, seruserdata] = useState({
    firstName:'', lastName:'', userName:'', email:'', password:'',parents:userData[0]?._id,role:'emp'
  });

  

  const handleOk = (values) => {
    if(prodata.name==='' || prodata.description===''){
      return notification.open({
        message: 'Error',
        description: "Please Enter all Fields",
      });
    }
    ApiPost("project/add", prodata)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.msg) {
            return notification.open({
              message: 'Error',
              description: res.data.msg,
            });
          }

          setIsModalVisible(false);
          setdata({
    name:'',description:''
  })
          getData(res)
          notification.open({
            message: 'Project',
            description: "Project Created Successful",
          });
        }
      })
      .catch((err) => notification.open({
        message: 'Error',
        description: "err",
      }));
    setIsModalVisible(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setdata({
      name:'',description:''
    })

    const onFinish = (values) => {
      console.log(values);
    };
  };


// .................................................................user add...................


const handleOk2 = (values) => {
  if(userdata.firstName==='' || userdata.lastName==='' || userdata.userName==='' || userdata.email==='' || userdata.firstName==='' &&userdata.password==='' ){
    return notification.open({
      message: 'Error',
      description: "Please Enter all Fields",
    });
  }
  // if(imageUser===null){
  //   return notification.open({
  //     message: 'Error',
  //     description: "Please Enter all Fields",
  //   });
  // }

    ApiPost("user/signup", userdata)
      .then((res) => {
        if (res.status === 200) {
          setIsModalVisible2(false);
          if(res.data.msg)
          {return notification.open({
            message: 'Error',
            description: res.data.msg,
          })}
          seruserdata({
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            parents:userData[0]?._id,
            role:'emp'
          });
          notification.open({
            message: 'User',
            description: "User Created Successful",
          });
          getData(res)
        }
      })
      .catch((err) =>{return notification.open({
        message: 'Error',
        description: err,
      })});
    setIsModalVisible2(true);
  };

  const showModal2 = () => {
    setIsModalVisible2(true);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
    seruserdata({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      parents:userData[0]?._id,
      role:'emp'
    });

    const onFinish = (values) => {
      console.log(values);
    };
  };


  const onChangedata=(e)=>{
    setdata(data=>{
      return {...data,[e.target.name]:e.target.value};
    })
  }

   const onChangeuserdata=(e)=>{
     if(e.target.name==='email'){
       return seruserdata(data=>{
        return {...data,[e.target.name]:e.target.value.toLowerCase()};
      })
     }
    seruserdata(data=>{
      return {...data,[e.target.name]:e.target.value};
    })
  }

  const ImageUpload=(file)=>{
    const formData = new FormData();
    formData.append(
      "file",
      file,
      file.name
    );
    setImageUser(formData)
  }


  return (
    <>
      <div className="searchbarSection">
        <input
          type="text"
          className="searchbar"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Search"
          defaultValue=""
          onChange={(e) => {
            searchLine(e.target.value);
          }}
        />

        {getview === "Project" ? (
          <div className="newprojectbtn" onClick={showModal}>
            New Project
          </div>
        ) : (
          <div className="newprojectbtn" onClick={showModal2}>
            New User
          </div>
        )}

        <div className="useradnProject">
          <select
            className="form-select slectuser "
            aria-label=".form-select-lg example"
            onChange={(e) => {
              selecttype(e.target.value);
              setview(e.target.value);
            }}
          >
            <option value={"Project"}>Project</option>
            <option value={"User"}>User</option>
          </select>

        </div>
      </div>

      <Modal
        title="Add Project"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modelcss"
      >
        <form onSubmit={handleOk}>
          <div className="form-group row">
            <div className="col-12  mb-3">
              <input
                type="text"
                className="form-control"
                id="staticEmail"
                name="name"
                onChange={(e) => onChangedata(e)}
                placeholder="Project Name"
                value={prodata.name}
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-12 mb-3">
              <textarea
                class="form-control"
                name="description"
                id="exampleFormControlTextarea1"
                onChange={(e) => onChangedata(e)}
                rows="3"
                value={prodata.description}
              ></textarea>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        title="Add User"
        visible={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        className="modelcss"
      >
        <form onSubmit={handleOk2}>
          <div className="form-group row">
            <div className="col-12  mb-3">
              <input
                type="text"
                className="form-control"
                id="staticEmail"
                name="firstName"
                onChange={(e) => onChangeuserdata(e)}
                placeholder="First Name"
                value={userdata.firstName}
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-12 mb-3">
                 <input
                type="text"
                className="form-control"
                id="staticEmail"
                name="lastName"
                onChange={(e) => onChangeuserdata(e)}
                placeholder="Last Name"
                value={userdata.lastName}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-12 mb-3">
                 <input
                type="text"
                className="form-control"
                id="staticEmail"
                name="userName"
                onChange={(e) => onChangeuserdata(e)}
                placeholder="User Name"
                value={userdata.userName}
              />
            </div>
          </div>

          {/* <div className="form-group row">
            <div className="col-12 mb-3">
                 <input
                type="file"
                className="form-control"
                id="staticEmail"
                name="image"
                placeholder="image"
                onChange={(e)=>{ImageUpload(e.target.files[0])}}
              />
            </div>
          </div> */}

          <div className="form-group row">
            <div className="col-12 mb-3">
                 <input
                type="email"
                className="form-control"
                id="staticEmail"
                name="email"
                onChange={(e) => onChangeuserdata(e)}
                placeholder="Email"
                value={userdata.email}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-12 mb-3">
                 <input
                type="password"
                className="form-control"
                id="staticEmail"
                name="password"
                onChange={(e) => onChangeuserdata(e)}
                placeholder="Password"
                value={userdata.password}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-12 ">
                 <select
            className="form-select  mb-3 "
            aria-label=".form-select-lg example"
            value={userdata.parents===''?userData[0]?._id:userdata.parents}
            name="parents"
            onChange={(e) => {
             onChangeuserdata(e)
            }}
          >
             {userData&& userData.map((data,key)=>{
            return(<option value={data._id} key={key}>{data.userName}</option>)
          })}
          </select>
            </div>
          </div>


           <div className="form-group row">
            <div className="col-12 ">
                 <select
            className="form-select"
            aria-label=".form-select-lg example"
            value={userdata.role}
            name="role"
            onChange={(e) => {
             onChangeuserdata(e)
            }}
          >
            <option value={'emp'} selected>Employee</option>
            <option value={'man'}>Manager</option>

          </select>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Searchbar




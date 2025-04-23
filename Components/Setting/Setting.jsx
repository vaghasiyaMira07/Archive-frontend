import { ApiDelete,ApiPut } from "../../helpers/API/ApiData";
import React, { useState, useEffect } from "react";
import { getToken } from "../../utils/auth.util.js";
import { notification } from 'antd';
import Loding from "../Loding/Loding";

const Setting = ({ carddata, getData }) => {
const [lodingState, setlodingState] = useState(false);
  const [userdata, seruserdata] = useState();


 useEffect(()=>{
  const data = localStorage.getItem("userInfo");
  const userIn = JSON.parse(data);
  seruserdata(userIn)
 },[lodingState])


  const onChangeuserdata = (e) => {
    seruserdata((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const ImageUpload=(file)=>{
    setlodingState(true)
    const formData = new FormData();
    formData.append(
      "file",
      file,
      file.name
    );
    ApiPut("user/profile/img",formData )
          .then((res) => {
            notification.open({
              message: 'Done',
              description:res?.data?.msg
            })
          if(res?.data?.profile_img){
            let imageData =JSON.parse( localStorage.getItem("userInfo"))
            imageData.profile_img=res?.data?.profile_img;
            localStorage.setItem("userInfo", JSON.stringify(imageData));
          }
    setlodingState(false);

          
          })

          .catch((err) =>{ 
    setlodingState(false);
            
            notification.open({
            message: 'Error',
            description: "err",
          })});
  }

  return (
    <>
     <Loding display={lodingState} blure={true} />
      <div className="settingSection">
        <div className="backgroundimage">
          <img src="image\homepage\fam.jfif" alt="asd" className="bgImage" />
          <img
            src={userdata?.profile_img?userdata?.profile_img:`https://avatars.dicebear.com/api/adventurer-neutral/${userdata?.firstName}.svg`}
            alt=""
            className="userImage"
          />
        </div>

        <div className={"iconsBox"}>
          <img
            src="https://user-images.githubusercontent.com/819186/51553744-4130b580-1e7c-11e9-889e-486937b69475.png"
            alt="img"
            className={"slackicon"}
            onClick={() => {
              window.open(
                `https://slack.com/oauth/authorize?client_id=515922749158.2954471482944&scope=chat:write:user&state=${userIn.id}`,
                "",
                "width=800,height=700,left=500,top=200"
              );
            }}
          />
        </div>

        <div className="userInfoCard">
        <div className="cardForm">

          <form>
            <div className="form-group row">
              <div className="col-12  mb-3">
                <label className="textcolorWT" for="exampleInputEmail1">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="staticEmail"
                  name="firstName"
                  onChange={(e) => onChangeuserdata(e)}
                  placeholder="First Name"
                  value={userdata?.firstName}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-12 mb-3">
                <label className="textcolorWT" for="exampleInputEmail1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="staticEmail"
                  name="lastName"
                  onChange={(e) => onChangeuserdata(e)}
                  placeholder="Last Name"
                  value={userdata?.lastName}
                />
              </div>
            </div>
             <div className="form-group row">
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
          </div>

            <div className="form-group row">
              <div className="col-12 mb-3">
                <label className="textcolorWT" for="exampleInputEmail1">
                  User Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="staticEmail"
                  name="userName"
                  onChange={(e) => onChangeuserdata(e)}
                  placeholder="User Name"
                  value={userdata?.userName}
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-12 mb-3">
                <label className="textcolorWT" for="exampleInputEmail1">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="staticEmail"
                  name="email"
                  onChange={(e) => onChangeuserdata(e)}
                  placeholder="Email"
                  value={userdata?.email}
                  disable
                />
              </div>
            </div>
          </form>
        </div>
        </div>
      </div>

      {/* <div className="settingpage">

        <div className={"iconsBox"}>
          <img
            src="https://user-images.githubusercontent.com/819186/51553744-4130b580-1e7c-11e9-889e-486937b69475.png"
            alt="img"
            className={"slackicon"}
            onClick={() => {
              window.open(
                `https://slack.com/oauth/authorize?client_id=515922749158.2954471482944&scope=chat:write:user&state=${userIn.id}`,
                "",
                "width=800,height=700,left=500,top=200"
              );
            }}
          />
        </div>
      </div> */}
    </>
  );
};

export default Setting;

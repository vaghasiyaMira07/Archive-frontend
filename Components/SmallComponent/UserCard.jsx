import { ApiDelete } from "../../helpers/API/ApiData";
import React, { useState,useEffect } from 'react';
import { Modal, Button, Form, Input,notification } from 'antd';
import {getToken} from '../../utils/auth.util.js'

const UserCard=({carddata,getData})=>{

  const [deletemodal, setDeletemodel] = useState(false);
  const SubmitData = async () => {
    await ApiDelete(`user/remove/${carddata._id}`)
      .then((res) => {
        if(res.data.msg)
        {
          return notification.open({
            message: 'Error',
            description: res.data.msg,
          })
        }
        if (res) {
          getData(res);
          setDeletemodel(false);
          notification.open({
            message: 'Delete User',
            description: 'Delete User Successful',
          });
          
        }
      })
      .catch((err) => {
        notification.open({
          message: 'Error',
          description: "err",
        })
        localStorage.removeItem("userInfo");
      });
  };

  return (
    <>
      <div className="usarcard">
        <div className={"Cardview"}>
          <div className={"cardUser"}>
            <div
              className={"cardUserImg"}
            >
              <img
                  src={carddata.profile_img?carddata.profile_img:`https://avatars.dicebear.com/api/adventurer-neutral/${carddata.firstName}.svg`}
                alt="img"
                className={"imageCard"}
              ></img>
            </div>
            <div className={"cardUserDis"}>
              <p className={"userName"}>
                {carddata.firstName + " " + carddata.lastName}
              </p>
              <p className={"userstylename"}>{carddata.userName}</p>
              <p className={"email"}>{carddata.email}</p>
            </div>
          </div>

        
          
          {/* {cardModal && <CardViews cardModal={cardModal} toggle={(data)=>setCardModal(data)}/>} */}
        </div>

         <div className="deletebtn">
                <img src="/image/homepage/delete.png" alt="" className="deletebtnimg" onClick={(e) =>{
                  if(carddata.role == "admin"){
                    notification.open({
                      message: 'Error',
                      description: "You can't delete admin",
                    })
                  }
                  else{setDeletemodel(true)}}}
                  />
            </div>
      </div>


         <Modal
        title="You want to delete this User"
        visible={deletemodal}
        onOk={()=>{SubmitData()}}
        onCancel={()=>{setDeletemodel(false)}}
        className="modelcss"
      />
    </>
  );
}

export default UserCard

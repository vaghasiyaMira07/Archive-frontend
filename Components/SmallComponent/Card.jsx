import { ApiDelete,ApiPost } from "../../helpers/API/ApiData";
import { Modal, Button, Form, Input,notification } from 'antd';
import React, { useState,useEffect } from 'react'


const Card=({carddata,getData,userData,onClick,selectProject,key})=>{
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletemodal, setDeletemodel] = useState(false);
  const [assignmember, setassignmamber] = useState(carddata?.assign);
  const [useralldata, setuserData] = useState(userData ? userData :[] );
  const [selectData, setSelectData] = useState([]);
  const [userSelectedID, setuserSelectedID] = useState('');





  
  const setusersData = () => {
    let dataArray=[];
  assignmember.map((data)=>{dataArray.push(data._id)})
  setSelectData(dataArray);
    setuserData((data) => {
      return data.filter((data2) => {
        return !selectData.includes(data2?._id);
      });
    });
  };
  useEffect(() => {
   setusersData();
 },[isModalVisible])



  
  
    const deleteCard = async () => {
    await ApiDelete(`project/remove/${carddata._id}`)
      .then((res) => {
        if (res) {
          getData(res)
          setDeletemodel(false)
          notification.open({
            message: 'Delete Project',
            description: 'Delete Project Successful',
          });
        }
      })
      .catch((err) => {
        notification.open({
          message: 'Delete Project',
          description: "err",
        });
        localStorage.removeItem("userInfo");
      });
  };
  


    const assignMember = (values) => {
    ApiPost(`project/assign/${carddata._id}`, {
      assign:selectData
    })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.msg) {
            return   notification.open({
              message: 'Assign Member',
              description: res.data.msg,
            }); 
          }
          setSelectData([])
          setIsModalVisible(false);
          getData(res)
          notification.open({
            message: 'Assign Member',
            description: 'Assign Member Successful',
          }); 
          
        }
      })
      .catch((err) => notification.open({
        message: 'Error',
        description: "err",
      }));
    setIsModalVisible(true);
  };





const addData=()=>{
  if(userSelectedID!=='' && userSelectedID!==undefined){
    setSelectData((data) => [...data, userSelectedID]);
    const selecteduserdata =useralldata.filter((data)=>data._id === userSelectedID)
    setassignmamber((data) => [...data, ...selecteduserdata]);
    setuserData((data) => {
      return data?.filter((data2) => {
        return data2._id!==userSelectedID;
      });
    });
    setuserSelectedID();
  }
}

  const showmodal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectData([])
    const onFinish = (values) => {
      console.log(values);
    };
  };


 const deletemember=(userIddelete)=>{
   setSelectData((data) => {
     return data.filter((data) => data !== userIddelete);
   });
    setassignmamber((data) => {return data.filter(data=>data._id!==userIddelete)});
      const selecteduserdata = userData.filter((data)=>data._id === userIddelete)
   setuserData((data2) =>[...data2, ...selecteduserdata]);
 }



  
  return (
    <>
      <div className={carddata._id===selectProject?._id?"cardcss active":"cardcss"}>
        <div className="cardtitle" onClick={()=>{onClick(carddata)}}> {carddata?.name}</div>
        <div className="cardmember">
          {" "}
          member : {carddata?.assign.length || 0}
        </div>
        <div className= {carddata._id===selectProject?._id?"assigneebtn assigneebtnactive":"assigneebtn" } onClick={() => showmodal()}>
          Assign
        </div>
        <div className="deletebtn">
          <img
            src="/image/homepage/delete.png"
            alt=""
            className="deletebtnimg"
            onClick={(e) => setDeletemodel(true)}
          />
        </div>
      </div>

      <Modal
        title="Assign Memberfa-spin"
        visible={isModalVisible}
        onOk={assignMember}
        onCancel={handleCancel}
        className="modelcss"
      >
        <div className="selectAssign">
          <select
            className="form-select  mb-3 slectField"
            aria-label=".form-select-lg example"
            name="users"
            onChange={(e) => {
              setuserSelectedID(e.target.value);
            }}
          >
            <option value="" selected>
              {" "}
              Select Member{" "}
            </option>
            {useralldata &&
              useralldata.map((data,key) => {
                return <option key={key} value={data._id}>{data?.userName}</option>;
              })}
          </select>
          <div
            className="slectbtn"
            onClick={() => {
              addData();
            }}
          >
            ADD
          </div>
        </div>
        <div className="modelcard">
          {assignmember &&
            assignmember.map((data,key) => (
              <div className="modelcard-card" key={key}>
                <div className="modelcard-card-name">{data?.userName}</div>
                <p
                  className="cancleBtn"
                  onClick={() => {
                    deletemember(data?._id);
                  }}
                >
                  X
                </p>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        title="You want to delete this Project"
        visible={deletemodal}
        onOk={()=>{deleteCard()}}
        onCancel={()=>{setDeletemodel(false)}}
        className="modelcss"
      />
    </>
  );}

export default Card
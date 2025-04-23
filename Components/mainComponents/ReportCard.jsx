import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { todayPlanandStatus, selectData } from "../Jotai/atom";
import { getToken } from "../../utils/auth.util.js";
import { Modal, Button, Form, Input, notification, Select } from "antd";
import { ApiPost, ApiGet, ApiDelete, ApiPut } from "../../helpers/API/ApiData";

const ReportCard = () => {
  const [getDate, setgetDate] = useAtom(selectData);
  const [planAndStatus, setplanAndStatus] = useAtom(todayPlanandStatus);
  const [userData, setUserData] = useState({});
  const [projects, setProject] = useState([]);
  const [employees, setEmployees] = useState([]);
  const todayDate = new Date();
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalforDailyPlan, setIsModalforDailyPlan] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [todaysPlan, settodaysPlan] = useState({});
  const [todaysstatus, settodaysstatus] = useState({});

  const [userdata, seruserdata] = useState({
    projectId: "",
    taskDetails: "",
    [isModalforDailyPlan === `Today's Plan`
      ? "estimatedHours"
      : "totalHours"]: 0,
    taskType: "Bug",
    taskStatus: "Pending",
    mainDataId: "",
    assignedTo: ""
  });

  const handleCancel2 = () => {
    setIsModalVisible2(false);
    seruserdata({
      projectId: "",
      taskDetails: "",
      [isModalforDailyPlan === `Today's Plan`
        ? "estimatedHours"
        : "totalHours"]: 0,
      taskType: "Bug",
      taskStatus: "Pending",
      mainDataId: "",
      assignedTo: ""
    })
    const onFinish = (values) => {
      console.log(values);
    };
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userInfo")));
    const id = JSON.parse(localStorage.getItem("userInfo"))?.id;
    handleGetProject();
    handleGetEmployees();
  }, []);

  const handleGetProject = async () => {
    await ApiGet("project/selectuser")
      .then((res) => {
        setProject(res.data.data);
      })
      .catch((err) => {
        console.log("error in post temp data!!");
      });
  };

  const handleGetEmployees = async () => {
    await ApiGet("user/find-all")
      .then((res) => {
        const data = res?.data?.users.filter((data) => data.isActive === true && data.role === "emp");
        setEmployees(data);
      })
      .catch((err) => {
        console.log("error in getting employees!!");
      });
  };

  const onChangeuserdata = (e) => {
    seruserdata((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const handleOk2 = (values) => {
    if (userdata.taskDetails === "") {
      return notification.open({
        message: 'Error',
        description: "Enter your Plan",
      })
    }
    if (userdata.projectId === "") {
      return notification.open({
        message: 'Error',
        description: "Enter your Project",
      })
    }
    if (userdata.estimatedHours === "" || userdata.estimatedHours === null) {
      return notification.open({
        message: 'Error',
        description: "Estimated time",
      })
    }

    const isPlan = isModalforDailyPlan === `Edit` ? userdata.type : isModalforDailyPlan === `Today's Plan` ? "plan" : "status";

    const plandata = {
      isPlan: isModalforDailyPlan === `Edit` ? (userdata.type === "plan" ? true : false) :  isModalforDailyPlan === `Today's Plan` ? true : false,
      isStatus: isModalforDailyPlan === `Edit` ? (userdata.type === "status" ? true : false) :  isModalforDailyPlan === `Today's Status` ? true : false,
      [isPlan]: {
        ...userdata,
      },
    };

    // If admin is assigning task to employee
    if (userData.role === "admin" && selectedEmployee) {
      // Create notification for the assigned employee
      const notificationData = {
        title: "New Task Assigned",
        description: userdata.taskDetails,
        userId: [selectedEmployee],
        date: new Date()
      };

      ApiPost("notification/add-notification", notificationData)
        .then((res) => {
          if (res.status === 200) {
            notification.open({
              message: 'Success',
              description: "Task assigned successfully",
            });
          }
        })
        .catch((err) => {
          notification.open({
            message: 'Error',
            description: "Failed to create notification",
          });
        });
    }

    if(isModalforDailyPlan === `Edit`){
      ApiPut(`report/edit/${planAndStatus?.id}/${userdata.type}/${userdata.mainDataId}`,plandata)
      .then((res) => {
        if (res.status === 200) {
          // If task is marked as completed, move it to Daily Status
          if (userdata.taskStatus === "Completed" && userdata.type === "plan") {
            const statusData = {
              isPlan: false,
              isStatus: true,
              status: {
                projectId: userdata.projectId,
                taskDetails: userdata.taskDetails,
                totalHours: userdata.estimatedHours,
                taskType: userdata.taskType,
                taskStatus: "Completed"
              }
            };
            
            // Add to Daily Status
            ApiPost(`report/add?user=${selectedEmployee || getDate.userData}`, statusData)
              .then((statusRes) => {
                if (statusRes.status === 200) {
                  // Remove from Daily Plan
                  deleteData(planAndStatus?.id, userdata.mainDataId, "plan");
                  notification.open({
                    message: 'Success',
                    description: "Task moved to Daily Status",
                  });
                }
              })
              .catch((err) => {
                notification.open({
                  message: 'Error',
                  description: "Failed to move task to Daily Status",
                });
              });
          }
          
          getData();
          handleCancel2();
          if (res.data.msg) {
              return notification.open({
              message: 'Error',
              description: res.data.msg,
            })
          }
          seruserdata({
            projectId: "",
            taskDetails: "",
            estimatedHours: 0,
            taskType: "Bug",
            taskStatus: "Pending",
            assignedTo: ""
          });
        }
      })
      .catch((err) => notification.open({
        message: 'Error',
        description: err,
      }));
    setIsModalVisible2(true);

  
    } else {
      ApiPost(`report/add?user=${selectedEmployee || getDate.userData}`, plandata)
        .then((res) => {
          if (res.status === 200) {
            getData();
            handleCancel2();
            if (res.data.msg) {
              return notification.open({
                message: 'Error',
                description: res.data.msg,
              })
            }
            seruserdata({
              projectId: "",
              taskDetails: "",
              estimatedHours: 0,
              taskType: "Bug",
              taskStatus: "Pending",
              assignedTo: ""
            });
            setSelectedEmployee("");
          }
        })
        .catch((err) => notification.open({
          message: 'Error',
          description:err,
        }));
      setIsModalVisible2(true);
    }
  };

  useEffect(() => {
    const plan = {};
    const status = {};
    planAndStatus?.plan?.map((data) => {
      let name = data?.projectId?.name;
      if (!plan[data?.projectId?.name]) {
        plan[data?.projectId?.name] = [data];
      } else {
        plan[data?.projectId?.name] = [...plan[data?.projectId?.name], data];
      }
    });

    planAndStatus?.status?.map((data) => {
      let name = data?.projectId?.name;
      if (!status[data?.projectId?.name]) {
        status[data?.projectId?.name] = [data];
      } else {
        status[data?.projectId?.name] = [
          ...status[data?.projectId?.name],
          data,
        ];
      }
    });

    settodaysstatus(status);
    settodaysPlan(plan);
  }, [planAndStatus]);

  const getData = () => {
    if (getDate.userData === "") {
      return;
    }
    const plandata = {
      date: getDate,
    };
    ApiPost(`report/selectedreport`, plandata)
      .then((res) => {
        if (res.status === 200) {
          setplanAndStatus({
            plan: res?.data?.plan || [],
            status: res?.data?.status || [],
            id: res?.data?._id || "",
          });
          if (res.data.msg) {
            return notification.open({
              message: 'Error',
              description: res.data.msg,
            })
          }
        }
      })
      .catch((err) => alert(err));
  };

  const openSlack = async (type)=>{
    await ApiGet(`report/send-report-slack?iswhat=`+type)
    .then((res) => {
      notification.open({
        message: type,
        description: res,
      })
    })
    .catch((err) => {
      notification.open({
        message: 'Error',
        description: err,
      })
    });
}


  const deleteData = async (MainId, SubID, type) => {
    await ApiDelete(`report/delete/${MainId}/${type}/${SubID}`)
      .then((res) => {
        getData();
      })
      .catch((err) => {
        alert(err);
        localStorage.removeItem("userInfo");
      });
  };

  const EditData = (mainData, type) => {
    console.log("malo",mainData);
    setIsModalVisible2(true);
    setIsModalforDailyPlan("Edit");
    seruserdata({
      projectId: mainData.projectId._id,
      taskDetails:mainData.taskDetails ,
      estimatedHours: mainData.estimatedHours,
      taskType: mainData.taskStatus,
      taskStatus: mainData.taskType,
      mainDataId:mainData._id,
      type:type
    });
  };

  const moveToStatus = (mainData) => {
    const statusData = {
      isPlan: false,
      isStatus: true,
      status: {
        projectId: mainData.projectId._id,
        taskDetails: mainData.taskDetails,
        totalHours: mainData.estimatedHours,
        taskType: mainData.taskType,
        taskStatus: "Completed"
      }
    };
    
    // Add to Daily Status
    ApiPost(`report/add?user=${getDate.userData}`, statusData)
      .then((statusRes) => {
        if (statusRes.status === 200) {
          // Remove from Daily Plan
          deleteData(planAndStatus?.id, mainData._id, "plan");
          notification.open({
            message: 'Success',
            description: "Task moved to Daily Status",
          });
        }
      })
      .catch((err) => {
        notification.open({
          message: 'Error',
          description: "Failed to move task to Daily Status",
        });
      });
  };

  return (
    <>
      <div className="reviewCardSection">
        <div className="leftcard cardcommon">
          {todayDate.getDate() === getDate.date &&
            todayDate.getFullYear() === getDate.year &&
            todayDate.getMonth() === getDate.month && (
              <div
                className="AddbuttonData"
                onClick={() => {
                  setIsModalVisible2(true);
                  setIsModalforDailyPlan("Today's Plan");
                }}
              >
                +
              </div>
            )}
          <div className="headingCard">Daily Plan</div>

          <div className="dataContainer">
            {Object.values(todaysPlan).length === 0 ? (
              <>
                <div className="errormassage">
                  Sorry , Data is not available
                </div>
              </>
            ) : (
              Object.keys(todaysPlan).map((data, index) => {
                const valuesData = Object.values(todaysPlan)[index];
                
                return (
                  <>
                    <div className="projectHeading">{data}</div>
                    {valuesData.map((mainData) => {
                      return (
                        <div className="subtask">
                          {mainData.taskDetails}
                          <div className="btncssBox">
                            <div>
                              <img
                                src="/image/homepage/delete.png"
                                alt=""
                                className="deletebtnimg"
                                onClick={() => {
                                  deleteData(
                                    planAndStatus?.id,
                                    mainData._id,
                                    "plan"
                                  );
                                }}
                              />
                            </div>
                            <div>
                              <img
                                src="/image/homepage/write.png"
                                alt=""
                                className="deletebtnimg"
                                onClick={() => EditData(mainData,"plan")}
                              />
                            </div>
                            <div>
                              <img
                                src="/image/homepage/check.png"
                                alt=""
                                className="deletebtnimg"
                                onClick={() => moveToStatus(mainData)}
                                title="Mark as completed and move to Daily Status"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                );
              })
            )}
          </div>
          <div className={"iconsBox"}>
            <img
              src="https://user-images.githubusercontent.com/819186/51553744-4130b580-1e7c-11e9-889e-486937b69475.png"
              alt="img"
              className={"slackicon"}
              onClick={() => {openSlack('plan')}}
            />
          </div>
        </div>

        <div className="rightcard cardcommon">
          {todayDate.getDate() === getDate.date &&
            todayDate.getFullYear() === getDate.year &&
            todayDate.getMonth() === getDate.month && (
              <div
                className="AddbuttonData"
                onClick={() => {
                  setIsModalVisible2(true);
                  setIsModalforDailyPlan("Today's Status");
                }}
              >
                +
              </div>
            )}
          <div className="headingCard">Daily Status</div>

          <div className="dataContainer">
            {Object.values(todaysstatus).length === 0 ? (
              <>
                <div className="errormassage">
                  Sorry , Data is not available
                </div>
              </>
            ) : (
              Object.keys(todaysstatus).map((data, index) => {
                const valuesData = Object.values(todaysstatus)[index];

                return (
                  <>
                    <div className="projectHeading">{data}</div>
                    {valuesData.map((mainData,key) => {
                      return (
                        <div className="subtask" key={key}>
                          {mainData.taskDetails}
                          <div className="btncssBox">
                            <div>
                              <img
                                src="/image/homepage/delete.png"
                                alt=""
                                className="deletebtnimg"
                                onClick={() => {
                                  deleteData(
                                    planAndStatus?.id,
                                    mainData._id,
                                    "status"
                                  );
                                }}
                              />
                            </div>
                            <div>
                              <img
                                src="/image/homepage/write.png"
                                alt=""
                                className="deletebtnimg"
                                onClick={() => EditData(mainData, "status")}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                );
              })
            )}
          </div>
          <div className={"iconsBox"}>
            <img
              src="https://user-images.githubusercontent.com/819186/51553744-4130b580-1e7c-11e9-889e-486937b69475.png"
              alt="img"
              className={"slackicon"}
              onClick={() => {openSlack('status')}}
            />
          </div>
        </div>
      </div>

      <Modal
        title={isModalforDailyPlan}
        visible={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        className="modelcss"
      >
        <form onSubmit={handleOk2}>
          {userData.role === "admin" && (
            <div className="form-group row">
              <div className="col-12 mb-3">
                <select
                  className="form-select"
                  aria-label=".form-select-lg example"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-group row">
            <div className="col-12 mb-3 ">
              <select
                className="form-select"
                aria-label=".form-select-lg example"
                value={userdata.projectId}
                name="projectId"
                onChange={(e) => {
                  onChangeuserdata(e);
                }}
              >
                <option value="" selected>
                  Select project
                </option>
                {projects &&
                  projects.map((data, index) => (
                    <option value={data._id}>{data.name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-12  mb-3">
              <input
                type="text"
                className="form-control"
                id="staticEmail"
                name="taskDetails"
                onChange={(e) => onChangeuserdata(e)}
                placeholder="Daily Plan"
                value={userdata.taskDetails}
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-12 mb-3">
              <input
                type="number"
                className="form-control"
                id="staticEmail"
                name={
                  isModalforDailyPlan === `Today's Plan`
                    ? "estimatedHours"
                    : "totalHours"
                }
                onChange={(e) => onChangeuserdata(e)}
                placeholder={
                  isModalforDailyPlan === `Today's Plan` || isModalforDailyPlan === `Edit`
                    ? "Estimated Hours"
                    : "Total Hours"
                }
                value={
                  isModalforDailyPlan === `Today's Plan` || isModalforDailyPlan === `Edit`
                    ? userdata.estimatedHours
                    : userdata.totalHours
                }
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-12 ">
              <select
                className="form-select"
                aria-label=".form-select-lg example"
                value={userdata.taskType}
                name="taskType"
                onChange={(e) => {
                  onChangeuserdata(e);
                }}
              >
                <option value={"Bug"} selected>
                  Bug
                </option>
                <option value={"Feature"} selected>
                  Feature
                </option>
              </select>
            </div>
          </div>

          <div className="form-group row mt-3">
            <div className="col-12 ">
              <select
                className="form-select"
                aria-label=".form-select-lg example"
                value={userdata.taskStatus}
                name="taskStatus"
                onChange={(e) => {
                  onChangeuserdata(e);
                }}
              >
                <option value={"Pending"} selected>
                  Pending
                </option>
                <option value={"Completed"}>Completed</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default ReportCard;

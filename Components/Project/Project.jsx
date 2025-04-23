import Card from "../SmallComponent/Card";
import UserCard from "../SmallComponent/UserCard";
import Searchbar from "../SmallComponent/Searchbar";
import React from "react";
import { useState, useEffect } from "react";
import { ApiGet } from "../../helpers/API/ApiData";
import { useAtom } from "jotai";
import { userMainData, projectData, USER } from "../Jotai/atom";
import { LODING } from "../Jotai/atom.js";
import Loding from "../Loding/Loding";

const Project = () => {
  const [filterData, setfilterData] = useState([]);
  const [userfilterData, setuserfilterData] = useState([]);
  const [typeview, selectview] = useState("Project");
  const [usersData, setData] = useState({});
  const [mainData, setAllData] = useAtom(userMainData);
  const [allProjectData, setProjectData] = useAtom(projectData);
  const [getUSER, setUSER] = useAtom(USER);
  const [lodingState, setlodingState] = useState(false);
  const [selectProject, setselectProject] = useState();
  
  useEffect(() => {
    const USERDATA=JSON.parse(localStorage.getItem("userInfo"))
    setData(JSON.parse(localStorage.getItem("userInfo")));
    setUSER(JSON.parse(localStorage.getItem("userInfo")));
    if(USERDATA?.role==='admin'){
      handleGetProject();
      handleGetUser();
    }
  }, []);

  const handleGetProject = async () => {
    setlodingState(true);

    await ApiGet("project/find-all")
      .then((res) => {
        setfilterData(res?.data?.data);
        setProjectData(res?.data?.data);
        setlodingState(false);
        setselectProject(res?.data?.data[0])
      })
      .catch((err) => {
        setlodingState(false);
        console.log("error in post temp data!!");
      });
  };

  const handleGetUser = async () => {
    setlodingState(true);
    await ApiGet("user/find-all")
      .then((res) => {
        const data = res?.data?.users.filter((data) => data.isActive === true);
        setAllData(data);
        setlodingState(false);
        setuserfilterData(data);
      })
      .catch((err) => {
        console.log("error in post temp data!!");
        setlodingState(false);
      });
  };

  const searchvalue = (data) => {
    if (typeview === "Project") {
      if (data === "") {
        return setfilterData(allProjectData);
      }
      setfilterData(
        allProjectData.filter((value) => {
          return value.name.toLowerCase().includes(data.toLowerCase());
        })
      );
    } else {
      if (data === "") {
        return setuserfilterData(mainData);
      }
      setuserfilterData(
        mainData.filter((value) => {
          return value.userName.toLowerCase().includes(data.toLowerCase());
        })
      );
    }
  };


  return (
    <>
      {usersData && usersData.role === "admin" && (
        <div className="projectSection">
          <Loding display={lodingState} blure={true} />
          <div className="navbarProject">
            <Searchbar
              searchLine={(data) => searchvalue(data)}
              getData={() => {
                if (typeview === "Project") {
                  handleGetProject();
                } else {
                  handleGetUser();
                }
              }}
              selecttype={(data) => selectview(data)}
              userData={mainData ? mainData : []}
            />
          </div>
          <div className="projectShow">
            <div className="leftSection">
              <div className="userprojectData">
                {filterData.length!==0 &&
                  typeview === "Project" &&
                  filterData.map((data, key) => {
                    return (
                      <Card
                        carddata={data}
                        key={key}
                        getData={() => handleGetProject()}
                        userData={mainData}
                        onClick={(data2) => {
                          setselectProject(data2);
                        }}
                        selectProject={selectProject && selectProject}
                      />
                    );
                  })}
                {userfilterData &&
                  typeview === "User" &&
                  userfilterData.map((data, key) => {
                    return (
                      <UserCard
                        carddata={data}
                        key={key}
                        getData={() => handleGetUser()}
                      />
                    );
                  })}
              </div>
            </div>
            <div className="rightSection">
              <div className="userprojectShow">
                {filterData && typeview === "Project" && (
                  <>
                    {selectProject && (
                      <>
                        <div className="projectDis">
                          <div className="projectTitle">
                            {selectProject?.name}
                          </div>
                          <div className="description">
                            {selectProject?.description}
                          </div>
                          <div className="members">Members:</div>

                          <div className="assignmember">
                                <div className="assignmemberCard">
                            {selectProject.assign !== 0 &&
                              selectProject?.assign?.map((data) => {
                                return (
                                    <div className="assignmemberCard-name">
                                     <li> {data.firstName+' '+data.lastName}</li>
                                    </div>
                                );
                              })}
                              </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
                {userfilterData && typeview === "User" && <></>}
              </div>
            </div>
          </div>
        </div>
      )}

      {usersData && usersData.role !== "admin" && (
        <div className="lockImage">
          <img src="/image/homepage/lock.svg" alt="" className="lockImagecss" />
        </div>
      )}
    </>
  );
};

export default Project;

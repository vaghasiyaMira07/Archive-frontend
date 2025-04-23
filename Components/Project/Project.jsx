import Card from "../SmallComponent/Card";
import UserCard from "../SmallComponent/UserCard";
import Searchbar from "../SmallComponent/Searchbar";
import React from "react";
import { useState, useEffect } from "react";
import { ApiGet } from "../../helpers/API/ApiData";
import { ENDPOINTS } from "../../config/API/api-prod";
import { notification } from "antd";
import { useAtom } from "jotai";
import { userMainData, projectData, USER } from "../Jotai/atom";
import { LODING } from "../Jotai/atom.js";
import Loding from "../Loding/Loding";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [userData, setUserData] = useState(null);
  const [filterData, setfilterData] = useState([]);
  const [userfilterData, setuserfilterData] = useState([]);
  const [typeview, selectview] = useState("Project");
  const [mainData, setAllData] = useAtom(userMainData);
  const [allProjectData, setProjectData] = useAtom(projectData);
  const [getUSER, setUSER] = useAtom(USER);
  const [lodingState, setlodingState] = useState(false);
  const [selectProject, setselectProject] = useState();
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUserData(userInfo);
      handleGetProject();
      handleGetUser();
    }
  }, []);

  const handleGetProject = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching projects...');
      
      const response = await ApiGet(ENDPOINTS.PROJECTS);
      console.log('Projects response:', response);
      
      if (response.data) {
        setProjects(response.data);
        setfilterData(response.data);
        setProjectData(response.data);
        setlodingState(false);
        setselectProject(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.response?.data?.message || 'Failed to fetch projects');
      notification.error({
        message: 'Error',
        description: 'Failed to fetch projects. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetUser = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users...');
      
      const response = await ApiGet(ENDPOINTS.USER_PROFILE);
      console.log('Users response:', response);
      
      if (response.data) {
        setUsers(response.data);
        setAllData(response.data);
        setuserfilterData(response.data);
        setlodingState(false);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch users. Please try again.',
      });
    } finally {
      setLoading(false);
    }
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

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {userData && userData.role === "admin" && (
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
                    {selectedProject && (
                      <>
                        <div className="projectDis">
                          <div className="projectTitle">
                            {selectedProject?.name}
                          </div>
                          <div className="description">
                            {selectedProject?.description}
                          </div>
                          <div className="members">Members:</div>

                          <div className="assignmember">
                                <div className="assignmemberCard">
                            {selectedProject.assign !== 0 &&
                              selectedProject?.assign?.map((data) => {
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

      {userData && userData.role !== "admin" && (
        <div className="lockImage">
          <img src="/image/homepage/lock.svg" alt="" className="lockImagecss" />
        </div>
      )}
    </>
  );
};

export default Project;

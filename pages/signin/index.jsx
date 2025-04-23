import { useState } from "react";
import { useRouter } from "next/router";
import { ApiDelete, ApiGet, ApiPost } from "../../helpers/API/ApiData";
import Loding from '../../Components/Loding/Loding'
import { notification } from 'antd';
import { ENDPOINTS } from "../../config/API/api-prod";

const index = () => {
  const router = useRouter();
  const [lodingState, setlodingState]=useState(false);
  
  const [getData, setgetData] = useState({
    email: "",
    password: "",
  });

  const fordata = (e) => {
    if(e.target.name==='email') {return  setgetData((data) => {
      return { ...data, [e.target.name]: (e.target.value).toLowerCase()};
    });}
    setgetData((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const SubmitData = async (e) => {
    setlodingState(true)
    e.preventDefault();
    try {
      const response = await ApiPost(ENDPOINTS.LOGIN, getData);
      if (response.data) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        router.push("/dashboard");
        notification.open({
          message: 'Sign In',
          description: "Sign in Successful,"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      notification.open({
        message: 'Error',
        description: error.response?.data?.message || "Login failed. Please try again.",
      });
      localStorage.removeItem("userInfo");
    } finally {
      setlodingState(false)
    }
  };

  return (
    <>
    <Loding display={lodingState} blure={true}/>
      <div className="loginpage">
        <div className="loginpage-img">
          <img
            src="/image/homepage/signup.svg"
            alt="sda"
            className="loginpage-img-logo"
          />
        </div>
        <div className="loginpage-section">
          <form className="loginpage-section-mainform">
            <div className="mb-3">
              <input
                type="email"
                className="form-control inputField"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email"
                name="email"
                value={getData.email}
                onChange={(e) => fordata(e)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control inputField"
                id="exampleInputPassword1"
                placeholder="Password"
                name="password"
                value={getData.password}
                onChange={(e) => fordata(e)}
                required
              />
            </div>
            <button className="loginbtn" onClick={(e) => SubmitData(e)}>
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default index;

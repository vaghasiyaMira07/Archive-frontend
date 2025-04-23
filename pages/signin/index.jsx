import { useState } from "react";
import { useRouter } from "next/router";
import { ApiPost } from "../../helpers/API/ApiData";
import { ENDPOINTS } from "../../config/API/api-prod";
import Image from "next/image";
import { notification } from 'antd';
import Loding from '../../Components/Loding/Loding'

const SignIn = () => {
  const router = useRouter();
  const [lodingState, setlodingState]=useState(false);
  
  const [getData, setGetData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setGetData({
      ...getData,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitData = async (e) => {
    setlodingState(true)
    e.preventDefault();
    try {
      const response = await ApiPost(ENDPOINTS.LOGIN, getData);
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        router.push("/dashboard");
        notification.open({
          message: 'Sign In',
          description: "Sign in Successful,"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
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
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={200}
            height={100}
            className="loginpage-img-logo"
          />
        </div>
        <div className="loginpage-section">
          <form className="loginpage-section-mainform">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={getData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={getData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="loginbtn" onClick={(e) => SubmitData(e)}>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;

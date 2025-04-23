import { useState } from "react";
import { useRouter } from "next/router";
import { ApiPost } from "../../helpers/API/ApiData";
import Loding from '../../Components/Loding/Loding'
import { notification } from 'antd';
import { ENDPOINTS } from "../../config/API/api-prod";
import Image from 'next/image';

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
    setlodingState(true);
    e.preventDefault();
    try {
      console.log('Attempting login with:', getData);
      console.log('Login URL:', ENDPOINTS.LOGIN);
      
      const response = await ApiPost(ENDPOINTS.LOGIN, getData);
      console.log('Login response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        
        notification.success({
          message: 'Sign In Successful',
          description: "Welcome back!",
          duration: 3,
        });
        
        router.push("/dashboard");
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Login error details:", error.response || error);
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || "Please check your email and password and try again.",
        duration: 4,
      });
    } finally {
      setlodingState(false);
    }
  };

  return (
    <>
    <Loding display={lodingState} blure={true}/>
      <div className="loginpage">
        <div className="loginpage-img">
          <div style={{ position: 'relative', width: '200px', height: '100px' }}>
            <Image
              src="https://archive-backend-phi.vercel.app/logo.png"
              alt="Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
        <div className="loginpage-section">
          <form className="loginpage-section-mainform" onSubmit={SubmitData}>
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
            <button 
              type="submit" 
              className="loginbtn"
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default index;

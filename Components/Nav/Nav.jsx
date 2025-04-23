import { useRouter } from "next/router";
import Loding from '../Loding/Loding';
import { useState } from "react";

const Nav = ({page,onChangeNav }) => {
  const router = useRouter();
  const [lodingState, setlodingState]= useState(false);
  const [navSize, setnavSize]= useState(false);


const logout=()=>{
      setlodingState(true)
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
       router.push('/')
      setlodingState(false)

}

const clickdesk=(name)=>{
page(name)
}

const onNavbar=()=>{
  setnavSize(!navSize)
  onChangeNav(!navSize)
}

  return (
    <>
    <Loding display={lodingState} blure={true}/>

      <div className={navSize?"navbarcss navbig":"navbarcss"}>
          <div onClick={()=>{onNavbar()}} className='iconMain'>
            <img
              src="/image/homepage/Rectangle.png"
              alt="icon"
              className="imageIcon mt-2"
            />
          </div>

        <div className={'navbarItm'}>
          <img
            src="/image/homepage/layers.svg"
            alt="icon"
            className="imageIcon mt-3"
            onClick={() =>clickdesk('project')}
            />
            <div className="menuName mt-3"   onClick={() =>clickdesk('project')}>Project</div>
        </div>
        <div className={'navbarItm'}>
          <img
            src="/image/homepage/member.svg"
            alt="icon"
            className="imageIcon"
            onClick={() =>clickdesk('Chart')}


          />
            <div className="menuName"  onClick={() =>clickdesk('Chart')}>Chart</div>

        </div>
        <div className={'navbarItm'}>
          <img
            src="/image/homepage/notification.svg"
            alt="icon"
            className="imageIcon"
            onClick={() =>clickdesk('notification')}
            

          />
          <div className="notification_active"></div>
            <div className="menuName"  onClick={() =>clickdesk('notification')}>Notification</div>

        </div>
        <div className={'navbarItm'}>
          <img
            src="/image/homepage/ballot.svg"
            alt="icon"
            className="imageIcon"
            onClick={() =>clickdesk('task')}

          />
            <div className="menuName"  onClick={() =>clickdesk('task')}>Report</div>

        </div>
        <div className={'navbarItm'}>
          <img
            src="/image/homepage/setting.svg"
            alt="icon"
            className="imageIcon"
            onClick={() =>clickdesk('setting')}
          />
            <div className="menuName"  onClick={() =>clickdesk('setting')}>Setting</div>

        </div>

        <div className="imageIcon2" >
        <div className={'navbarItm'}>

          <img
            src="/image/homepage/log-out.svg"
            alt="icon"
            className="imageIcon"
            onClick={() =>logout()}
          />
          <div className="menuName" onClick={() =>logout()}>Sign Out </div>
        </div>
        </div>

      </div>
    </>
  );
};
export default Nav;

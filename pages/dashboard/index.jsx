import { useEffect, useState } from 'react';
import Nav from "../../Components/Nav/Nav"
import { useRouter } from "next/router";
import Project from '../../Components/Project/Project'
import Setting from '../../Components/Setting/Setting'
import Card from '../../Components/SmallComponent/Card'
import Searchbar from '../../Components/SmallComponent/Searchbar'
import localStore from "../../utils/localstore.util.js";
import Report from '../../Components/Report/Report'
import Chart from '../../Components/Chart/Chart'
import Notification from '../../Components/Notification/Notification'


const index = () => {
    const router = useRouter();
    const [pages, setpage] = useState('project');
    const [navSize, setnavSize]= useState(false);


    useEffect(() => {
        const locstg = window.localStorage.getItem("userInfo");
        if (!locstg) {
            router.push("/signin");
        }
    });
        useEffect(()=>{
        setpage('project')
        },[])


    return (   <>
      <Nav page={data=>setpage(data) } onChangeNav={(data)=>{setnavSize(data)}}/>
      <div className={navSize?"dashboardpage navbigPadding":"dashboardpage"}>
      {pages==='project'&&<Project/>}
      {pages==='setting'&&<Setting/>}
      {pages==='task'&&<Report/>}
      {pages==='Chart'&&<Chart/>}
      {pages==='notification'&&<Notification/>}



      </div>
    </>
    );
}

export default index
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {userMainData ,selectData ,USER,todayPlanandStatus} from '../Jotai/atom'
import { ApiPost ,ApiGet} from '../../helpers/API/ApiData';
import { Modal, Button, Form, Input,notification } from 'antd';

const DateSection = () => {
    const todayDate = new Date()

    const [userData,setuserData]=useAtom(userMainData);
    const [getDate,setgetDate]=useAtom(selectData);
    const [getUSER,setUSER]=useAtom(USER);
    const [planandStatus,setplanandStatus]=useAtom(todayPlanandStatus);


    useEffect(()=>{
        setgetDate({date:todayDate.getDate(),month:todayDate.getMonth(),year:todayDate.getFullYear(),userData:getUSER.id})
    },[])
    const [alldays,setAlldays]=useState([]);
    const monthz =['January','February','March','April','May','June','July','August','September','October','November','December' ]
    const daysName =['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }
    var years = range(2020, 2050);

    const totalDate=()=>{
        var firstDay = new Date(getDate.year, getDate.month, 1);
        var lastDay = new Date(getDate.year, getDate.month + 1, 0);
        var days = range(firstDay.getDate(), lastDay.getDate());
        var firstdayName = new Date(getDate.year, getDate.month, 1).getDay()-1;
        const Alldays = days.map((data)=>{
            firstdayName=firstdayName+1
            if(firstdayName===7){
                firstdayName=0;
            }
            return {day:data,name:daysName[firstdayName]}
        })
        setAlldays(Alldays)
        }

    useEffect(()=>{
        totalDate()
    },[getDate])

    useEffect(() => {
        handleGetUser()
    }, []);

    const handleGetUser = async () => {
        await ApiGet("user/find-all")
          .then((res) => {
            const data = res?.data?.users.filter((data) => data.isActive === true);
            setuserData(data);
          })
          .catch((err) => {
            console.log("error in post temp data!!");
          });
      };

    const getDatechange=(e)=>{
        if(e.target.name==='userData'){
          return  setgetDate((monthdata)=>{
                return {...monthdata,[e.target.name]:e.target.value}
            })
        }
        setgetDate((monthdata)=>{
            return {...monthdata,[e.target.name]:parseInt(e.target.value)}
        })
    }

    const setDateinSection=(data)=>{
        setgetDate((monthdata)=>{
            return {...monthdata,'date':parseInt(data)}
        })
    }

    // Api Post
    const getData = () => {
        if(getDate.userData===""){
            return
        }
        const plandata={
        "date": getDate
             }
        ApiPost(`report/selectedreport`, plandata)
          .then((res) => {
             if (res.status === 200) {
                setplanandStatus({plan:res?.data?.plan || [],status:res?.data?.status || [],id:res?.data?._id || ''})
              if (res.data.msg) {
                return notification.open({
                    message: 'Error',
                    description: res.data.msg,
                  });
              }
            }
          })
          .catch((err) =>notification.open({
            message: 'Error',
            description: "err",
          }));
      };
      useEffect(()=>{
        getData();
      },[getDate])


return (
    <>
      <div className="DateSection">
            <div className="mainSection">
                <div className="yearSelector">
                <div class=" formField">
                        <label for="inputState" class="form-label">Year</label>
                        <select id="inputState" class="form-select" name='year' onChange={(e)=>getDatechange(e)}>
                        {years.map((data,key)=>{
                            return(<option key={key} selected={todayDate.getFullYear()===data?true:false} value={data}>{data}</option>)
                        })}
                        </select>
                    </div>

                    <div class=" formField">
                        <label for="inputState" class="form-label" >Month</label>
                        <select id="inputState" class="form-select" name='month' onChange={(e)=>getDatechange(e)} >
                        {monthz.map((data,index)=>{
                            return(<option selected={todayDate.getMonth()===index?true:false} key={index} value={index}>{data}</option>)
                        })}
                        </select>
                    </div>

                    <div class=" formField">
                        <label for="inputState" class="form-label">User</label>
                        <select id="inputState" class="form-select" name='userData' onChange={(e)=>getDatechange(e)}>
                        {userData && userData.map((data,key)=>{
                            return(<option key={key} value={data._id} selected={getUSER.id===data._id?true:false}  disabled={getUSER.role==='admin'?false:true}>{data.userName}</option>)
                        })}
                        </select>
                    </div>
                </div>

                <div className="dateShowBox">
                    <div className='dateShowBox-data'>
                    {alldays && alldays.map((data,key)=>{
                        return(<div className={(getDate.date===data.day)?"dateBox-active dateBox":'dateBox'} key={key} onClick={()=>setDateinSection(data.day)}>
                        <p className="dayName">{data.name}</p>
                        <p className="dateNumber">{data.day}</p>
                    </div>
                        )
                    })}
                    </div>
                </div>
            </div>
      </div>
    </>
  );
};
export default DateSection;

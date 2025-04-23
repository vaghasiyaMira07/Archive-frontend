import { Table, Space } from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';
import { ApiGet } from '../../helpers/API/ApiData';
import { getUserInfo } from '../../utils/user.util.js'
import { useState,useEffect } from 'react';
import { Modal, Button, Form, Input,notification } from 'antd';
import { ApiPost } from '../../helpers/API/ApiData';
import { useAtom } from 'jotai';
import {userMainData} from '../Jotai/atom'
import DateSection from '../mainComponents/DateSection'
import ReportCard from '../mainComponents/ReportCard';

const Report=()=>{
    return (
      <>
        <div className="Reportpage">
          <div className="heading textcolor">Today's Plan</div>
          <DateSection/>
          <ReportCard/>
        </div>
      </>
    );
}

export default Report;
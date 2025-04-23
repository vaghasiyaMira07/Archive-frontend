import {atom} from 'jotai'

export const USER = atom()
export const userMainData =atom([])
export const projectData =atom([])
export const selectData=atom({date:0,month:0,year:0,userData:''})
export const todayPlanandStatus=atom()


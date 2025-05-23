import { setModal } from '@/redux/reducer/ModalReduce';
import store from '@/redux/store';
import React from 'react'

type Props = {
  type: string;
  msg: string,
  open: boolean
}
const NotificationModal = ({ type, msg, open }: Props) => {

  switch (type) {
    case "notification":
      return (
        <div className={`absolute top-0 h-12 bg-slate-200 w-full flex flex-col justify-center text-center shadow ${open ? "translate-y-[100%]" : "translate-y-[0%]"}`}>
          {msg}
        </div>
      )
    case "confirm":
      return (
        <div className={` absolute top-0 h-12 bg-slate-200 w-full shadow ${open ? "translate-y-[100%]" : "translate-y-[0%]"}`}>
          <div className='flex w-max m-auto gap-4 h-full'>

            <div className={`h-full flex flex-col justify-center text-center  `}>
              {msg}
            </div>
            <div className={`h-full flex flex-col justify-center text-center font-bold cursor-pointer `} onClick={() => store.dispatch(setModal({ open: false, msg: "", type: "", value: "yes" }))}>
              はい
            </div>
            <div className={`h-full flex flex-col justify-center text-center font-bold cursor-pointer`} onClick={() => store.dispatch(setModal({ open: false, msg: "", type: "", value: "no" }))}>
              いええ
            </div>
          </div>
        </div>
      )

    default: return null
  }
}

export default NotificationModal
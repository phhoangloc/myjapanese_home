'use client'
import { ApiItem } from "@/api/client";
import LoginCard from "@/components/card/loginCard";
import Header from "@/components/layout/header";
import { UserType } from "@/redux/reducer/UserReduce";
import store from "@/redux/store";
import { useEffect, useState } from "react";

export type BlogType =
  {
    archive: string
    censor: boolean
    content: string,
    createdAt: Date,
    hostId: number,
    host: { id: number, username: string },
    id: number,
    slug: string,
    updateDate: string
  }

export default function Home() {

  const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

  const update = () => {
    store.subscribe(() => set_currentUser(store.getState().user))
  }

  useEffect(() => {
    update()
  }, [])

  const [_blogs, set_blogs] = useState<BlogType[]>([])
  const getBlog = async (archive: string) => {
    const result = await ApiItem({ archive })
    if (result.success) {
      set_blogs(result.data)
    } else {
      set_blogs([])
    }
  }

  useEffect(() => {
    getBlog("blog")
  }, [])

  const [_read, set_read] = useState<boolean>(false)
  const [_index, set_index] = useState<number>(-1)

  return (
    _currentUser.id ?
      <div className="min-h-screen ">
        <Header />
        <div className="bg-slate-50">
          <div className="w-11/12 max-w-(--md) m-auto min-h-screen">
            <div className="h-12"></div>
            <div className="text-2xl text-sky-600 font-bold h-12 flex flex-col justify-center">Blog</div>
            {_blogs.length ?
              _blogs.map((blog, index) =>
                <div key={index} className=" shadow border border-slate-300 rounded mt-4">
                  <div className="h-12 flex flex-col justify-center font-bold text-sky-600 border-b border-slate-300 px-2 bg-slate-50">{blog.host.username}</div>
                  <div className={`${_read && index === _index ? "" : "line-clamp-6"} min-h-36 px-2 pt-2 md:px-4 md:pt-4 bg-white dangerous_box text-justify`} dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                  <div className="h-12 flex flex-col justify-center text-center text-sm cursor-pointer bg-white" onClick={() => { set_read(true); set_index(index) }}>read more</div>
                  <div className="h-12 flex justify-between border-t border-slate-300">
                    <div className="w-1/2 text-center flex flex-col justify-center cursor-pointer">like</div>
                    <div className="bg-slate-300 w-[1px] h-1/2 my-auto"></div>
                    <div className="w-1/2 text-center flex flex-col justify-center cursor-pointer">comment</div>
                  </div>
                </div>) :
              <div>まだブログはありません</div>
            }
          </div>
        </div>
      </div> :
      <div className="flex flex-col justify-center min-h-screen bg-slate-100">
        <LoginCard />
      </div>
  );
}

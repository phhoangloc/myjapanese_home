'use client'
import { ApiItem } from '@/api/client'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../input/input';
import TextArea from '../input/textarea';
import { Button } from '../button/button';
import { ApiCreateItem, ApiItemUser, ApiUpdateItem } from '@/api/user';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';
import { DividerSelect } from '../input/divider';
import Add from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import moment from 'moment';
import ModalCard from '../card/modalCard';

type Props = {
    archive: string,
    slug: string
}
type ItemType = {
    id: number,
    name: string,
    username: string,
    slug: string,
    content: string,
    active: boolean,
    position: string,
    email: string,
}
export const DetailBlog = ({ archive, slug }: Props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const [_item, set_item] = useState<ItemType>()
    const getBlog = async (archive: string, slug: string) => {
        const result = await ApiItem({ archive, slug })
        if (result.success) {
            set_item(result.data[0])
        } else {
            set_item(undefined)
        }
    }

    useEffect(() => {
        getBlog(archive, slug)
    }, [archive, slug])

    const toPage = useRouter()

    const [_id, set_id] = useState<number>(0)
    const [_slug, set_slug] = useState<string>("")
    const [_newSlug, set_newSlug] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    useEffect(() => {
        if (_item) {
            set_id(_item.id)
            set_content(_item.content)
            set_slug(_item.slug)
        }
    }, [_item])
    const body = {
        slug: _newSlug || _slug,
        content: _newContent || _content
    }

    const CreateBlog = async (position: string, archive: string, body: {
        slug: string;
        content: string;
    }) => {
        const result = await ApiCreateItem({ position, archive }, body)
        console.log(result)
    }
    const UpdateBlog = async (position: string, archive: string, id: number, body: {
        slug: string;
        content: string;
    }) => {
        const result = await ApiUpdateItem({ position, archive, id }, body)
        if (result.success) {
            toPage.push("/admin/blog")
        }
    }
    return (
        <div className='w-full max-w-(--md)'>
            <div className='h-12 flex flex-col justify-center uppercase font-bold border-b text-sky-600 border-slate-300'>{archive}</div>
            <div className="h12"></div>
            <div className='h-12 flex'>
                <AddIcon className='!w-12 !h-12 p-2 my-1 cursor-pointer border rounded border-slate-300 bg-white' onClick={() => toPage.push("blog/_news")} />
            </div>
            <div className='h-4'>
            </div>
            <div>
                <div className='flex flex-col justify-end text-sm'>
                    slug
                </div>
                <Input value={_slug} onchange={(v) => set_newSlug(v)} />
            </div>
            <div>
                <div className='flex flex-col justify-end text-sm'>
                    content
                </div>
                <TextArea value={_content} onchange={(v) => set_newContent(v)} />
            </div>
            <Button name={slug !== "_news" ? "save" : "create"} onClick={() => slug !== "_news" ? UpdateBlog(_currentUser.position, archive, _id, body) : CreateBlog(_currentUser.position, archive, body)} sx='block !mx-auto !my-4' />
        </div>
    )
}
export const DetailUser = ({ archive, slug }: Props) => {
    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const toPage = useRouter()
    const [_item, set_item] = useState<ItemType>()
    const getBlog = async (position: string, archive: string, id: number) => {
        const result = await ApiItemUser({ position, archive, id })
        if (result.success) {
            set_item(result.data[0])
        } else {
            set_item(undefined)
        }
    }

    useEffect(() => {
        getBlog(_currentUser.position, archive, Number(slug))
    }, [archive, slug, _currentUser.position])

    const [_username, set_username] = useState<string>("")
    const [_password, set_password] = useState<string>("")
    const [_email, set_email] = useState<string>("")
    // const [_active, set_active] = useState<boolean>(true)

    const body = {
        username: _username,
        password: _password,
        email: _email,
        active: true,
    }
    const CreateUser = async (position: string, archive: string, body: {
        username: string;
        password: string;
        email: string;
    }) => {
        const result = await ApiCreateItem({ position, archive }, body)
        if (result.success) {
            toPage.push("/admin/user")
        }
    }
    return (
        slug !== "_news" ?
            <div className='py-2 flex flex-col gap-2'>
                <div className='w-11/12 m-auto bg-white h-24 flex flex-col justify-center shadow px-2 rounded'>
                    <p>user: <b>{_item?.username}</b></p>
                </div>

                <div className='w-11/12 m-auto bg-white h-12 flex flex-col justify-center shadow px-2 rounded'>
                    email : {_item?.email}
                </div>
                <div className='w-11/12 m-auto bg-white h-12 flex flex-col justify-center shadow px-2 rounded'>
                    position : {_item?.position}
                </div>
                <div className='w-11/12 m-auto bg-white h-12 flex flex-col justify-center shadow px-2 rounded'>
                    active : {_item?.active ? "active" : "non-active"}
                </div>
            </div> :
            <div className='py-2 flex flex-col gap-2'>
                <div className="w-11/12 m-auto bg-slate-50 p-2 shadow">
                    <div className='font-bold text-center p-6'>create new user</div>
                    <div className="flex">
                        <div className='w-24 flex flex-col justify-center'>username</div>
                        <Input value={_username} onchange={(v) => set_username(v)} />
                    </div>
                    <div className="flex">
                        <div className='w-24 flex flex-col justify-center'>password</div>
                        <Input value={_password} onchange={(v) => set_password(v)} />
                    </div>
                    <div className="flex">
                        <div className='w-24 flex flex-col justify-center'>email</div>
                        <Input value={_email} onchange={(v) => set_email(v)} />
                    </div>

                    <Button name="create" onClick={() => CreateUser(_currentUser.position, "user", body)} sx='!my-4 !mx-auto block'></Button>
                </div>
            </div>
    )
}
type questionTypeBody = {
    archive: string;
    part: string;
    mondai: string;
    question?: string;
    choose?: string;
    answer?: string;
    questionTran?: string;
    answerTran?: string;
    explain?: string;
    exam?: string;
}

type ExamType = {
    exam: {
        id: number
        createdAt: Date
    },
    exer: {
        id: number
    }
}
export const Detail = ({ archive, slug }: Props) => {

    const searchParams = useSearchParams()
    const part = searchParams.get("part") || ""

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])

    const [_loading, set_loading] = useState<boolean>(true)
    const [_id, set_id] = useState<number>(0)
    const [_exams, set_exams] = useState<ExamType[]>([])
    const [_isExamsOpen, set_isExamsOpen] = useState<boolean>(false)
    const [_part, set_part] = useState<string>(part)
    const [_mondai, set_mondai] = useState<string>("")
    const [_question, set_question] = useState<string>("")
    const [__question, set__question] = useState<string>("")
    const [_choose, set_choose] = useState<string>("")
    const [_explain, set_explain] = useState<string>("")
    const [__explain, set__explain] = useState<string>("")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_chooseArr, set_chooseArr] = useState<any[]>([])

    const [_chooseIndex, set_chooseIndex] = useState<number>(-1)
    const [_chooseQuestion, set_chooseQuestion] = useState<string>("")
    const [_answerA, set_answerA] = useState<string>("")
    const [_answerB, set_answerB] = useState<string>("")
    const [_answerC, set_answerC] = useState<string>("")
    const [_answerD, set_answerD] = useState<string>("")
    const [_chooseAnswer, set_chooseAnswer] = useState<string>("")

    const getItem = async (position: string, archive: string, part: string, id: string) => {
        set_loading(true)
        const result = await ApiItemUser({ position, archive, part, id: Number(id) })
        console.log(result)
        if (result.success && result.data[0]) {
            set_loading(false)
            set_id(result.data[0].id)
            set_exams(result.data[0].exam)
            set_mondai(result.data[0].mondai)
            set_question(result.data[0].question)
            set_chooseArr(JSON.parse(result.data[0].choose))
            set_choose(result.data[0].choose)
            set_explain(result.data[0].explain)
        } else {
            set_loading(false)
        }
    }

    useEffect(() => {
        getItem(_currentUser.position, archive, part, slug !== "_news" ? slug : "-1")
    }, [archive, slug, _currentUser.position, part])

    const toPage = useRouter()

    const body: questionTypeBody = {
        archive: archive,
        part: part,
        mondai: _mondai,
        question: __question,
        choose: _choose,
        explain: __explain
    }

    const upload = async (position: string, archive: string, id: number, body: questionTypeBody,) => {
        const result = await ApiUpdateItem({ position, archive, id }, body)
        if (result.success) {
            toPage.push("/admin/" + body.archive + "?part=" + body.part)
        }
    }
    const create = async (position: string, archive: string, body: questionTypeBody,) => {
        const result = await ApiCreateItem({ position, archive }, body)
        if (result.success) {
            toPage.push("/admin/" + body.archive + "?part=" + body.part)
        }
    }

    const makeQuestion = (index: number) => {
        set_chooseArr((arr) => [...arr, {
            id: (index),
            name: "question " + Number(_chooseArr.length + 1),
            question: "",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            answer: ""
        }])
    }


    const inputItem = (t: "id" | "question" | "answerA" | "answerB" | "answerC" | "answerD" | "name" | "answer", v: string, index: number) => {
        const newArr = _chooseArr
        const object: Record<string, string | number> = newArr[index]
        const prop: keyof typeof object = t;
        object[prop] = v
        set_chooseArr(newArr)
    }

    const deleteQuestion = (index: number) => {
        const newArr = _chooseArr
        const newArrFilter = newArr.filter((a, i) => i !== index)
        set_chooseArr(newArrFilter)
        set_chooseIndex(-1)
    }

    useEffect(() => {
        set_choose(JSON.stringify(_chooseArr))
    }, [_chooseAnswer, _answerA, _answerB, _answerC, _answerD, _chooseQuestion, _chooseArr])

    useEffect(() => {
        if (_chooseArr.length) {
            set_chooseIndex(_chooseArr.length - 1)
        }
    }, [_chooseArr.length])

    useEffect(() => {
        if (part) {
            set_part(part)
        }
    }, [part])

    return (
        _loading ?
            < div className="h-11  bg-white px-2 shadow-md rounded flex flex-col justify-center gap-1 text-center " >
                loading...
            </div> :
            <div className='flex flex-col gap-1'>
                <div className="h-11  bg-white px-2 shadow-md rounded cursor-pointer" onClick={() => toPage.push("/" + archive + "/-1")}>
                    <div className="flex">
                        <AddIcon className='!w-11 !h-11 p-2' />
                        <div className='flex flex-col justify-center'>new question of {archive}</div>
                    </div>
                </div>
                < div className="min-h-full  bg-white px-2 shadow-md rounded  flex flex-col gap-1 " >
                    <div className="h-11 flex flex-col justify-end font-bold">Part</div>
                    <DividerSelect data={[{ id: 0, name: "chisiki" }, { id: 1, name: "dokkai" }, { id: 2, name: "chokai" }]} name={_part} valueReturn={(v) => set_part(v.name)} key={_chooseArr.length} />
                    <div className="h-11 flex flex-col justify-end font-bold">Mondai</div>
                    <Input onchange={(v) => set_mondai(v)} value={_mondai} />

                    <div className="h-11 flex flex-col justify-end font-bold">Reading</div>
                    <TextArea onchange={(v) => set__question(v)} value={_question} />

                    <div className="h-11 flex flex-col justify-end font-bold">Q&A</div>
                    <div className="flex">
                        <DividerSelect data={_chooseArr} name={"question " + Number(_chooseIndex + 1)} valueReturn={(v) => set_chooseIndex(v.id)} key={_chooseArr.length} />
                        <Add className='!h-12 !w-12 p-3' onClick={() => { makeQuestion(_chooseArr[_chooseArr.length - 1] ? _chooseArr[_chooseArr.length - 1].id + 1 : 0) }} />
                        {_chooseIndex !== -1 ? <RemoveIcon className='!h-12 !w-12 p-3' onClick={() => deleteQuestion(_chooseIndex)} /> : null}
                    </div>

                    {
                        _chooseIndex !== -1 ?
                            < div >
                                <p>question {_chooseIndex + 1}</p>
                                <Input onchange={(v) => { inputItem("question", v, _chooseIndex); set_chooseQuestion(v) }} value={_chooseArr[_chooseIndex].question} key={"q" + _chooseIndex} />
                                <p>Answer A</p>
                                <Input onchange={(v) => { inputItem("answerA", v, _chooseIndex); set_answerA(v) }} value={_chooseArr[_chooseIndex].answerA} key={"aa" + _chooseIndex} />
                                <p>Answer B</p>
                                <Input onchange={(v) => { inputItem("answerB", v, _chooseIndex); set_answerB(v) }} value={_chooseArr[_chooseIndex].answerB} key={"ab" + _chooseIndex} />
                                <p>Answer C</p>
                                <Input onchange={(v) => { inputItem("answerC", v, _chooseIndex); set_answerC(v) }} value={_chooseArr[_chooseIndex].answerC} key={"ac" + _chooseIndex} />
                                <p>Answer D</p>
                                <Input onchange={(v) => { inputItem("answerD", v, _chooseIndex); set_answerD(v) }} value={_chooseArr[_chooseIndex].answerD} key={"ad" + _chooseIndex} />
                                <DividerSelect data={[{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" },]} name={_chooseArr[_chooseIndex].answer || "answer correct"} valueReturn={(v) => { inputItem("answer", v.name ? v.name : _chooseArr[_chooseIndex].answer, _chooseIndex); set_chooseAnswer(v.name ? v.name : _chooseArr[_chooseIndex].answer) }} key={"a" + _chooseIndex} />
                            </div> :
                            null
                    }
                    <div className="h-11 flex flex-col justify-end font-bold">Explain</div>

                    <TextArea onchange={(v) => set__explain(v)} value={_explain} />
                    <div className="h-11  font-bold flex">
                        <div className='flex flex-col justify-end'>In Exam</div>
                        <AddIcon className='!w-6 !h-6 mt-auto mb-1 mx-2 cursor-pointer' onClick={() => set_isExamsOpen(!_isExamsOpen)} />
                    </div>
                    <div className={`overflow-y-scroll h-60 border border-slate-300 ${_isExamsOpen ? "block" : "hidden"}`}>
                        <ModalCard archive='exam' sendout={(v) => console.log(v)} />
                    </div>
                    <div className='h-max border border-slate-300 even:bg-slate-50'>
                        {
                            _exams.map((exam, index) =>
                                <div key={index} className='h-12 flex justify-between px-2'>
                                    <div className='flex flex-col justify-center'>{moment(exam.exam.createdAt).format("YYYY年MM月DD日")}</div>
                                    <RemoveIcon className='!w-12 !h-12 p-2' />
                                </div>)
                        }
                    </div>


                    <Button name={_id && _id !== -1 ? "save" : "create"} sx='bg-slate-200 !text-black' onClick={() => _id && _id !== -1 ? upload(_currentUser.position, archive, _id, body) : create(_currentUser.position, archive, body)}></Button>
                </div >
            </div >


    )

}
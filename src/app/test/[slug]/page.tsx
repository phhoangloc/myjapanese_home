'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import { ApiItemUser, ApiUpdateItem } from '@/api/user'
import { ChooseType, ExamType, ExerciseType, ItemType } from '@/components/admin/detail'
import moment from 'moment'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Button } from '@/components/button/button'
import { ModalType, setModal } from '@/redux/reducer/ModalReduce'

const Page = () => {
    const params = useParams<{ slug: string }>()
    const slug = params.slug

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const [_currentModal, set_currentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
        store.subscribe(() => set_currentModal(store.getState().modal))
    }

    useEffect(() => {
        update()
    }, [])
    const [_item, set_item] = useState<ItemType>()
    const [_exer, set_exer] = useState<ExerciseType[]>([])
    const [_score, set_score] = useState<number>(0)
    const getItem = async (position: string, archive: string, id: number) => {
        const result = await ApiItemUser({ position, archive, id })
        console.log(result)
        if (result.success && result.data[0]) {
            set_item(result.data[0])
            set_score(result.data[0].homeworkerdone.filter((hw: { userId: number, score: number }) => hw.userId === _currentUser.id)[0].score)
            set_exer(result.data[0].exercise.map((exerItem: ExamType) => exerItem.exer))
        } else {
            set_item(undefined)
            set_exer([])
        }
    }

    useEffect(() => {
        getItem(_currentUser.position, "exam", Number(slug))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_currentUser.position, slug])

    const [_answer, set_answer] = useState<{ stt: number, ans: string }[]>([])
    const [, set_k] = useState<number>(0)
    const [sumRightAnswer, set_sumRightAnswer] = useState<number>(-1)
    const [_isEnd, set_isEnd] = useState<boolean>(false)

    const selectAnswer = (ans: string, index: number) => {
        const new_answer = _answer
        new_answer[index] = { stt: index + 1, ans: ans }
        set_answer(new_answer)
        set_k(n => n + 1)
    }



    useEffect(() => {
        const onHandleSubmit = async (_user_answer: { stt: number, ans: string }[]) => {
            const questions = _exer.map((exerItem) => { return { choose: JSON.parse(exerItem.choose) } })
            const answers = questions.map((question => question.choose[0]))
            const rightAnswers = answers.map((ans, index) => { return { stt: index + 1, answer: ans.answer } })
            const result = rightAnswers.filter((rAns, index) => rAns.answer === _user_answer[index]?.ans)
            set_sumRightAnswer(result.length)
            const queryResult = await ApiUpdateItem({ position: "user", archive: "exam_submit", id: _item?.id }, { score: result.length })
            if (queryResult.success) {
                set_isEnd(true)
            }
        }
        if (_currentModal.value === "yes") {
            onHandleSubmit(_answer)
        }
    }, [_answer, _currentModal.value, _exer, _item?.id])

    const toPage = useRouter()

    return (
        <div>
            <div className="w-full max-w-(--lg) m-auto">
                <div className="h-12"></div>
                {
                    _score === 0 ?
                        _exer.length ?
                            <div className=' bg-white py-4'>
                                <div className='h-12 flex flex-col justify-center font-bold text-2xl px-4 text-center'>試験問題{moment(_item?.createdAt).format("（YYYY年MM月DD日）")} </div>
                                <div>
                                    {
                                        sumRightAnswer === -1 ?
                                            _exer?.map((exerItem, index) =>
                                                <div key={index} className='py-4 p-4'>
                                                    <div className="flex gap-1 text-lg">
                                                        <div>{index + 1}.</div>
                                                        <div className='font-semibold ' dangerouslySetInnerHTML={{ __html: exerItem.question }}></div>
                                                    </div>
                                                    <div className="h-3"></div>
                                                    <div>
                                                        {JSON.parse(exerItem?.choose).map((choo: ChooseType, index_: number) =>
                                                            <div key={index_} className='grid grid-cols-4'>
                                                                <div>
                                                                    {_answer[index] && _answer[index].ans === "A" ?
                                                                        <RadioButtonCheckedIcon className='!w-12 !h-12 p-3 cursor-pointer' /> :
                                                                        <RadioButtonUncheckedIcon className='!w-12 !h-12 p-3 cursor-pointer' onClick={() => { selectAnswer("A", index) }} />}
                                                                    <b className='mr-2'>1.</b>{choo.answerA}</div>
                                                                <div>
                                                                    {_answer[index] && _answer[index].ans === "B" ?
                                                                        <RadioButtonCheckedIcon className='!w-12 !h-12 p-3 cursor-pointer' /> :
                                                                        <RadioButtonUncheckedIcon className='!w-12 !h-12 p-3 cursor-pointer' onClick={() => { selectAnswer("B", index) }} />}
                                                                    <b className='mr-2'>2.</b>{choo.answerB}</div>
                                                                <div>
                                                                    {_answer[index] && _answer[index].ans === "C" ?
                                                                        <RadioButtonCheckedIcon className='!w-12 !h-12 p-3 cursor-pointer' /> :
                                                                        <RadioButtonUncheckedIcon className='!w-12 !h-12 p-3 cursor-pointer' onClick={() => { selectAnswer("C", index) }} />}
                                                                    <b className='mr-2'>3.</b>{choo.answerC}</div>
                                                                <div>
                                                                    {_answer[index] && _answer[index].ans === "D" ?
                                                                        <RadioButtonCheckedIcon className='!w-12 !h-12 p-3 cursor-pointer' /> :
                                                                        <RadioButtonUncheckedIcon className='!w-12 !h-12 p-3 cursor-pointer' onClick={() => { selectAnswer("D", index) }} />}
                                                                    <b className='mr-2'>4.</b>{choo.answerD}</div>
                                                            </div>)}
                                                    </div>
                                                </div>) : null
                                    }
                                </div>
                                {_isEnd ? < Button name="ホーム" onClick={() => toPage.push("/")} sx="!block" /> : < Button name="確認" onClick={() => store.dispatch(setModal({ value: "", msg: "本当に提出したいですか？", type: "confirm", open: true }))} sx="!block" />}
                                {sumRightAnswer !== -1 ? <div className='text-center'>正解 : <span className='font-bold text-lg'>{sumRightAnswer} / {_exer.length}</span></div> : null}
                            </div> :
                            <div className='font-bold'>
                                宿題なし
                            </div> :
                        <div className='font-bold'>
                            この宿題をもうやりました。
                        </div>
                }

            </div>
        </div>
    )
}

export default Page
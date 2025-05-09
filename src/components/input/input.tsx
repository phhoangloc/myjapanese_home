'use client'
import React, { useEffect, useState } from 'react'

type Props = {
    onchange: (v: string) => void,
    value: string,
    sx?: string,
    type?: string,
}

export const Input = ({ onchange, value, sx, type }: Props) => {

    const [_value, set_value] = useState<string>("")
    const [_focus, set_focus] = useState<boolean>(false)
    useEffect(() => {
        onchange(_value)
    }, [_value, onchange])

    useEffect(() => {
        set_value(value)
    }, [value])

    const _sx = `block w-full px-2 my-2 mx-auto h-12 border transition-all duration-200 bg-white rounded ${_focus ? "shadow border-sky-600" : "border-slate-300"}`
    return (
        <input className={_sx + " " + sx}
            type={type}
            onChange={(e) => { set_value(e.currentTarget.value) }}
            onFocus={(e) => { e.currentTarget.style.outline = "none"; set_focus(true) }}
            onBlur={() => set_focus(false)}
            defaultValue={value}
        ></input>
    )
}
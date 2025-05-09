'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { Archive } from '@/components/admin/archive'
const Page = () => {
    const params = useParams<{ archive: string }>()
    const archive = params.archive
    return (
        <Archive archive={archive} />
    )
}

export default Page
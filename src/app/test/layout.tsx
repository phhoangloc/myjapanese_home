import Header from '@/components/layout/header'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <div>
            <Header />
            <div className='pt-12'>
                {children}
            </div>
        </div>
    )
}

export default Layout
import React from 'react'
import PersonIcon from '@mui/icons-material/Person';

const Header = () => {
    return (
        <div className='fixed w-full h-12 flex flex-col justify-center bg-white shadow-md'>
            <div className="w-11/12 max-w-(--xl) m-auto flex justify-between">
                <div className='text-xl font-bold'>日本語を食べたくない</div>
                <div><PersonIcon /></div>
            </div>
        </div>
    )
}

export default Header
import React from 'react'

function MainContainer({ children }) {
    return (
        <div className='flex flex-col outline-4 outline-zinc-800 dark:outline-zinc-300 bg-zinc-200 dark:bg-zinc-900 justify-center items-center p-6 gap-4 min-w-xs rounded-lg  text-zinc-900 dark:text-zinc-300 font-sans font-semibold'>
            {children}
        </div>
    )
}

export default MainContainer
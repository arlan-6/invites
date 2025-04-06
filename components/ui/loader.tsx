import React, { FC } from 'react'
import { cn } from '@/lib/utils'

interface loaderProps {
 className?:string
  
}

const Loader: FC<loaderProps> = ({ className,  }) => {
  return (
    <div className={cn('flex justify-center items-center',className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}
export default Loader
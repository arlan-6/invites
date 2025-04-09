import React, { FC } from 'react'
import { cn } from '@/lib/utils'
import BottomNavigation from '@/components/bottom-navigation'

interface layoutProps {
  children: React.ReactNode
}

const Layout: FC<layoutProps> = ({  children }) => {
  return (
    <div className={cn('')}>
     {children}
     <BottomNavigation/>
    </div>
  )
}
export default Layout
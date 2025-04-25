import React, { FC } from 'react'
import { cn } from '@/lib/utils'
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface layoutProps {
children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ children,  }) => {
    const session = await auth.api.getSession({
            headers: await headers(),
        });
    if (!session) {
        redirect('/')}
    // console.log(session.user.role);
    
    if (session.user.role !== 'admin' && session.user.role !== 'moderator') {
        // redirect('/')
        // console.log('aaa');
        
    }
    
  return (
    <div className={cn('')}>
     {children}
    </div>
  )
}
export default layout
import React, { FC } from 'react'
import { cn } from '@/lib/utils'
import { GetAdvancedInviteById } from '@/lib/advancedInvitesUtils';
import { Birthday } from '@/components/advanced-templates/birthday';

interface pageProps {
 params: Promise<{ id: string }>;
}

const Page: FC<pageProps> =async ({  params }) => {
    const {id}  =  await params
    const invite = await GetAdvancedInviteById(id)
    
    if(!invite) return <div>Invite not found</div>
  return (
    <div className={cn('')}>
     
     <Birthday inviteData={{ 
       ...invite, 
       dateTime: invite.dateTime.toISOString(), 
       themeOrMessage: invite.themeOrMessage ?? undefined,
       dressCode: invite.dressCode ?? undefined,
       giftInfo: invite.giftInfo ?? undefined,
       rsvpDeadline: invite.rsvpDeadline?.toISOString() ?? undefined,
       contactInfo: invite.contactInfo ?? undefined,
        
     }} 
     id={invite.id}/>
    </div>
  )
}
export default Page
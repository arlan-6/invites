// app/invite/[inviteId]/image/route.tsx

import { getInviteById } from '@/lib/inviteUtils';
import { cn } from '@/lib/utils';
import { ImageResponse } from 'next/og';

export const config = {
  runtime: 'edge',
};

export async function GET(
  request: Request,
  context: { params: Promise<{ inviteId: string }> }
) {
	const { inviteId } = await context.params;
  
  // Fetch invite data from the database
  const invite = await getInviteById(inviteId);
  if (!invite) {
    return new Response("Invite not found", { status: 404 });
  }
  
  // Convert invite data to the expected formData format
  const formData = {
    title: invite.title,
    date: invite.date.toISOString().split("T")[0], // e.g. YYYY-MM-DD
    time: invite.date.toISOString().split("T")[1]?.slice(0, 5), // e.g. HH:mm
    location: invite.location,
    message: invite.message || "",
  };

  // Wrap the InviteTemplate component in a container with explicit layout styles
  const ogMarkup = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
		background: "linear-gradient(to top left, #3b82f6, #10b981)",
		color:'#fff',
		textAlign:'center'
      }}
	  className={cn('bg-gradient-to-tl',invite.template.color)}
    >
		<div style={{
			fontSize:'2em'
		}}>
      {invite.title}</div>
	  <br />
	  <br />
	  <br />
	  <br />
	  {invite.date.toString()}
	  
    </div>
  );

  return new ImageResponse(ogMarkup, {
    width: 430,
    height: 430,
    headers: { "Content-Type": "image/png" },
  });
}

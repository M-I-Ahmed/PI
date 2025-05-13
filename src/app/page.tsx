'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { User as UserIcon, CheckCircle, Loader2, AlertTriangle } from 'lucide-react'
import ToolStatus from '@/components/ui/ToolStatus'
import HoleCountTile from '@/components/ui/HoleCountTile'
import HolesLastHour from '@/components/ui/HolesLastHour'
import CurrentProcessPanel from '@/components/ui/currentProcessPanel'
import MessageLog from '@/components/ui/message-log'
import HoleSuccessDial from '@/components/ui/HoleSuccessDial'
//import WidgetList from '@/components/ui/widgetlist'

//import MessageLog from '@/components/ui/message-log'

const AssetColumn = ({
  title,
  imageSrc,
  contentBottom,
}: {
  title: string
  imageSrc?: string
  contentBottom?: string
}) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-8 text-white flex-1 transition-transform hover:scale-[1.01] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg">
    <h2 className="text-xl font-semibold mb-3 text-white">{title}</h2>
    {imageSrc ? (
      <Image
        src={imageSrc}
        alt={`${title} image`}
        width={130}
        height={130}
        className="mb-3 rounded object-contain"
      />
    ) : (
      <div className="w-[110px] h-[110px] mb-3 bg-gray-700 rounded flex items-center justify-center text-sm text-gray-400">
        No image
      </div>
    )}
    {contentBottom && <div className="text-base text-cyan-400 font-medium">{contentBottom}</div>}
  </div>
)

const DrillingCellColumn = ({ id }: { id: string }) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-8 text-white flex-[0.6] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg transition-transform hover:scale-[1.01]">
    <h2 className="text-xl font-bold mb-1 text-white">Drilling Cell</h2>
    <p className="text-base text-cyan-400 font-medium">{id}</p>
  </div>
)

const CellStatus = ({ status }: { status: 'ready' | 'drilling' | 'fault' }) => {
  let bgClass = 'bg-gray-700';
  let IconComponent = CheckCircle;
  let iconClass = 'text-white';
  if (status === 'ready') {
    bgClass = 'bg-green-600';
    IconComponent = CheckCircle;
    iconClass = 'text-white';
  } else if (status === 'drilling') {
    bgClass = 'bg-blue-600';
    IconComponent = Loader2;
    iconClass = 'text-white animate-spin';
  } else if (status === 'fault') {
    bgClass = 'bg-red-600';
    IconComponent = AlertTriangle;
    iconClass = 'text-white';
  }
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={`inline-flex items-center px-4 py-2 rounded-2xl shadow-lg transition ${bgClass}`}
      >
        <IconComponent className={`mr-2 h-5 w-5 ${iconClass}`} />
        <span className="text-white font-semibold uppercase">{status}</span>
      </div>
    </div>
  )
}




export default function Header() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-900 transition-colors">
      <header className="flex items-center justify-between mx-4 mb-2 p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-md">
  {/* 1️⃣ Left side: Page title */}
  <h1 className="text-2xl font-semibold tracking-wide">
    Process Intelligence
  </h1>

  {/* 2️⃣ Right side: status + user icon grouped */}
  <div className="flex items-center gap-6">
    {/* Cell Status label + badge */}
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold text-white">Cell Status</h2>
      <CellStatus status="ready" />
    </div>

    {/* User popover */}
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-10 rounded-2xl bg-gray-800 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
          aria-label="User menu"
        >
          <UserIcon className="h-6 w-6 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-56 p-4 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 text-white"
      >
        <p className="font-medium mb-1">User</p>
        <p className="text-sm text-gray-400 mb-4">User ID: 12345</p>
        <Button
          variant="outline"
          className="w-full bg-gray-700 hover:bg-gray-600"
          onClick={() => router.push('/')}
        >
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  </div>
</header>


      {/* Asset Overview */}
      <section className="pb-6 py-4 mx-6">
        <div className="flex gap-4">
          <div className="flex flex-[0.8] gap-4">
            <DrillingCellColumn id="DC002" />
            <AssetColumn
              title="Robot"
              imageSrc="/robots/fanuc-m2000.png"
              contentBottom="# FC001"
            />
            <AssetColumn
              title="End Effector"
              imageSrc="/smartendeffector.png"
              contentBottom="# SD004"
            />
          </div>
          <div className="flex flex-[0.25] gap-4">
            <AssetColumn
              title="In-Process Part"
              imageSrc="/plane.png"
              contentBottom="# RW002"
            />
          </div>
        </div>
      </section>


      {/* Row 2 */}
      <section className='flex gap-4 px-6 py-2'>
        <CurrentProcessPanel />
        {/*Div for current process section */}
       
  
        {/*Div for 4 tiles */}
        <div className=" flex-[2] grid grid-cols-2 gap-4 mb-4 h-90">
            <ToolStatus />
            <HoleCountTile/>
            <HoleSuccessDial />
            {/* <MetricTile label="Hole Success Rate (Dial)" value='20' /> */}
            <HolesLastHour />
        </div>

        {/* Div for Cell status indicator */}



        {/* Div for message log section*/}
        <div className='flex-[2] flex-col bg-gradient-to-b from-[#1e293b] to-[#0f172a]  text-white rounded-2xl pl-9 pt-6 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all'>

            <h2 className="text-lg font-semibold mb-4 text-white">Message Log</h2>
            {/* /*<MessageCard message='This is a test message.' timestamp='3:55'></MessageCard>*/}
            <MessageLog />
        </div>





      </section>



    </main>
  )
}

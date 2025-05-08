'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { User as UserIcon } from 'lucide-react'
import MessageLog from '@/components/ui/message-log'

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

const MetricTile = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center text-white font-semibold text-sm text-center p-4 border border-cyan-500 rounded-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow hover:shadow-lg transition-all">
    {label}
  </div>
);

export default function Header() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-900 transition-colors">
      <header className="flex items-center justify-between mb-6 p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold tracking-wide">Process Intelligence</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-10 rounded-2xl bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
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
            <p className="font-medium mb-1">John Doe</p>
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
      </header>

      {/* Asset Overview */}
      <section className="px-6 py-4">
        <div className="flex gap-4">
          <div className="flex flex-[0.8] gap-4">
            <DrillingCellColumn id="DC002" />
            <AssetColumn
              title="Robot"
              imageSrc="/robots/fanuc-m2000.png"
              contentBottom="# Robot Name"
            />
            <AssetColumn
              title="End Effector"
              imageSrc="/robots/abb.png"
              contentBottom="# End Effector Name"
            />
          </div>
          <div className="flex-[0.25]">
            <AssetColumn
              title="In-Process Part"
              imageSrc="/plane.png"
              contentBottom="# Part ID"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

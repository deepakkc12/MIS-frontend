import React from 'react'
import MainLayout from '../../pages/HeadOffice/Layout/Layout'
import { Loader } from 'lucide-react'

function LoaderSpinner() {
  return (
    <MainLayout>        <div className="flex h-[200px] items-center justify-center">
        <div className="flex flex-col items-center text-blue-600">
          <Loader className="h-8 w-8 animate-spin mb-2" />
          <span className="text-sm text-gray-500">Loading data...</span>
        </div>
      </div>
      </MainLayout>
  )
}

export default LoaderSpinner

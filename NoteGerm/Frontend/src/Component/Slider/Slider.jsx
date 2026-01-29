import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText } from 'lucide-react'

const Slider = () => {
  return (
    <div className="w-64  bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen flex flex-col shadow-2xl">
      {/* Header */}
     

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/30 border-l-4 border-blue-500 shadow-lg' 
                  : 'hover:bg-gray-700/50 hover:translate-x-1'
              }`
            }
          >
            <div className={`${({isActive}) => isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'}`}>
              <LayoutDashboard size={20} />
            </div>
            <span className={`font-medium ${({isActive}) => isActive ? 'text-blue-100' : 'text-gray-300 group-hover:text-white'}`}>
              Dashboard
            </span>
            {({isActive}) => isActive && (
              <ChevronRight className="ml-auto text-blue-400" size={16} />
            )}
          </NavLink>

          <NavLink 
            to="/notes" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/30 border-l-4 border-blue-500 shadow-lg' 
                  : 'hover:bg-gray-700/50 hover:translate-x-1'
              }`
            }
          >
            <div className={`${({isActive}) => isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'}`}>
              <FileText size={20} />
            </div>
            <span className={`font-medium ${({isActive}) => isActive ? 'text-blue-100' : 'text-gray-300 group-hover:text-white'}`}>
              Notes
            </span>
            {({isActive}) => isActive && (
              <ChevronRight className="ml-auto text-blue-400" size={16} />
            )}
          </NavLink>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  )
}

export default Slider
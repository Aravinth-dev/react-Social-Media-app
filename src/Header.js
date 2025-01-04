import React from 'react'
import { FaLaptop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa'



const Header = ({title,width}) => {
  return (
    <header className='Header' >
      <h1>{title || 'Default Title'}</h1>
      {width < 768 ? <FaMobileAlt /> : width < 992 ? <FaTabletAlt />:<FaLaptop />}
      </header>
  )
}


export default Header
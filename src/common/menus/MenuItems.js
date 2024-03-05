import Dropdown from './Dropdown'
import { useState, useEffect, useRef } from 'react'
import { RightOutlined } from '@ant-design/icons'

const MenuItems = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false)

  // console.log('yyyyyyyyyyy', setDropdown())
  //下拉菜单外点击时关闭下拉菜单
  let ref = useRef()
  useEffect(() => {
    const handler = event => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [dropdown])

  //在鼠标悬停时为大屏幕切换下拉菜单
  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true)
  }
  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false)
  }

  const handleMenuClick = () => {
    setDropdown(prev => !prev)
    console.log('点击导航栏名称')
  }
  const dropdownClick = () => {
    console.log('点击菜单名称', dropdown)
    setDropdown(false)
  }

  return (
    <li
      className="menu-items"
      ref={ref}
      // onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.submenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={handleMenuClick}
          >
            {items.title}{' '}
            {depthLevel > 0 ? (
              <span>
                <RightOutlined />
              </span>
            ) : (
              <span className="arrow" />
            )}
          </button>
          <Dropdown
            submenus={items.submenu}
            dropdown={dropdown}
            depthLevel={depthLevel}
          />
        </>
      ) : (
        <a
          onClick={() => {
            dropdownClick()
          }}
        >
          {items.title}
        </a>
      )}
    </li>
  )
}

export default MenuItems

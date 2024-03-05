import { menuItems } from './data/menuItem'
import MenuItems from './MenuItems'
const Navbar = () => {
	const depthLevel = 0 //depthLevel解决菜单重叠
	return (
		<nav>
			<ul className="menus">
				{/* 未实现功能屏蔽: 编辑器头部 */}
				{/* 此处为遍历数据显示导航栏名称处，点击名称出现的菜单栏在Dropdown.js文件中遍历 */}
				{/* {menuItems.map((menu, index) => {
					return <MenuItems items={menu} key={index} depthLevel={depthLevel} />
				})} */}
			</ul>
		</nav>
	)
}

export default Navbar

import React, { createContext, useEffect, useRef, useState } from 'react'
// import { Route, Routes } from 'react-router-dom';

import './App.css'
import { Home } from './home/home'
import Menus from './common/menus/App'
import { Nav } from './common/nav/nav'
import Bottom from './common/bottom/Bottom'
import ProjectEntrance from './common/ProjectEntrance/projectEntrance'
import Loading from './common/ProjectEntrance/Loading/loading'
import { EditorEventMgr } from "./Game/Event/EditorEventMgr";
import { WindowManager } from "./common/window/WindowManager";
import { WindowSlot } from "./common/window/WindowSlot";
import { ContextMenuSlot } from './common/contextMenu/ContextMenuSlot'

const AppContext = createContext(null)

function App() {

	const [isHomePage, setIsHomePage] = useState(false)
	const [loadingVisible, setLoadingVisible] = useState(true)

	useEffect(() => {
		let binder = EditorEventMgr.Instance.addEventListener('OnEditorLoadFinish', () => {
			setLoadingVisible(false)
			binder.removeListener()
			// navigate('/project')
		})
	})

	return (
		<div className="App">
			<AppContext.Provider value={{ setIsHomePage }}>
				{
					isHomePage ? (
						<>
							<Menus />
							<Nav />
							<Home></Home>
							<Bottom />
						</>
					) : <ProjectEntrance />
				}
			</AppContext.Provider>
			{
				isHomePage && loadingVisible ? <Loading loadingVisible={loadingVisible}></Loading> : null
			}

			{/* <Routes>
				<Route path='/' element={ <ProjectEntrance />}/>
			</Routes>
			<Routes>
				<Route path='/project' element={
					<>
						<Menus />
						<Nav />
						<Home></Home>
						<Bottom /> 
					</>
				}/>
			</Routes> */}

			{/*<Curve data={[*/}
			{/*	{x: -60, y: 0},*/}
			{/*	{x: -40, y: 0.6}*/}
			{/*]}></Curve>*/}

			{/*窗口插槽*/}
			<WindowSlot></WindowSlot>

			{/* 上下文右键菜单 */}
			<ContextMenuSlot></ContextMenuSlot>
		</div>
	)
}

export default App
export { AppContext }
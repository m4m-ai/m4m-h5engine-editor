import Navbar from './Navbar'
import '../menus/app.css'

const App = () => {
  return (
    <header>
      <div className="nav-area">
        <a href="/" className="logo">
          Logo
        </a>
        <Navbar />
      </div>
    </header>
  )
}

export default App

// 父组件，App.js ，持有标志和Navbar.js，Navbar.js持有MenuItems.js。在MenuItems.js ，我们有各个项目和Dropdown.js。Dropdown.js中也有MenuItems.js

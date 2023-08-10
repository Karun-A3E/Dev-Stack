import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { SiShopware,SiLegacygames } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { links,MemberNavlinks,AdminNavLinks } from '../configurations/website_rules'
import { useStateContext } from '../contexts/ContextProvider';
const Sidebar = () => {
  const {activeMenu,setActiveMenu,screenSize } = useStateContext();
  const { isClicked } = useStateContext();
  const { member,admin } = isClicked; // Get the member status from the context
  console.log('useStateContext:', { activeMenu, setActiveMenu, screenSize }); // Add this line to check
  console.log(links)
  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <=900) {
      setActiveMenu(false)
    }
  }

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-black  text-md m-2 bg-light-gray';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';
  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10" >
    {activeMenu && (
      <>
        <div className='flex justify-between items-center'>
          <Link to='/' onClick={handleCloseSideBar} className='items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900'>
            <SiLegacygames /><span>SP Games</span>
          </Link>
          <MdOutlineCancel
            onClick={() => setActiveMenu(!activeMenu)}
            className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block"
          />
        </div>
        <div className="mt-10">
          {MemberNavlinks.map((item) => (
            <div key={item.title}>
              <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">{item.title}</p>
              {item.links.map((link) =>
                // Check the access level and render the link only if the user has access
                (link.Access === 'All' || (link.Access === 'Member' && member)) ? (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ) : null
              )}
            </div>
          ))}
        </div>
      </>
    )}

    {/* Render Admin NavLinks if user is an admin */}
    {isClicked.admin && (
      <>
        <div className="mt-10">
          {AdminNavLinks.map((item) => (
            <div key={item.title}>
              <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">{item.title}</p>
              {item.links.map((link) =>
                <NavLink
                  to={`/${link.name}`}
                  key={link.name}
                  onClick={handleCloseSideBar}
                  className={({ isActive }) => (isActive ? activeLink : normalLink)}
                >
                  {link.icon}
                  <span className="capitalize ">{link.name}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

}

export default Sidebar
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Router, useParams } from 'react-router-dom'
import { FiSettings } from 'react-icons/fi';
import { Navbar, Footer, Sidebar } from './components/index';
import { useStateContext } from './contexts/ContextProvider';
import { Overview, Search, ProductShow, Auth, Settings, GameShow, UserSettings, DataOverview, Checkout, Pie, AreaChart, LineChart,Bookmark } from './pages/index';
import PrivateWrapper from './configurations/PrivateWrapper';

function App() {
  const { activeMenu } = useStateContext()


  return (
    <div className="">
      <BrowserRouter>
        <div data-tooltip-id='settings' data-tooltip-content='settings' className='flex relative dark:bg-main-dark-bg'>
          <div className='fixed right-4 bottom-4' style={{ zIndex: "1000" }}>
            <div className="p10">
              <button
                type="button"
                style={{ borderRadius: '50%', background: 'blue' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
              <span class="absolute bg-gray-100 opacity-0 transition-opacity group-hover:opacity-100 rounded p-2 top-[-30%] left-1/2 transform -translate-x-1/2 shadow-md">
                Settings
              </span>
            </div>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div className={
            activeMenu
              ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
              : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
          }>

            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>


            <div>

              <Routes>

                <Route
                  path="/"
                  element={<PrivateWrapper element={<Overview />} accessLevel="all" />}
                />
                <Route
                  path="/search"
                  element={<PrivateWrapper element={<Search />} accessLevel="all" />}
                />
                <Route
                  path="/settings"
                  element={<PrivateWrapper element={<Settings />} accessLevel="member" />}
                />
                <Route
                  path="/Checkout"
                  element={<PrivateWrapper element={<Checkout />} accessLevel="member" />}
                />
                <Route
                  path="/product/:productID"
                  element={<PrivateWrapper element={<ProductShow />} accessLevel="all" />}
                />
                <Route
                  path="/game/:gameName"
                  element={<PrivateWrapper element={<GameShow />} accessLevel="all" />}
                />
                <Route
                  path="/Overview"
                  element={<PrivateWrapper element={<Overview />} accessLevel="all" />}
                />
                <Route
                  path="/UISettings"
                  element={<PrivateWrapper element={<UserSettings />} accessLevel="admin" />}
                />
                <Route
                  path="/Data"
                  element={<PrivateWrapper element={<DataOverview />} accessLevel="admin" />}
                />

                <Route
                  path="/pie"
                  element={<PrivateWrapper element={<Pie />} accessLevel="admin" />}
                />
                <Route
                  path="/area"
                  element={<PrivateWrapper element={<AreaChart />} accessLevel="admin" />}
                />
                <Route
                  path="/line"
                  element={<PrivateWrapper element={<LineChart />} accessLevel="admin" />}
                />
                <Route
                  path="/Bookmark"
                  element={<PrivateWrapper element={<Bookmark />} accessLevel="member" />}
                />
                <Route
                  path="/Auth/:stat"
                  element={<Auth />}
                />

              </Routes>
            </div>
            <Footer />

          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

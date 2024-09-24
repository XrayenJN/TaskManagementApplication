import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TaskContext } from '../contexts/TaskContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faClock, faList, faColumns, faCalendar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const TitleBar = () => {
  const { user, oktaAuth, auth } = useContext(AuthContext);
  const { inViewPage, setInViewPage } = useContext(TaskContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { chosenProjectId } = useContext(TaskContext);
  const location = useLocation();

  useEffect(() => {
    const storedInViewPage = localStorage.getItem('inViewPage');
    if (storedInViewPage !== null) {
      setInViewPage(JSON.parse(storedInViewPage));
    }
  }, [setInViewPage]);
  
  useEffect(() => {
    localStorage.setItem('inViewPage', JSON.stringify(inViewPage));
  }, [inViewPage]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('project') && !currentPath.includes('projects')) {
      setInViewPage(true);
    } else {
      setInViewPage(false);
    }
  }, [location.pathname, setInViewPage]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = async() => {
    await oktaAuth.signOut();
    await auth.signOut();;
  };

  const handleMouseEnterMenu = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeaveMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    location.pathname === path;
  };

  return (
    <div style={{ backgroundColor: '#051622', color: '#fff', display: 'flex', alignItems: 'center', padding: '20px 20px', position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1 }}>
      {inViewPage && (
        <div 
          style={{ marginRight: '20px', cursor: 'pointer' }} 
          onMouseEnter={handleMouseEnterMenu}
          onMouseLeave={handleMouseLeaveMenu}
        >
          <FontAwesomeIcon icon={faBars} style={{ fontSize: '28px', padding: '0px 10px 0px' }} />
          {isMenuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '45px',
                left: '-5px',
                width: '200px',
                backgroundColor: '#051622',
                color: 'white',
                padding: '5px',
                zIndex: 1000,
                borderRadius: '5px',
                boxShadow: '2px 0px 5px rgba(0,0,0,0.5)',
              }}
              onMouseEnter={handleMouseEnterMenu}
              onMouseLeave={handleMouseLeaveMenu}
            >
              <ul style={{ listStyle: 'none', padding: '0px 30px', textAlign: 'left' }}>
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px' }} />
                  <Link to={`/project/${chosenProjectId}/timeline`} style={{ color: 'white', fontWeight: isActive(`/project/${chosenProjectId}/timeline`) ? 'bold' : 'normal'  }}>Timeline View</Link>
                </li>
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faList} style={{ marginRight: '10px' }} />
                  <Link to={`/project/${chosenProjectId}`} style={{ color: 'white', fontWeight: isActive(`/project/${chosenProjectId}`) ? 'bold' : 'normal' }}>List View</Link>
                </li>
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faColumns} style={{ marginRight: '10px' }} />
                  <Link to={`/project/${chosenProjectId}/kanban`} style={{ color: 'white', fontWeight: isActive(`/project/${chosenProjectId}/kanban`) ? 'bold' : 'normal' }}>Kanban View</Link>
                </li>
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '10px' }} />
                  <Link to={`/project/${chosenProjectId}/calendar`} style={{ color: 'white', fontWeight: isActive(`/project/${chosenProjectId}/calendar`) ? 'bold' : 'normal'}}>Calendar View</Link>
                </li>
                <hr/>
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
                  <Link to="/projects" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => {
                    localStorage.setItem('inViewPage', JSON.stringify(false));
                    setInViewPage(false);
                  }}>Exit to Projects</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 1 }}></div>
      <h1 style={{ margin: 0, textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>Task Management System</h1>
      {user && (
        <div 
          style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}
          onMouseEnter={handleDropdownToggle}
          onMouseLeave={handleMouseLeave}
        >
          <FontAwesomeIcon
            icon={faUser}
            style={{ fontSize: '30px', marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{user.displayName || user.name}</span>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '10px',
              backgroundColor: '#051622',
              borderRadius: '5px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              marginRight: '50px',
            }}>
              <ul style={{
                listStyle: 'none',
                padding: '20px',
                color: '#fff',
              }}>
                <li style={{ padding: '5px 10px' }}>
                  <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
                </li>
                <li style={{ padding: '5px 10px' }}>
                  <Link to="/settings" style={{ color: '#fff', textDecoration: 'none' }}>Settings</Link>
                </li>
                <hr></hr>
                <li
                  style={{ padding: '0px 10px', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TitleBar;
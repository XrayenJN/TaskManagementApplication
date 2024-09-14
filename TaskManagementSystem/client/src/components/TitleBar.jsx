import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TaskContext } from '../contexts/TaskContext';
import { ProjectContext } from '../contexts/ProjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faClock, faList, faColumns, faCalendar, faArrowLeft, faBell } from '@fortawesome/free-solid-svg-icons';

const TitleBar = () => {
  const { user, oktaAuth, auth } = useContext(AuthContext);
  const { inViewPage, setInViewPage } = useContext(TaskContext);
  const { projects } = useContext(ProjectContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { chosenProjectId } = useContext(TaskContext);
  const location = useLocation();

  const currentPath = location.pathname;
  if (currentPath.includes('project') && !currentPath.includes('projects')) {
    setInViewPage(true);
  }

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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

  const handleLogout = async () => {
    await oktaAuth.signOut();
    await auth.signOut();;
  };

  const handleMouseEnterMenu = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeaveMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const isActive = (path) => location.pathname === path;

  const getPageHeading = () => {
    const currentPath = location.pathname;
    try {
      if (currentPath.includes('project') && !currentPath.includes('projects')) {
        return projects[chosenProjectId].name;
      } else if (currentPath.includes('profile')) {
        return "Profile | TMS";
      } else if (currentPath.includes('settings')) {
        return "Settings | TMS";
      }
    } catch (e) {
      return "Task Management System";
    }
    return "Task Management System";
  };

  return (
    document.title = getPageHeading() + " | TMS",
    <div style={{ backgroundColor: '#051622', color: '#fff', display: 'flex', alignItems: 'center', padding: '20px 20px', position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 10 }}>
      {inViewPage && (
        <div
          style={{ marginRight: '20px', cursor: 'pointer' }}
          onMouseEnter={handleMouseEnterMenu}
          onMouseLeave={handleMouseLeaveMenu}
        >
          <FontAwesomeIcon icon={faBars} style={{ fontSize: '28px', padding: '0px 10px 0px' }}
            onMouseEnter={handleMouseEnterMenu}
            onMouseLeave={handleMouseLeaveMenu} />
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
                  <Link to={`/project/${chosenProjectId}/timeline`} style={{ color: 'white', fontWeight: isActive(`/project/${chosenProjectId}/timeline`) ? 'bold' : 'normal' }}>
                    <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px' }} />
                    Timeline View</Link>
                </li>
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <Link to={`/project/${chosenProjectId}`} style={{ color: 'white', fontWeight: isActive(`/project/${chosenProjectId}`) ? 'bold' : 'normal' }}>
                    <FontAwesomeIcon icon={faList} style={{ marginRight: '10px' }} />
                    List View</Link>
                </li>
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <Link to={`/project/${chosenProjectId}/kanban`} style={{ color: 'white', fontWeight: isActive(`/project/${chosenProjectId}/kanban`) ? 'bold' : 'normal' }}>
                    <FontAwesomeIcon icon={faColumns} style={{ marginRight: '10px' }} />
                    Kanban View</Link>
                </li>
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <Link to={`/project/${chosenProjectId}/calendar`} style={{ color: 'white', fontWeight: isActive(`/project/${chosenProjectId}/calendar`) ? 'bold' : 'normal' }}>
                    <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '10px' }} />
                    Calendar View</Link>
                </li>
                <hr />
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <Link to="/projects" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => {
                    localStorage.setItem('inViewPage', JSON.stringify(false));
                    setInViewPage(false);
                  }}>
                    <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
                    Exit to Projects</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 1 }}></div>
      <h1 style={{ margin: 0, textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>{getPageHeading()}</h1>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
          {inViewPage && (
            <div 
            onMouseEnter={handleNotificationToggle}
            onMouseLeave={handleNotificationToggle}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon
              icon={faBell}
              style={{ fontSize: '30px', marginLeft: '10px', cursor: 'pointer', marginRight: '20px' }}
            />
            {isNotificationOpen && (
              <div style={{
                position: 'absolute',
                top: '30px',
                right: '0',
                backgroundColor: '#051622',
                borderRadius: '5px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                width: '200px',
                padding: '10px',
                color: 'white'
              }}>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  <li style={{ padding: '10px', borderBottom: '1px solid #fff' }}>No new notifications</li>
                </ul>
              </div>
            )}
          </div>
          )}
          
          <div 
            onMouseEnter={handleDropdownToggle}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon
              icon={faUser}
              style={{ fontSize: '30px', marginLeft: '10px', cursor: 'pointer' }}
            />
            <span style={{ marginLeft: '10px' }}>{user.displayName || user.name}</span>

            {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '-50px',
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
                <li style={{ padding: '10px 0', cursor: 'pointer' }}>
                  <Link to="/projects" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => {
                    localStorage.setItem('inViewPage', JSON.stringify(false));
                    setInViewPage(false);
                  }}>
                    Projects</Link>
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
        </div>
      )}
    </div>
  );
};

export default TitleBar;
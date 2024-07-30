import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { getProjects, getUserProjectIds } from '../firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';

const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const userProjectIds = await getUserProjectIds(user.uid);
      const projects = await getProjects(userProjectIds);
      setProjects(projects);
      setLoading(false);
    };


    fetchProjects();
  }, []);

  if (loading) {
    /**
     * @todo Ethan said: the return statement is too long and needs to be cleaned up
     */
    return <div>Loading...</div>;
  }
  return (
    <div style={{ padding: '20px', backgroundColor: '#F4F1E7', height: '100%' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>Projects</h1>
      <Link to="/new-project-form" style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
        Add Project
      </Link>
    </div>
    <hr style={{ margin: '20px 0', border: '1px solid #ccc' }} />
    {projects.map(project => 
      <Link to="/project" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ backgroundColor: '#1BA098', color: 'white', padding: '20px', marginBottom: '20px', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold', color: 'black' }}>{project.name}: {project.description} </p>
            <p style={{ margin: 0, color: 'black' }}>Contributors</p>
          </div>
          <div style={{ fontWeight: 'bold', color: 'black', display: 'flex', alignItems: 'center' }}>
            {project.endDate}
          </div>
        </div>
      </div>
    </Link>
    )}

  </div>
    // <div>
    //   <h1 style={{display:'flex', marginLeft:'5%', marginTop:'10%'}}>Projects</h1>
    //   <hr style={{width: '90%'}} />
    //   <div className="Buttons">
    //     <Link to="/new-project-form">
    //       <button>+ Project</button>
    //     </Link>
    //     <Link to="/">
    //       <button>Home</button>
    //     </Link>
    //   </div>
    //   <ul>
    //     <table>
          
    //     {projects.map(project => (
    //       // <li key={project.id}>
    //       //   <h2>{project.name}</h2>
    //       //   <p>{project.description}</p>
    //       // </li>
    //       <tr style={{backgroundColor:'blue'}}>
    //       <th>${project.name}</th>
    //       </tr>
    //     ))}
        
    //     </table>
    //   </ul>
    // </div>
  );
};

export default ProjectList;
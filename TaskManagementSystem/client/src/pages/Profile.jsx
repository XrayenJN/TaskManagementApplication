import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { user, oktaAuth, auth } = useContext(AuthContext); 
  const history = useHistory();

  const handleLogout = async() => {
    await oktaAuth.signOut();
    await auth.signOut();;
  }

  const goBack = () => {
    history.goBack();
  };

  let body = null;
  

  if (!user) {
    body = (
      <div>
        <p>Fetching user profile...</p>
        <button onClick={goBack}>Back</button>
      </div>
    );
  } else {
    body = (
      <div>
        <h1>User Profile</h1>
        <p><strong>Name:</strong> {user.name || user.displayName}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    )
  }

  return (
    <div>
      {body}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Profile;

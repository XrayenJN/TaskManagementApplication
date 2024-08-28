import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext';

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
    const providerId = user.providerData ? user.providerData[0].providerId : null;
    const photoURL = user.providerData && user.providerData[0].photoURL;

    body = (
      <div>
        <h1>User Profile</h1>
        {providerId == "google.com" && (
          <>
            <img 
              src={photoURL} 
              alt="Profile Picture" 
              onError={(e) => {
                e.target.style.display = 'none'; // Hide image if it fails to load
              }}
              style={{ width: '96px', height: '96px', borderRadius: '50%' }} 
            />
            <p><strong>Name:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <br></br><br></br>
            <p><strong>Account Provider:</strong> Google</p>
            <p><strong>Account Created:</strong> {user.metadata.creationTime}</p>
            <p><strong>Last Sign-In:</strong> {user.metadata.lastSignInTime}</p>
          </>
        )}

        {providerId == null && (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Account Provider:</strong> Okta</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      {body}
      <button onClick={goBack}>Back</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Profile;

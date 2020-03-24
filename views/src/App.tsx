import React, { useEffect, useState } from 'react';
import './App.css';
import UserTable from './components/UserTable';
import userAPIs from './services/user';
import fetchUserData from './services/fetchUserData';

function App() {
  const [user, setUser] = useState([]);
  useEffect(() => {
    async function getUserData() {
      const userData = await fetchUserData(userAPIs.getUser);
      setUser(userData);
    }
    getUserData();
  }, []);
  return (
    <div className="App">
      <UserTable data={user} setUser={setUser} />
    </div>
  );
}

export default App;

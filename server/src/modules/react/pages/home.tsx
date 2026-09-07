import React from 'react';

function NavBar() {
  return (
    <div
      style={{
        backgroundColor: 'red',
        color: 'white',
        padding: '10px',
      }}
    >
      Nav bar
    </div>
  );
}

function HomePage() {
  return (
    <div>
      Home page
      <NavBar />
    </div>
  );
}

export default HomePage;

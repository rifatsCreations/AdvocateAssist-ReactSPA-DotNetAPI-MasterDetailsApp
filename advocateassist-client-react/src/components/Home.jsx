import React from 'react';

const Home = ({ onViewClients }) => {
  return (
    <div className="home-wrapper d-flex justify-content-center align-items-center">
      <div className="home-content text-center p-4 rounded shadow">
        <h1 className="title mb-3">
          Welcome to Advocate Assist
        </h1>
        <p className="subtitle mb-4">
          Easily manage clients and payments from one place.
        </p>
        <button className="home-btn" onClick={onViewClients}>
          Go to Client List
        </button>
      </div>
    </div>
  );
};

export default Home;

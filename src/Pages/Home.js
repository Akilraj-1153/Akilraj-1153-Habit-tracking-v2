import React from 'react';
import Navbar from '../Component/Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className="bg-Home h-[80vh] w-[90%] bg-cover rounded-xl bg-no-repeat p-8">
        <header className="text-4xl font-bold mb-4 text-white">
          Welcome to Your Habit Tracker
        </header>
        <section className="text-white">
          <p>
            Start building and tracking your habits today. Whether it's fitness, reading, or any other goal, we've got you covered.
          </p>
          <Link to="/homepage" className="text-blue-500 ">
            <div className="text-2xl font-bold mt-4 border-2 border-blue-500 p-2 rounded-md w-fit hover:bg-blue-500 hover:text-white">Go to Dashboard</div>
          </Link>
        </section>
        <footer className="text-gray-400 mt-8">
          <p>&copy; 2024 Your Habit Tracker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;

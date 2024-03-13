import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleSignup, handleLogin } from '../Data/Connection'; // Update the path accordingly

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [signupUsername, setSignupUsername] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [userData, setUserData] = useState(null);
  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const loginCredentials = JSON.parse(localStorage.getItem('loginCredentials'));
    if (loginCredentials) {
      setIsLoggedIn(true);
      navigate('/');
    }
  }, [setIsLoggedIn, navigate]);

  return (
    <div className="flex justify-center text-black items-center h-screen bg-Home bg-no-repeate bg-contain bg-gray-100">
      <div className="Login__container border-2 border-black bg-white/100 rounded-3xl h-[80%] w-[60%] flex flex-col justify-center items-center ">
        <h2 className="text-4xl mb-4  ">PERSONAL GROWTH AND HABIT TRACKER</h2>

        <div className="flex h-[80%] w-[100%] justify-center items-center">
          <div className="w-3/4 h-full p-8 flex flex-col justify-center items-center">
            <h2 className="text-2xl mb-4">Signup</h2>
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setSignupFullName(e.target.value)}
              className="mb-2 w-2/4 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setSignupUsername(e.target.value)}
              className="mb-2 w-2/4 p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setSignupEmail(e.target.value)}
              className="mb-2 w-2/4 p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setSignupPassword(e.target.value)}
              className="mb-2 w-2/4 p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
              className="mb-2 w-2/4 p-2 border border-gray-300 rounded"
            />
            
            {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
            <button onClick={() => handleSignup({
              username: signupUsername,
              fullName: signupFullName,
              email: signupEmail,
              password: signupPassword,
              confirmPassword: signupConfirmPassword
            },
              setSignupError,
              setUserData,
              toast,
              navigate,
              setIsLoggedIn
            )} className="bg-blue-500/60 w-1/4 p-2 rounded hover:bg-blue-600">
              Signup
            </button>
          </div>

          <div className="ml-8  w-2/4 flex flex-col justify-center items-center">
            <h2 className="text-2xl mb-4">Login</h2>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setLoginUsername(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setLoginPassword(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded"
            />

            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
            <button onClick={() => handleLogin({
              username: loginUsername,
              password: loginPassword
            },
              setLoginError,
              setUserData,
              toast,
              setIsLoggedIn
            )} className="bg-blue-500/60  p-2 rounded hover:bg-blue-600">
              Login
            </button>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </div>
  );
}

export default LoginPage;

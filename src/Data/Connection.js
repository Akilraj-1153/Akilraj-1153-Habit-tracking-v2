// Connection.js

const handleSignup = async (signupData, setSignupError, setUserData, toast, navigate, setIsLoggedIn) => {
  if (signupData.password !== signupData.confirmPassword) {
    setSignupError('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: signupData.username,
        fullName: signupData.fullName,
        email: signupData.email,
        password: signupData.password,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Server Not Found');
      } else {
        throw new Error('Failed to fetch data');
      }
    }

    const data = await response.json();

    // Fetch user details, including habit status
    const userDetails = await getUserDetails(data.user.username);

    localStorage.setItem('loginCredentials', JSON.stringify(userDetails));
    
    setSignupError('');
    setUserData(userDetails);

    toast.success('Signup successful!');
    navigate('/');
  } catch (error) {
    console.error('Error during signup:', error);

    if (error.message === 'Server Not Found') {
      setSignupError('Server Not Found. Please try again later.');
    } else {
      setSignupError('Error during signup. Please try again.');
    }
  }
};

const handleLogin = async (loginData, setLoginError, setUserData, toast, setIsLoggedIn) => {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: loginData.username, password: loginData.password }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Server Not Found');
      } else {
        throw new Error('Failed to fetch data');
      }
    }

    if (response.status === 401) {
      setLoginError('Invalid username or password');
      return;
    }

    const data = await response.json();

    // Fetch user details, including habit status
    const userDetails = await getUserDetails(data.user.username);

    localStorage.setItem('loginCredentials', JSON.stringify(userDetails));

    setUserData(userDetails);
    toast.success('Login successful!');

    setIsLoggedIn(true);

    return userDetails; // Return user details after successful login
  } catch (error) {
    console.error('Error during login:', error);

    if (error.message === 'Server Not Found') {
      setLoginError('Server Not Found. Please try again later.');
    } else {
      setLoginError('Error during login. Please try again.');
    }
  }
};

const getUserDetails = async (username) => {
  try {
    const response = await fetch(`http://localhost:3000/api/getUserDetails/${username}`);
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

const saveUserHabits = async (username, habits) => {
  try {
    const response = await fetch(`http://localhost:3000/api/saveUserDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username, // Use the actual username parameter
        habits,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save habits');
    }

    const data = await response.json();

    return true;
  } catch (error) {
    console.error('Error saving habits:', error);
    return false;
  }
};

module.exports = { handleSignup, handleLogin, getUserDetails, saveUserHabits };

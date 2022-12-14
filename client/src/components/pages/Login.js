import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };
  return (
    <div className="signInContainer">
        <div id="signInCard">
          {/* <form action="#" id="login" onSubmit={handleFormSubmit}> */}
          <form action="#" id="login" onSubmit={handleFormSubmit}>
              <h1>Login</h1>
              <input
                name="email"
                type="email"
                id="email"
                placeholder="Email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Password"
                value={formState.password}
                onChange={handleChange}
              />
              <a href="#/" className="forgot-password">
                Forgot your password?
              </a>
              <button>Login</button>
            </form>
            {error && <div>Login failed</div>}
        </div>
    </div>
  );
};

export default Login;
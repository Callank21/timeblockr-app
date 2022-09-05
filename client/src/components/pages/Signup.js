import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
// import { QUERY_USERS } from '../../utils/queries';
import { CREATE_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [createUser, {error}] = useMutation(CREATE_USER);

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();


    try {
      const { data } = await createUser({
        variables: { ...formState },
      });

      Auth.login(data.createUser.token);
      console.log(data.createUser.token);
    } catch (e) {
      console.error(e);
    }
    console.log(formState);
  };


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  return (
    <div className="signInContainer">
        <div id="signInCard">
          <form action="#" id="login" onSubmit={handleFormSubmit}>
              <h1>Sign Up</h1>
              <input
                name="username"
                type="text"
                id="username"
                placeholder="Username"
                value={formState.username}
                onChange={handleChange}
              />
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
              <a href="/login" className="forgot-password">
                Login
              </a>
              <button type="submit">Sign up</button>
            </form>
            {error && <div>Login failed</div>}
        </div>
    </div>
  );
};

export default Signup;
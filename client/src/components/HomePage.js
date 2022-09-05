import React from 'react';
import Auth from '../utils/auth';
import Signup from '../components/pages/Signup';
import ProjectInput from '../components/pages/ProjectInput';

const HomePage = () => {
  return (
    <section id="HomePage">
        {Auth.loggedIn() ? (
          <ProjectInput />
        ) : (
          <Signup />
        )}
    </section>
  );
};

export default HomePage;
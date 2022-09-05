import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const Header = () => {
  return (
    <section id="header">
        <div>
          {Auth.loggedIn() && (
            <div>
            <Link to="/">
          <div>Tasks</div>
          </Link>
          <Link to="/calendar">
          <div>Calendar</div>
          </Link>
          </div>
          )}
        </div>
        <Link to="/">
        <div>Timeblockr</div>
        </Link>
        <div className="loginButtons">
        {Auth.loggedIn() ? (
              <>
                <Link to="/" onClick={Auth.logout}>
                  <li key="login" className="nav-p">
                    LOGOUT
                  </li>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <li key="login" className="nav-p">
                    LOGIN
                  </li>
                </Link>
                <Link to="/signup">
                  <li key="signup" className="nav-p">
                    SIGNUP
                  </li>
                </Link>
              </>
            )}
        </div>
    </section>
  );
};

export default Header;

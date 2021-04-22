import React from 'react';
import Togglable from './Togglable';
import PropTypes from 'prop-types';

export default function LoginForm ({ handleSubmit, ...props }) {
  return (
    <Togglable buttonLabel='Show Login'>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type='text'
            value={props.username}
            onChange={props.handleUsernameChange}
            name='Username'
            placeholder='Username'
          />
        </div>
        <div>
          <input
            type='password'
            value={props.password}
            onChange={props.handlePasswordChange}
            name='Password'
            placeholder='Password'
          />
        </div>
        <button id="form-login-button">Login</button>
      </form>
    </Togglable>
  );
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string
};

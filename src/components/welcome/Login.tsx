import React, { useState, useLayoutEffect } from 'react';
import M from 'materialize-css';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FormWraper,
  FormHeader,
  FormTop,
  FildSpan,
  FormActions,
  FormBottom,
} from './comps';
import { Locker, Unlocker } from './Locker';
import { Link, Redirect } from 'react-router-dom';
import Ovary from './Ovary';
import { LinkStyles } from './Register';
import Header from './Header';
import { transition } from '../utils/variables';
import { SERVER_URL } from '../utils/constants';
import { axiosResponse } from './interface';

import { actionTypes } from '../../redux/actions';
import { useThunkDispatch, useTypedSelector } from '../../redux/stateTypes';

const Login = () => {
  const dispatch = useThunkDispatch();
  useLayoutEffect(() => {
    M.AutoInit();
    document.body.classList.add('login_bg');
    return () => {
      // Called just before the component unmount
      document.body.classList.remove('login_bg');
    };
  }, []);

  const [rememberMe, setRemember] = useState(true);
  const [email, setLoginEmail] = useState('');
  const [password, setloginPass] = useState('');
  const [showOvary, setShowOvary] = useState(false);
  const [lockShow, setLockShow] = useState(false);
  const [unlocker, setUnlocker] = useState(false);
  const manageLocker = () => {
    setLockShow(true);
    setTimeout(() => {
      setLockShow(false);
    }, 2000);
  };
  const manageUnlocker = () => {
    setUnlocker(true);
    setTimeout(() => {
      setUnlocker(false);
    }, 2000);
  };
  const openOvary = () => {
    setShowOvary(true);
  };
  const closeOvary = () => {
    setShowOvary(false);
  };
  const handleInputChange = (event: { target: any }) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setRemember(value);
  };
  const submit = async () => {
    if (!email || !password) {
      M.toast({ html: 'All fields are required', classes: 'rounded red' });
      manageLocker();
      return;
    }
    openOvary();
    try {
      const res = await axios.post(`${SERVER_URL}/auth/login`, {
        email,
        password,
      });

      closeOvary();
      const { success, error, token, data } = res.data as axiosResponse;
      if (!success) {
        M.toast({ html: error, classes: 'rounded red' });
        manageLocker();
      } else {
        manageUnlocker();
        dispatch({
          type: actionTypes.LOGIN,
          payload: {
            token,
            name: data.name,
            id: data._id,
            email: data.email,
          },
        });
        M.toast({ html: 'Success', classes: 'rounded green' });
        // M.toast({ html: 'Account created', classes: 'rounded green' });
      }
    } catch (error) {
      closeOvary();
    }finally{
      closeOvary();
    }
  };
  const { loggedIn, pending } = useTypedSelector((state) => state.auth);
  if (loggedIn) {
    return <Redirect to="/companies" />;
  }
  if (pending) {
    return <Redirect to="/security" />;
  }
  return (
    <motion.div

    // initial="exit"
    // animate="enter"
    // exit="exit"
    // variants={routeVariants}
    >
      <Header isHome={false} />
      <Ovary showOvary={showOvary} />
      <FormWraper
        data-testid="login-page"
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.1, transition } }}>
        <Locker lockShow={lockShow} />
        <Unlocker unlocker={unlocker} />
        <FormHeader>Log In</FormHeader>
        <FormTop>
          <div className="input-field col s12 field">
            <i className="material-icons tiny white-text prefix">email</i>
            <input
              id="em"
              type="email"
              value={email}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="validate white-text input_border"
            />
            <FildSpan />
            <label htmlFor="em">Email</label>
          </div>
          <div className="input-field col s12 field">
            <i className="tiny material-icons white-text prefix">lock</i>
            <input
              id="pas"
              type="password"
              className="white-text input_border"
              value={password}
              onChange={(e) => setloginPass(e.target.value)}
            />
            <FildSpan />
            <label htmlFor="pas">Password</label>
          </div>
          <FormActions>
            <ul>
              <li>
                <p>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={handleInputChange}
                    className="filled-in"
                    id="filled-in-box"
                  />
                  <label htmlFor="filled-in-box">Remember me</label>
                </p>
              </li>
              {/* <li>
                <Link >Forgot password?</Link>
              </li> */}
            </ul>
            <div className="clear"> </div>
          </FormActions>
        </FormTop>
        <FormBottom>
          <button
            data-testid="login-button"
            className="waves-effect waves-light"
            onClick={submit}>
            log in
          </button>
          <p style={LinkStyles.p}>
            Don't have an account?
            <Link style={LinkStyles.links} to="/register">
              Register
            </Link>
          </p>
        </FormBottom>
        {/* <Seperator>
          <Devider />
          <DeviderLable>OR</DeviderLable>
          <Devider />
        </Seperator> */}
        {/* <motion.button
          onClick={signIn}
          initial={{ y: '100vh' }}
          animate={{ y: 0 }}
          className="btn google red waves-effect waves-light btn-large">
          <b>login with google</b>
          <i className="fab fa-google right"></i>
        </motion.button> */}
      </FormWraper>
    </motion.div>
  );
};

export default Login;

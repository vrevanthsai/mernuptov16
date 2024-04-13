import React,{useState} from "react";

import Layout from "../../components/Layout/Layout";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
// global state
import { useAuth } from "../../context/auth";
// css
import "../../styles/AuthStyles.css";

// Eye icon setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

const emailRules = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|email)\.com$/;

// Schema-Validation(yup)
const validationSchema = yup
  .object({
    email: yup
      .string()
      .required("Email required")
      .email("Invalid email format")
      .matches(emailRules, { message: " Not valid :{" })
      .required("Email Required !"),
    password: yup
      .string()
      .required("Password Required")
  })
  .required();

const Login = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // toggling variable(state)
  const [passwordShown1, setPasswordShown1] = useState(false);
  // context variables
  const [auth,setAuth] = useAuth();

  // navigation
  const navigate = useNavigate();
  // location-to redirect to /dashboard after login
  const location = useLocation();

   // Login form function
   const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        data
      );
      if (res && res.data.success) {
        
        // update data to auth-state
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        })
        // storing in localStorage
        localStorage.setItem('auth',JSON.stringify(res.data));
        // navigation
        navigate( location.state || "/");
        // setTimeout used to make toast msg visible after navigation
        const timeout= setTimeout(() => {
          toast.success(res.data.message,{
            duration: 5000,
            position: 'top-center'
          });
        }, 1000);
        reset();
        // cleaner for setTimeout
        return () => clearTimeout(timeout);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    
  };

  return (
    <Layout title={"Login - ChocoStore"}>
      <div className="register login">
        <div className="container">
          <div className="register-form">
            <h1>Login page</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              
              <div className="mb-2">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="form-control"
                  id="email"
                  placeholder="Enter Your Email"
                  // required
                  autoFocus
                />
                {errors.email && (
                  <span className="errors">{errors.email.message}</span>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="pass-wrapper">
                  <input
                    type={passwordShown1 ? "text" : "password"}
                    {...register("password")}
                    className="form-control"
                    id="password"
                    placeholder="Enter Your Password"
                    // required
                  />
                  <i onClick={() => setPasswordShown1(!passwordShown1)}>
                    {eye}
                  </i>
                </div>
                {errors.password && (
                  <span className="errors">{errors.password.message}</span>
                )}
              </div>
              <div className="mb-3">
                <button type="button" className="btn btn-forgot" onClick={() => navigate('/forgot-password')}>
                  Forgot Password
                </button>
              </div>
              
              <div className="mb-1">
                <button type="submit" className="btn btn-register">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

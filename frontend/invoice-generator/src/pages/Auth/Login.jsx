import React, {useState} from 'react';
import { 
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,

 } from 'lucide-react';
import{API_PATHS} from '../../utils/apiPaths';
 import { useAuth } from '../../context/AuthContext';
 import {useNavigate} from 'react-router-dom';
 import { validateEmail, validatePassword, } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

const Login = () => {

  const {login} = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const[fieldErrors,setFieldErrors]= useState({ email:"", password:""});
  const [touched, setTouched] = useState({ email:false, password:false});

  const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    //real-time validation
    if(touched[name]){
      const newFieldErrors = {...fieldErrors};
      if(name === "email"){
        newFieldErrors.email= validateEmail(value);
      }else if(name === "password"){
        newFieldErrors.password = validatePassword(value)
      }
      setFieldErrors(newFieldErrors);
    }
    if (error) setError("");
  };

  const handleBlur = (e) => {
    const {name} = e.target;
    setTouched ((prev)=> ({
      ...prev,
      [name]: true,
    }));

    //validate on blur
    const newFieldErrors = {...fieldErrors};
    if (name === "email") {
      newFieldErrors.email = validateEmail(formData.email);
    }else if (name === "password") {
      newFieldErrors.password = validatePassword
    }
    setFieldErrors(newFieldErrors); 
  };

  const isFormValid = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    return !emailError && !passwordError && formData.email && formData.password;
  };

  const handleSubmit = async () => {
    //validate all field before submission
    const emailError= validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setFieldErrors({
        email: emailError,
        password:passwordError,
      });
      setTouched({
        email: true,
        password: true,
      });
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);

      if(response.status === 2000){
        const {token} = response.data;

        if (token){
          setSuccess("Login Successfull");
          login(response.data, token);

          // redirect based on role
          setTimeout(()=>{
            window.location.href = '/dashboard'
          }, 2000);
        }
      }else{
        setError(response.data.message || "Invalid Credentials")
      }
    } catch (err) {
      if(err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
      }else{
        setError("An error occurred during login.")
      }
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>
      <div className='w-full max-w-sm'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='w-12 h-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl mx-auto flex items-center justify-center'>
           <FileText className='w-6 h-6 text-white' /> 
          </div>
          <h1 className='textt-2xl font-semibold text-gray-900 mb-2'>Login to Your Account</h1>
          <p className='text-gray-600 text-sm'>Welcome Back to Invoice Generator</p>
        </div>
        
        {/* Form */}
        <div className='space-y-4'>
        {/* Email Field */}
        <div>
          <label className='bock text-sm font-medium text-gray-700 mb-2'>Email Address</label>
          <div className='relative'>
            <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />
            <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full pl-12 pr-4 pu-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all
              ${fieldErrors.email && touched.email 
              ? "border-red-300 focus:ring-red-500" 
              : "border-gray-300 focus:ring-black-500"
              }`}
              placeholder='Enter your Email'
            />
          </div>
          {fieldErrors.email && touched.email && (
            <p className='mt-1 text-sm text-red-600'>{fieldErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
          <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
          <div className='relative'>
            <Lock className='absolute left-4 top-1/2 transform -translate-y-1.5 text-gray-400 w-5 h-5' />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all
              ${fieldErrors.password && touched.password 
              ? "border-red-300 focus:ring-red-500" 
              : "border-gray-300 focus:ring-black-500"
              }`}
              placeholder='Enter your Password'
            />
            <button onClick={() => setShowPassword(!showPassword)} className='absolute right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'>
              {showPassword ? (<EyeOff  className='w-5 h-5'/>) :(<Eye className='w-5 h-5' />)}
            </button>
          </div>

          {fieldErrors.password && touched.password && (
            <p className='mt-1 text-sm text-red-600'>{fieldError.password}</p>
          )}
          {/* Error/Sucess Message */}
          {error && (<div className='p3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-600 text-sm'>{error}</p>
            </div>
          )}
          {success && (<div className='p3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-green-600 text-sm'>{success}</p>
            </div>
          )}
        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          disabled={!isFormValid() || isLoading}
          className='w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disable:cursor-not-allowed transition-colors flex items-center justify-center group'
        >
          {isLoading ? (
            <>
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            Signing in...
            </>
            
          ) : (
            <>Sign In 
            <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform ' />
            </>
          )}
        </button>
      </div>
      {/* Footer */}
        <div className='mt-6 pt-4 border-t border-gray-200 text-center'>
        <p className='text-sm text-gray-600'>
          Don't have an account?{' '}
          <button
          className='text-black font-medium hover:underline'
          onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </p>
      </div>
           
      </div>

      
    </div>
  )
}

export default Login
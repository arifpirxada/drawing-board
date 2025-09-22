import { useForm } from "react-hook-form"
import registerImg2 from "../../assets/images/register-2.png";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { authApi, tokenStorage } from "../../features/auth/auth";

function SignupForm() {

  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const registerUser = async (data) => {
    try {
      // Password check
      setSubmitting(true)

      if (data.password !== data.cpassword) {
        setErrorMessage("Passwords do not match")
        return;
      }

      const res = await authApi.createUser(data)

      if (res.success && res.access_token) {
        setSuccess(true)

        tokenStorage.setToken(res.access_token)
      } else {
        throw new Error("Registration unsuccessfull")
      }
      setErrorMessage("")
      setSubmitting(false)
    } catch (err) {
      setSubmitting(false)
      setSuccess(false)
      if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail)
      } else {
        setErrorMessage("Registration unsuccessfull! Please try later")
      }
    }
  }

  return (
    <div className="login-form-container flex justify-center items-center h-screen gap-12">
      <form onSubmit={ handleSubmit(registerUser) } className="login-form w-1/3 px-12 mt-12 py-8 rounded">
        <h1 className="text-white text-2xl mb-4 font-bold">Join Drawing Board</h1>
        <div className="relative z-0 w-full mb-5 group">
          <input type="text" name="sign-name" id="sign-name" { ...register("name", { required: true }) } className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label htmlFor="sign-name" className="peer-focus:font-medium form-input absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="email" name="sign-email" id="sign-email" { ...register("email", { required: true }) } className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label htmlFor="sign-email" className="peer-focus:font-medium form-input absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="password" name="sign-password" id="sign-password" { ...register("password", {
            required: true, minLength: {
              value: 4,
              message: "Password must be at least 4 characters"
            }
          }) } className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label htmlFor="sign-password" className="peer-focus:font-medium form-input absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="password" name="sign-c-password" id="sign-c-password" { ...register("cpassword", { required: true }) } className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label htmlFor="sign-c-password" className="peer-focus:font-medium form-input absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm Password</label>
        </div>

        { errors && <div className="errors mb-2">
          <p className="text-[#ff8d8d]">{ errors.password && errors.password.message && <span>{ errors.password.message }</span> }</p>
        </div> }

        { errorMessage && <div className="errors mb-2">
          <p className="text-[#ff8d8d]"><span>{ errorMessage }</span></p>
        </div> }
        { success && <div className="success mb-2">
          <p className="text-[#7bd13c] font-bold"><span>Registration successfull</span></p>
        </div> }

        <div className="free-trial flex flex-wrap-reverse">
          <p className="text-white mt-6 text-sm mr-8">Already a member? <Link to="/login" className="text-blue-400 hover:underline">Login</Link></p>
          <button type="submit" className="free-trial-btn mt-4">{ submitting ? "Sign..." : "Sign Up" }</button>
        </div>
      </form>
      <img className='login-image w-1/5' src={ registerImg2 } alt="" />
    </div>
  )
}

export default SignupForm
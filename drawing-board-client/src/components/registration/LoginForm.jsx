import registerImg from "../../assets/images/register.png";
import { Link } from "react-router-dom";

function LoginForm() {
  return (
    <div className="login-form-container flex justify-center items-center h-screen gap-12">
      <form className="login-form w-1/3 px-12 mt-12 py-8 rounded">
        <h1 className="text-white text-2xl mb-4 font-bold">Login to Drawing Board</h1>
        <div className="relative z-0 w-full mb-5 group">
          <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label htmlFor="email" className="peer-focus:font-medium form-input absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label htmlFor="password" className="peer-focus:font-medium form-input absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
        </div>

        <div className="free-trial flex flex-wrap-reverse">
          <p className="text-white mt-6 text-sm mr-8">Not a member? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link></p>
          <button type="submit" className="free-trial-btn mt-4">Login</button>
        </div>
      </form>
      <img className='login-image w-1/5' src={ registerImg } alt="" />
    </div>
  )
}

export default LoginForm
import { FaHandPeace } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import loginbanner from '@/assets/images/loginbanner.png';
import { useToast } from '@/hooks/use-toast.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { isEmailValid, isPasswordValid } from '../../utils/regexpValidator.js';
import {
  REGISTER_ROUTE,
  LOGIN_ROUTE,
} from '../../constants/routes.constants.js';
import useAppStore from '../../slices/user.slice.js';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  function validateSignup() {
    if (!userInput.email || !userInput.password) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Please fill in all the details!',
      });
      return false;
    }

    if (!isEmailValid(userInput.email)) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Email is invalid!',
      });
      return false;
    }

    if (!isPasswordValid(userInput.password)) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description:
          'Password should be 6 characters containing symbols & numbers!',
      });
      return false;
    }

    if (userInput.password !== userInput.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Password and confirm password does not match!',
      });
      return false;
    }

    return true;
  }

  function validateLogin() {
    if (!userInput.email || !userInput.password) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Please fill in all the details!',
      });
      return false;
    }

    return true;
  }

  async function handleSignup() {
    if (!validateSignup()) return;

    const data = {
      email: userInput.email,
      password: userInput.password,
    };

    try {
      const res = await axiosInstance.post(REGISTER_ROUTE, data);

      if (res?.data?.success) {
        setUserInfo(res?.data?.newUser);
        navigate('/profile');
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: e?.response?.data?.message,
      });
    }

    setUserInput({
      email: '',
      password: '',
      confirmPassword: '',
    });
  }

  async function handleLogin() {
    if (!validateLogin()) return;

    const data = {
      email: userInput.email,
      password: userInput.password,
    };

    try {
      const res = await axiosInstance.post(LOGIN_ROUTE, data);

      if (res?.data?.success) {
        setUserInfo(res?.data?.user);
        navigate('/chat');
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: e?.response?.data?.message,
      });
    }

    setUserInput({
      email: '',
      password: '',
      confirmPassword: '',
    });
  }

  return (
    <div className="font-para w-[100vw] h-[100vh] flex justify-center items-center p-4 bg-background text-foreground">
      <div className="bg-popover text-popover-foreground w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[65vw] h-auto shadow-[4px_4px_10px_gray] p-8 rounded-md flex gap-6">
        <div className="flex-1 flex flex-col justify-center items-center gap-3">
          <h1 className="text-3xl font-bold text-center">
            Welcome <FaHandPeace className="text-yellow-500 inline" />{' '}
          </h1>
          <p className="text-md">
            {' '}
            fill in the details to get started with Pinge app.{' '}
          </p>

          <div className="w-[90%] flex items-center justify-center">
            <Tabs defaultValue="login" className="w-[400px]">
              <TabsList className="w-full bg-transparent">
                <TabsTrigger
                  className="w-full data-[state=active]:bg-transparent data-[state=active]:border-b-[4px] data-[state=active]:border-primary text-md"
                  value="login"
                >
                  login
                </TabsTrigger>
                <TabsTrigger
                  className="w-full data-[state=active]:bg-transparent data-[state=active]:border-b-[4px] data-[state=active]:border-primary text-md"
                  value="signup"
                >
                  signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <div className="flex flex-col justify-center gap-3 mt-5">
                  <input
                    type="email"
                    placeholder="your email"
                    value={userInput.email}
                    onChange={handleInputChange}
                    name="email"
                    className="border rounded-md py-2 px-3 border-input focus:border-ring  outline-none"
                  />
                  <input
                    type="password"
                    placeholder="your password"
                    value={userInput.password}
                    onChange={handleInputChange}
                    name="password"
                    className="border rounded-md py-2 px-3 border-input focus:border-ring outline-none"
                  />

                  <button
                    onClick={handleLogin}
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg py-2 text-md font-semibold transition-all duration-300 ease-in-out"
                  >
                    Login
                  </button>
                </div>
              </TabsContent>
              <TabsContent value="signup">
                <div className="flex flex-col justify-center gap-3 mt-5">
                  <input
                    type="email"
                    placeholder="your email"
                    value={userInput.email}
                    onChange={handleInputChange}
                    name="email"
                    className="border rounded-md py-2 px-3 border-input focus:border-ring  outline-none"
                  />
                  <input
                    type="password"
                    placeholder="your password"
                    value={userInput.password}
                    onChange={handleInputChange}
                    name="password"
                    className="border rounded-md py-2 px-3 border-input focus:border-ring outline-none"
                  />
                  <input
                    type="password"
                    placeholder="confirm password"
                    value={userInput.confirmPassword}
                    onChange={handleInputChange}
                    name="confirmPassword"
                    className="border rounded-md py-2 px-3 border-input focus:border-ring outline-none"
                  />

                  <button
                    onClick={handleSignup}
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg py-2 text-md font-semibold transition-all duration-300 ease-in-out"
                  >
                    Signup
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center w-full p-4">
          <div className="w-full">
            <img
              src={loginbanner}
              alt="login banner"
              className="w-full h-full object-contain "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

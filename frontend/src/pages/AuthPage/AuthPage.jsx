import { FaHandPeace } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import loginbanner from '@/assets/images/loginbanner.png';


const AuthPage = () => {
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function handleLogin(){

  }

  async function handleSignup(){
    
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

                  <button onClick={handleLogin} className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg py-2 text-md font-semibold transition-all duration-300 ease-in-out">
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

                  <button onClick={handleSignup} className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg py-2 text-md font-semibold transition-all duration-300 ease-in-out">
                    Signup
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center w-full p-4">
        
  
          <div className="w-full">
                    <img  src={loginbanner}  alt="login banner" className="w-full h-full object-contain " />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;

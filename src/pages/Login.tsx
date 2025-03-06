import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    const payload = { username, password };

    try {
      const response = await api.post('/login', payload);
      if(response.data.data.role === "STUDENT") {
        return ;
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate('/course');
      }
      // console.log(response.data.data);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-75">
      <div
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        style={{ width: '800px', maxWidth: '90%' }}
      >
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white text-center">
            Login
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <div>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-3 block text-black dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-3 block text-black dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => handleLogin()}
                className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded w-full"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import reactLogo from './assets/react.svg';
import denoLogo from './assets/deno.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useGetNamesQuery } from './services/names';
import { selectIsLoggedIn } from './features/Auth/authSlice';
import { useAppSelector } from './store';
import { useLoginMutation } from './services/auth';

function App() {
  const [count, setCount] = useState(0);
  const { data, isFetching } = useGetNamesQuery({ page: count });
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  console.log('isFetching', isFetching);
  return (
    <>
      <div>
        <a href="https://github.com/muhrifqii" target="_blank">
          <img
            src="https://raw.githubusercontent.com/muhrifqii/curium-go-fiber/master/assets/cm_pertable.png"
            className="curium"
            alt="Curium logo"
          />
        </a>
      </div>
      <div>
        <a href="https://deno.com" target="_blank">
          <img src={denoLogo} className="logo deno" alt="Deno logo" />
        </a>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Deno + Vite + React</h1>
      <div className="card">
        {isLoggedIn && !isLoginLoading ? (
          <button
            onClick={() => setCount((count) => count + 1)}
            disabled={isFetching}
          >
            page count is {count}
          </button>
        ) : (
          <button
            onClick={() => login({ username: 'admin', password: 'admin' })}
          >
            Authenticate!
          </button>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        {isFetching ? (
          <p>Loading...</p>
        ) : (
          data && data.data.map((name) => <p key={name}>{name}</p>)
        )}
      </div>
    </>
  );
}

export default App;

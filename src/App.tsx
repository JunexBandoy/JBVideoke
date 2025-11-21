import { Main } from './components/pages/Queueing/Main';
import QueuePlayer from './components/pages/Videoke/QueuePlayer';
import LogoutButton from './logout';

const App = () => {
  return (
    <Main>
      <div className="min-h-screen bg-gradient-to-r from-green-300 via-green-200 to-green-100 font-serif p-6">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <QueuePlayer />
        </div>
      </div>
    </Main>
  );
};

export default App;

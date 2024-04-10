import './App.css';
import Countdown from './components/Countdown';

function App() {
  return (
    <div className="App">
      <h1 className='main_heading'>Countdown <span className='main_heading-2'>Timer</span></h1>
      <Countdown />
    </div>
  );
}

export default App;

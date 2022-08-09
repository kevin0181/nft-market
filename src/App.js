import logo from './logo.svg';
import './App.css';
import {readCount, getBalance, setCount} from "./api/UseCaver";


function App() {
    readCount();
    getBalance("0x27b0e5b4d3f72e8f26f4c58a5ee7b04516fb3034");
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <button title={'카운트 변경'} onClick={() => {
                    setCount(202)
                }}>카운트 변경
                </button>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;

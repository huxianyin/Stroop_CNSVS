import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import PartOne from './components/PartOne';
import PartTwo from './components/PartTwo';
import PartThree from './components/PartThree';
import FinishPage from './components/FinishPage';
import { useState } from 'react';
import {BrowserRouter} from 'react-router-dom'

const colors=[
  {"name":"赤","color":"#ff4b00"},
  {"name":"青","color":"#005aff"},
  {"name":"黄","color":"#fff100"},
  {"name":"緑","color":"#03af7a"},
]
const settings = {
  "interval" : 2000,
  "interval_variation": 1000,

  "retention_interval":1000,
  "retention_interval_variation":500,
  "trials":4,
  "dummy":{"name":"黒","color":"#D4D4D4"},
  "color-name-dict":{"#ff4b00":"赤", "#005aff":"青", "#fff100":"黄", "#03af7a":"緑"}
}

function App() {
  const [login, setLogin] = useState(false);
  const [partOneFinished, setPartOneFinished] = useState(false);
  const [partTwoFinished, setPartTwoFinished] = useState(false);
  const [partThreeFinished, setPartThreeFinished] = useState(false);
  const [responseData, setResponseDate] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const UpdateResponseData = (data)=>{
    setResponseDate([...responseData, data]);
  }

  const shuffle = (array)=> {
    let currentIndex = array.length,  randomIndex;
      // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  const GenerateInterval= (mean,variation) =>{
    const min = mean - variation;
    const max = mean + variation;
    return Math.floor(Math.random()*(max-min+1) + min);
  }

  const render=()=>{
    if(!login){
      return (<Login setUserInfo={setUserInfo} onStart={()=>{setLogin(true)}}></Login>)
    }
    else if(!partOneFinished){
      return (<PartOne colors={colors} settings={settings} 
      onFinished={()=>setPartOneFinished(true)} 
      shuffle={shuffle}
      GenerateInterval={GenerateInterval}
      UpdateResponseData={UpdateResponseData}>
      </PartOne>);
    }
    else if(partOneFinished && !partTwoFinished){
      return (<PartTwo colors={colors} settings={settings} 
      onFinished={()=>setPartTwoFinished(true)} 
      shuffle={shuffle}
      GenerateInterval={GenerateInterval}
      UpdateResponseData={UpdateResponseData}>
      </PartTwo>);
    }
    else if(partOneFinished && partTwoFinished && !partThreeFinished){
      return (<PartThree colors={colors} settings={settings} 
      onFinished={()=>setPartThreeFinished(true)} 
      shuffle={shuffle}
      GenerateInterval={GenerateInterval}
      UpdateResponseData={UpdateResponseData}>
      </PartThree>);
    }
    else{
      return (<FinishPage settings={settings} data={responseData} userInfo={userInfo}></FinishPage>);
    }
  }


  return (
    <BrowserRouter>
     <div className="App">
     <header>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
        integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" 
        crossorigin="anonymous"></link>
      </header>
        <div className='body'>
          {render()}
        </div>
      </div>
      </BrowserRouter>
  );
}

export default App;

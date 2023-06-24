import logo from './logo.svg';
import './App.css';
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
  "dummy":{"name":" ","color":"white"},
  "color-name-dict":{"#ff4b00":"赤", "#005aff":"青", "#fff100":"黄", "#03af7a":"緑"}
}

function App() {
  const [partOneFinished, setPartOneFinished] = useState(false);
  const [partTwoFinished, setPartTwoFinished] = useState(false);
  const [partThreeFinished, setPartThreeFinished] = useState(false);
  const [responseData, setResponseDate] = useState([]);

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


  const render=()=>{
    if(!partOneFinished){
      return (<PartOne colors={colors} settings={settings} 
      onFinished={()=>setPartOneFinished(true)} 
      shuffle={shuffle}
      UpdateResponseData={UpdateResponseData}>
      </PartOne>);
    }
    else if(partOneFinished && !partTwoFinished){
      return (<PartTwo colors={colors} settings={settings} 
      onFinished={()=>setPartTwoFinished(true)} 
      shuffle={shuffle}
      UpdateResponseData={UpdateResponseData}>
      </PartTwo>);
    }
    else if(partOneFinished && partTwoFinished && !partThreeFinished){
      return (<PartThree colors={colors} settings={settings} 
      onFinished={()=>setPartThreeFinished(true)} 
      shuffle={shuffle}
      UpdateResponseData={UpdateResponseData}>
      </PartThree>);
    }
    else{
      return (<FinishPage settings={settings} data={responseData} ></FinishPage>);
    }
  }


  return (
    <BrowserRouter>
     <div className="App">
        <div className='body'>
          {render()}
        </div>
      </div>
      </BrowserRouter>
  );
}

export default App;

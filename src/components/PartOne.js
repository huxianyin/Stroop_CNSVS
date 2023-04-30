
import { useState,useEffect } from 'react';
import '../css/Part.css';
import '../css/btn.css'
const part = 1;

function PartOne({colors,settings,onFinished,shuffle,UpdateResponseData}) {
  const [started, setStarted] = useState(false);
  const [trial, setTrial] = useState(0);
  const [responded, setResponded] = useState(false);
  const [retention, setRentention] = useState(false);
  const [trialStartTime, setTrialStartTime] = useState(0);
  const [stimuli, setStimuli] = useState(null);
  const [stimuliArray, setStimuliArray] = useState([]);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  const [data, setData] = useState(null);

  const GenerateStimuliArray = ()=>{
    var array = [];
    const n_repeat = Math.ceil(settings.trials / colors.length);
    for(var i=0;i<n_repeat;i++){
      const copied = colors;
      shuffle(copied);
      array = array.concat(copied);
    }
    setStimuliArray(array.slice(0,settings.trials));
  }

  const PresentStimuli = async()=>{
    var cnt = 0;
    while(cnt < settings.trials){
      setTrialStartTime(Date.now());
      setTrial(cnt);
      setResponded(false);
      setData(null);
      setRentention(false);

      setStimuli(stimuliArray[cnt]);
      await sleep(settings.interval);

      setRentention(true);
      await sleep(100);
      setStimuli(settings.dummy);
      await sleep(settings.retention_interval);

      cnt+=1;
    }
    setStarted(false);
    onFinished();
    
  }

  const onResponse = ()=>{
    const now = Date.now();
    const rt = now - trialStartTime;
    const data = {"part":part,"trial":trial,"timestamp":now,
    "s_name":stimuli["name"],"s_color": "黒",
    "target":stimuli.name!="+",
    "rt":rt, 
    "correct": stimuli.name!="+"};
    setData(data);
    setResponded(true);
  }

   useEffect(() => {
        GenerateStimuliArray();
    }, [])

  useEffect(() => {
    if(retention && !responded && stimuli){
      setData({
        "part":part,"trial":trial,"timestamp":Date.now(),
        "s_name":stimuli["name"],"s_color": "黒",
        "target":true,
        "rt":null, 
        "correct": false,
      });
    }
  },[retention])

  useEffect(()=>{
    if(data){
      UpdateResponseData(data);
    }
  },[data])


  const onStart = ()=>{
    setStarted(true);
    PresentStimuli();
  }
  
    return (
        <div>
          {!started?
          <div className='Instruction'>
            <h1>第一部分</h1>
            <div className="Description">
                <span>文字が</span>
                <span className="strong">現れる</span>
                <span>時、</span>
              <span>ボタンを押す</span>
            </div>
            <div className='Example'>
              <div className='element'><span style={{color:"black"}}>赤</span></div>
              <div className='element'><span style={{color:"black"}}>+</span></div>
            </div>
            <div className='Feedback'>
              <div className='element'><span>✔️</span></div>
              <div className='element'><span>✖️</span></div>
            </div>
            <button className="btn-push" onClick={onStart}>開始</button>
           </div>:
           <div className='Task'>
            <p className='Stimuli' 
            style={{"color":"black"}}>
              {stimuli["name"]}
            </p>
            <button className='btn-push' onClick={onResponse}>ボタン</button>
            
           
           </div>
           }

        </div>
      
      );
}


export default PartOne;
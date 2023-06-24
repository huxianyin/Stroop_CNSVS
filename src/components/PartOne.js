
import { useState,useEffect } from 'react';
import '../css/Part.css';
import '../css/btn.css'
const part = 1;

function PartOne({colors,settings,onFinished,shuffle,UpdateResponseData}) {
  const [started, setStarted] = useState(false);
  const [trial, setTrial] = useState(-1);
  const [trialStartTime, setTrialStartTime] = useState(0);

  const [stimuli, setStimuli] = useState(null);
  const [stimuliArray, setStimuliArray] = useState([]);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  const [rt, setRT] = useState(-1);
  const [responded, setResponded] = useState(false);

  const GenerateStimuliArray = ()=>{
    var array = [];
    const n_repeat = Math.ceil(settings.trials / colors.length);
    for(var i=0;i<n_repeat;i++){
      let copied = colors.slice();
      shuffle(copied);
      array = array.concat(copied);
    }
    setStimuliArray(array.slice(0,settings.trials));
  }

  const GenerateInterval = (mean,variation) => {
    const max = mean + variation;
    const min = mean - variation;
    const interval = Math.floor(Math.random() * (max - min + 1) + min);
    return interval;
  }

  const PresentStimuli = async()=>{
    var cnt = 0;
    while(cnt < settings.trials){
      //set start trail state variable
      setTrialStartTime(Date.now());
      setRT(-1);
      setResponded(false);
      //present stimuli
      setStimuli(stimuliArray[cnt]);
      
      const interval =GenerateInterval(settings.interval,settings.interval_variation);
      console.log(interval); 
      await sleep(interval);

      //update record data
      setTrial(cnt);
      await sleep(100);

      //rentention interval
      setStimuli(settings.dummy);
      await sleep(GenerateInterval(settings.retention_interval,settings.retention_interval_variation));

      cnt+=1;
    }
    setStarted(false);
    onFinished();
    
  }

  const onResponse = ()=>{
    if(!responded){
    const now = Date.now();
    const rt = now - trialStartTime;
    setRT(rt);
    setResponded(true);
    }
  }

   useEffect(() => {
        GenerateStimuliArray();
    }, [])

  useEffect(()=>{
    if(trial >=0 ){
      const data = {"part":part, "trail":trial, "timestamp":Date.now(), 
      "s_name":stimuli.name, "s_color":"黒",
      "rt":rt,"target":true,"correct":true}
      //console.log(data);
      UpdateResponseData(data)
    }
  },[trial])


  const onStart = ()=>{
    setStarted(true);
    PresentStimuli();
  }

  const render_description = ()=> {
    return (<div className="Description">
    <span>文字が</span>
    <span className="strong">表示されたら<br></br></span>
  <span>すぐボタンを押す</span>
  </div>);
}
  
    return (
        <div>
          {!started?
          <div className='Instruction'>
            <h1>第一部分</h1>
            {render_description()}
            <div className='Example'>
              <div className='element'><p>赤</p></div>
              {/* <div className='element'><p> </p></div> */}
            </div>
            <div className='Feedback'>
              <div className='element'><p>✔️</p></div>
              {/* <div className='element'><p>✖️</p></div> */}
            </div>
            <button className="btn-push" onClick={onStart}>開始</button>
           </div>:
           <div className='Task'>
            {render_description()}
            <div className='Stimuli'>
              <p >{stimuli["name"]}</p>
            </div>
            <button className='btn-push' onClick={onResponse}>ボタン</button>
            
           
           </div>
           }

        </div>
      
      );
}


export default PartOne;
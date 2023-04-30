
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
      const copied = colors;
      shuffle(copied);
      array = array.concat(copied);
    }
    setStimuliArray(array.slice(0,settings.trials));
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
      await sleep(settings.interval);
      //update record data
      setTrial(cnt);
      await sleep(100);

      //rentention interval
      setStimuli(settings.dummy);
      await sleep(settings.retention_interval);

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
  
    return (
        <div>
          {!started?
          <div className='Instruction'>
            <h1>第一部分</h1>
            <div className="Description">
                <span>文字が</span>
                <span className="strong">現れる</span>
                <span>時、<br></br></span>
              <span>ボタンを押す</span>
            </div>
            <div className='Example'>
              <div className='element'><p>赤</p></div>
              <div className='element'><p>+</p></div>
            </div>
            <div className='Feedback'>
              <div className='element'><p>✔️</p></div>
              <div className='element'><p>✖️</p></div>
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

import { useState,useEffect } from 'react';
import '../css/Part.css';
import '../css/btn.css'

function PartOne({colors,settings,onFinished,shuffle}) {
  const [started, setStarted] = useState(false);
  const [stimuli, setStimuli] = useState(colors[3]);
  const [stimuliArray, setStimuliArray] = useState([]);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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
    console.log(stimuliArray);
    var n_trial = 0;
    while(n_trial < settings.trials){
      setStimuli(stimuliArray[n_trial]);
      await sleep(settings.interval);
      
      setStimuli(settings.dummy);
      await sleep(settings.retention_interval);
      n_trial += 1;
    }
    setStarted(false);
    onFinished();
  }

   useEffect(() => {
        GenerateStimuliArray();
    }, [])


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
            <button className='btn-push'>ボタン</button>
            
           
           </div>
           }

        </div>
      
      );
}


export default PartOne;
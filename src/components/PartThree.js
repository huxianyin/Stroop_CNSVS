
import { useState,useEffect } from 'react';
import '../css/Part.css';
import '../css/btn.css'
const part = 3;

function PartThree({colors,settings,onFinished,shuffle,UpdateResponseData}) {
  const [started, setStarted] = useState(false);
  const [trial, setTrial] = useState(-1);
  const [trialStartTime, setTrialStartTime] = useState(0);

  const [stimuli, setStimuli] = useState(null);
  const [stimuliArray, setStimuliArray] = useState([]);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  const [rt, setRT] = useState(-1);


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

  const pick_another_color = (name)=>{
    let tmpset = colors.slice();
    tmpset = tmpset.filter(item => item.name!=name);
    const rand = Math.floor(Math.random()*tmpset.length);
    return tmpset[rand].color;
    
  }

  const PresentStimuli = async()=>{
    var incongruent_indices = [...Array(stimuliArray.length).keys()];
    shuffle(incongruent_indices);
    incongruent_indices = incongruent_indices.slice(0,Math.ceil(incongruent_indices.length/2));  
    var cnt = 0;
    while(cnt < settings.trials){
      //set start trail state variable
      setTrialStartTime(Date.now());
      setRT(-1);
      //present stimuli
      var s = stimuliArray[cnt];
      if(incongruent_indices.includes(cnt)){
        s["color"] = pick_another_color(s["name"]);
      }
      setStimuli(s);
      await sleep(settings.interval);

      //update record data
      setTrial(cnt);
      await sleep(100);

      //rentention interval
      setStimuli(settings.dummy);
      await sleep(settings.retention_interval);
      cnt += 1;
    }
    setStarted(false);
    onFinished();
  }

  const onResponse = ()=>{
    setRT(Date.now()-trialStartTime);
  }


   useEffect(() => {
        GenerateStimuliArray();
    }, [])


    useEffect(()=>{
      if(trial >=0 ){
        const is_target = stimuli.name != settings["color-name-dict"][stimuli.color]; //一致しない
        const data = {"part":part, "trail":trial, "timestamp":Date.now(), 
        "s_name":stimuli.name, "s_color": settings["color-name-dict"][stimuli.color],
        "rt":rt,"target":is_target,"correct": (is_target && rt>0) || (!is_target && rt<0)}
        UpdateResponseData(data)
      }
    },[trial])
  
  



  const onStart = ()=>{
    setStarted(true);
    PresentStimuli();
  }
  
    return (
        <div className='body'>
          {!started?
          <div className='Instruction'>
            <h1>第三部分</h1>
            <div className="Description">
                <span>色と文字が</span>
                <span className="strong">一致しない</span>
                <span>時、<br></br></span>
              <span>ボタンを押す</span>
            </div>
            <div className='Example'>
              <div className='element'><p style={{color:"blue"}}>赤</p></div>
              <div className='element'><p style={{color:"red"}}>赤</p></div>
              <div className='element'><p style={{color:"black"}}>+</p></div>
            </div>
            <div className='Feedback'>
              <div className='element'><p>✔️</p></div>
              <div className='element'><p>✖️</p></div>
              <div className='element'><p>✖️</p></div>
            </div>
            <button className="btn-push" onClick={onStart}>開始</button>
           </div>:
           <div className='Task'>
            <p className='Hint'>ヒント：一致しない</p>
            <div className='Stimuli'>
              <p style={{"color":stimuli["color"]}}>{stimuli["name"]}</p>
            </div>
            <button className='btn-push' onClick={onResponse}>ボタン</button>
           </div>
           }

        </div>
      
      );
}


export default PartThree;
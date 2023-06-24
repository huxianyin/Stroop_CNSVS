
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
      let copied = [...colors];
      shuffle(copied);
      array = array.concat(copied);
    }
    array = array.slice(0,settings.trials);
    
    var incongruent_indices = [...Array(array.length).keys()];
    shuffle(incongruent_indices);
    incongruent_indices = incongruent_indices.slice(0,Math.ceil(incongruent_indices.length/2));  
    
    var new_array = [];

    for(var i=0;i<array.length;i++){
      var s={};
      s["name"] = array[i]["name"];
      if(incongruent_indices.includes(i)){
        s["color"] = pick_another_color(s["name"]);
      } 
      else{
        s["color"] = array[i]["color"];
      }
      new_array.push(s);
    }
    setStimuliArray(new_array);

    // new_array.forEach((a,idx)=>{
    //   console.log(idx,a.name,settings["color-name-dict"][a.color], settings["color-name-dict"][a.color]==a.name);
    // })
    
  }

  const pick_another_color = (name)=>{
    let tmpset = [...colors];
    tmpset = tmpset.filter(item => item.name!=name);
    const rand = Math.floor(Math.random()*tmpset.length);
    //console.log(name,tmpset,rand,tmpset[rand].color);
    return tmpset[rand].color;
    
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
      //present stimuli
      setStimuli(stimuliArray[cnt]);
      await sleep(GenerateInterval(settings.interval,settings.interval_variation));

      //update record data
      setTrial(cnt);
      await sleep(100);

      //rentention interval
      setStimuli(settings.dummy);
      await sleep(GenerateInterval(settings.retention_interval,settings.retention_interval_variation));
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

  const render_description = ()=>{
   return ( <div className="Description">
                <span>色と文字が</span>
                <span className="strong">一致しない</span>
                <span>時、<br></br></span>
              <span>ボタンを押す</span>
            </div>);
  }
  
    return (
        <div className='body'>
          {!started?
          <div className='Instruction'>
            <h1>第三部分</h1>
           {render_description()}
            <div className='Example'>
              <div className='element'><p style={{color:"blue"}}>赤</p></div>
              <div className='element'><p style={{color:"red"}}>赤</p></div>
              {/* <div className='element'><p style={{color:"black"}}>+</p></div> */}
            </div>
            <div className='Feedback'>
              <div className='element'><p>✔️</p></div>
              <div className='element'><p>✖️</p></div>
              {/* <div className='element'><p>✖️</p></div> */}
            </div>
            <button className="btn-push" onClick={onStart}>開始</button>
           </div>:
           <div className='Task'>
            {render_description()}
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
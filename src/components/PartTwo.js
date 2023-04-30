
import { useState,useEffect } from 'react';
import '../css/Part.css';
import '../css/btn.css'

function PartTwo({colors,settings,onFinished,shuffle,UpdateResponseData}) {
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
    console.log(incongruent_indices);
    
    var n_trial = 0;
    while(n_trial < settings.trials){
      var s = stimuliArray[n_trial];
      if(incongruent_indices.includes(n_trial)){
        s["color"] = pick_another_color(s["name"]);
      }
      setStimuli(s);
      
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
        <div className='body'>
          {!started?
          <div className='Instruction'>
            <h1>第二部分</h1>
            <div className="Description">
                <span>色と文字が</span>
                <span className="strong">一致</span>
                <span>する時、</span>
              <span>ボタンを押す</span>
            </div>
            <div className='Example'>
              <div className='element'><span style={{color:"red"}}>赤</span></div>
              <div className='element'><span style={{color:"blue"}}>赤</span></div>
              <div className='element'><span style={{color:"black"}}>+</span></div>
            </div>
            <div className='Feedback'>
              <div className='element'><span>✔️</span></div>
              <div className='element'><span>✖️</span></div>
              <div className='element'><span>✖️</span></div>
            </div>


            <button className="btn-push" onClick={onStart}>開始</button>
           </div>:
           <div className='Task'>
            <p className='Stimuli' 
            style={{"color":stimuli["color"]}}>
              {stimuli["name"]}
            </p>
            <button className='btn-push'>ボタン</button>
           </div>
           }

        </div>
      
      );
}


export default PartTwo;
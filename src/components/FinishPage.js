import { useState,useEffect } from "react";
import '../css/performance.css';

const metrics_jp_dict = {
  "simple_rt":"単純反応時間",
  "complex_rt_2":"複雑反応時間(一致)",
  "complex_rt_3":"複雑反応時間(不一致)",
  "err_ignore_2":"見逃し率(part2)",
  "err_ignore_3":"見逃し率(part3)",
  "err_res_2":"誤反応率(part2)",
  "err_res_3":"誤反応率(part3)",
}

function FinishPage(props) {
  const [metrics, setMetrics] = useState({});


  const calc_part1_metrics=(data)=>{
    var simple_rt = 0;
    var cnt = 0;
    data.forEach(d => {
      if(d.rt>0){
        simple_rt+=d.rt;
        cnt+=1;
      }
    });
    simple_rt = simple_rt / cnt;
    if(cnt>0){
      simple_rt = simple_rt/cnt;
    }
    else{
      simple_rt = -1;
    }
    //const metric_data  = {"simple_rt":simple_rt};
    setMetrics(metrics => {return {...metrics,"simple_rt":simple_rt}});

  }

  const calc_part23_metrics=(data)=>{
    var complex_rt = 0;
    var cnt = 0;
    var n_target = 0;
    var n_foil = 0;
    var err_ignore = 0;
    var err_res = 0;
    var part;
    data.forEach(d => {
      part = d.part;
      if(d.target) n_target+=1;
      else n_foil+=1;
      if(d.correct){
        complex_rt += d.rt;
        cnt += 1
      }
      else if(d.target){ //targetの見逃し
        err_ignore+=1;
      }
      else{ //誤反応
        err_res+=1;
      }
    });
    if(cnt>0){
      complex_rt = complex_rt/cnt;
    }
    else{
      complex_rt = -1;
    }
    err_ignore = 100*err_ignore/n_target;
    err_res = 100*err_res/n_foil;
    //console.log(part,n_target,n_foil);
    if(part==2){
      setMetrics(metrics => {return {...metrics,"complex_rt_2":complex_rt,"err_ignore_2":err_ignore,"err_res_2":err_res}});
    }
   else if(part==3){
    setMetrics(metrics => {return {...metrics,"complex_rt_3":complex_rt,"err_ignore_3":err_ignore,"err_res_3":err_res}});
   }
   
   
  }

  const calc_scores = ()=>{
    const n = props.settings.trials;
    calc_part1_metrics(props.data.slice(0,n));
    calc_part23_metrics(props.data.slice(n,2*n));
    calc_part23_metrics(props.data.slice(2*n,3*n));
    
  }

  useEffect(()=>{
    console.log(metrics);
    console.log(props.data);
  }
  ,[metrics])

  useEffect(()=>{
    calc_scores();
  },[])
    return (
      <div>
        <h2>終了🎉</h2>
        <div className="Performance">
          <h3>今回の成績：</h3>
          <table>
            <tbody>
              <tr>
                <th>部分</th>
                <th>反応時間(ms)</th>
                <th>見逃し率(%)</th>
                <th>誤反応率(%)</th>
              </tr>

              <tr>
                <th>1</th>
                <th>{metrics["simple_rt"]&&metrics["simple_rt"]>0?metrics["simple_rt"].toFixed(2):"反応なし"}</th>
                <th>/</th>
                <th>/</th>
              </tr>

              <tr>
                <th>2</th>
                <th>{metrics["complex_rt_2"]&&metrics["complex_rt_2"]>0?metrics["complex_rt_2"].toFixed(2):"反応なし"}</th>
                <th>{metrics["err_ignore_2"]?metrics["err_ignore_2"].toFixed(2):"0"}</th>
                <th>{metrics["err_res_2"]?metrics["err_res_2"].toFixed(2):"0"}</th>
              </tr>

              <tr>
                <th>3</th>
                <th>{metrics["complex_rt_3"]&&metrics["complex_rt_3"]>0?metrics["complex_rt_3"].toFixed(2):"反応なし"}</th>
                <th>{metrics["err_ignore_3"]?metrics["err_ignore_3"].toFixed(2):"0"}</th>
                <th>{metrics["err_res_3"]?metrics["err_res_3"].toFixed(2):"0"}</th>
              </tr>
            </tbody>
           
          </table>

          <p style={{"color":"black"}}>このページを閉じて大丈夫です</p>
        </div>
        </div>
      );
}


export default FinishPage;
import { useState,useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css';

function Login({setUserInfo,onStart}) {

    const [familyName, setFamilyName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [gender,setGender] = useState(false);
    const [exp, setExp] = useState(0);
    const [birth, setBirth] = useState(new Date("1990-01-01"));

    const submit =()=>{
        setUserInfo({
            "name":familyName+" "+firstName,
            "gender":gender?"女性":"男性",
            "birthday":birth,
            "experience":exp
        });
        onStart();
    }

    return <div className="MyForm">
        <h1>新規登録</h1>

        <div className="input-group row">
            <span class="input-group-text">氏名(漢字)</span>
            <input type="text" aria-label="First name" class="form-control" placeholder='姓'  onChange={(e) => setFamilyName(e.target.value)} />
            <input type="text" aria-label="Last name" class="form-control" placeholder='名'  onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div className="row">
            <span >生年月日:&nbsp;&nbsp;</span>
            <DatePicker selected={birth} onChange={(date) => setBirth(date)} />
        </div>

        <div className="row">
            <spane>性別:&nbsp;&nbsp;</spane>
            <select onChange={(value)=>setGender(value)}>
                <option value={false}>男性</option>
                <option value={true}>女性</option>
            </select>
        </div>

        <div className="row">
            <span >学習経歴年数:&nbsp;&nbsp;</span>
            <input type="number" onChange={(e) => setExp(e.target.value)} />
        </div>
        
        <button className='btn btn-primary btn-lg row' onClick={submit}>登録</button>
    </div>
}

export default Login;
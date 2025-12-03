"use client"

import React, { useEffect, useMemo, useState } from "react";


import History from "./History";
import BetSlip from "./BestSlip";
import BettingBoard from "./BettingBoard";

import dynamic from "next/dynamic";

const Wheel = dynamic(() => import("./Wheel"), {
  ssr: false,
});

type Bet = {
  id: string;
  type: "number" | "color" | "parity" | "range";
  value: number | string;
  amount: number;
};




const EURO_NUMBERS = [
  0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26
];

const RED_SET = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

function isRed(n:number){ return RED_SET.has(n); }

function id(){ return Math.random().toString(36).slice(2,9); }

export default function RouletteEuropean(){

  const numbers = useMemo(()=> Array.from({length:37},(_,i)=>i),[]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [activeChip, setActiveChip] = useState<number>(50);
  const [balance, setBalance] = useState<number>(5000);
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0); // degrees
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{round:number,result:number}>>([]);
  const [round, setRound] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(()=>{
    if(autoPlay && !spinning){
      // small delay to mimic user
      const t = setTimeout(()=> handleSpin(), 1200);
      return ()=>clearTimeout(t);
    }
  },[autoPlay, spinning]);

  const placeBetOnNumber = (n:number)=>{
    const existing = bets.find(b=>b.type==='number' && b.value===n);
    if(existing){
      setBets(bets.map(b=> b.id===existing.id?{...b, amount: b.amount+activeChip}: b));
    } else {
      setBets([...bets,{id:id(), type:'number', value:n, amount:activeChip}]);
    }
  };

  const placeOutsideBet = (type:'color'|'parity'|'range', value:string|number)=>{
    const existing = bets.find(b=>b.type===type && b.value===value);
    if(existing){
      setBets(bets.map(b=> b.id===existing.id?{...b, amount: b.amount+activeChip}: b));
    } else {
      setBets([...bets,{id:id(), type, value, amount:activeChip}]);
    }
  };

  const removeBet = (bid:string)=> setBets(bets.filter(b=>b.id!==bid));
  const clearBets = ()=> setBets([]);

  const totalBet = bets.reduce((s,b)=>s+b.amount,0);

  const payoutForBet = (bet:Bet, result:number)=>{
    if(bet.type==='number'){
      return bet.value===result ? bet.amount * 35 : 0; // straight up 35:1
    }
    if(bet.type==='color'){
      if(result===0) return 0;
      const color = (bet.value as string);
      const isR = isRed(result);
      return ((color==='red' && isR) || (color==='black' && !isR)) ? bet.amount * 2 : 0; // 1:1 -> returns 2x (includes stake)
    }
    if(bet.type==='parity'){
      if(result===0) return 0;
      const p = (bet.value as string);
      const isOdd = result%2===1;
      return ((p==='odd' && isOdd) || (p==='even' && !isOdd)) ? bet.amount*2 : 0;
    }
    if(bet.type==='range'){
      if(result===0) return 0;
      const r = bet.value as number; // 1 => 1-18, 2 => 19-36
      if(r===1 && result>=1 && result<=18) return bet.amount*2;
      if(r===2 && result>=19 && result<=36) return bet.amount*2;
      return 0;
    }
    return 0;
  };

  const handleSpin = ()=>{
    if(spinning) return;
    if(bets.length===0) return alert('Place at least one bet');
    if(totalBet>balance) return alert('Insufficient balance');

    // Deduct stakes
    setBalance(b=>b-totalBet);
    setSpinning(true);

    // Choose random result index 0..36 based on EURO_NUMBERS
    const resultIndex = Math.floor(Math.random()*EURO_NUMBERS.length);
    const resultNumber = EURO_NUMBERS[resultIndex];

    // Random full rotations + offset so selected pocket lands
    const pocketAngle = 360 / EURO_NUMBERS.length;
    // wheel rotation should end so that resultIndex aligns to top (0deg). We'll calculate target rotation
    const randomSpins = Math.floor(Math.random()*4) + 3; // 3-6 spins
    const targetRotation =  (randomSpins * 360) + (resultIndex * pocketAngle) + (pocketAngle/2); // add half to center

    setWheelRotation(prev=> prev + targetRotation);

    // simulate spin animation duration
    const duration = 4000 + Math.random()*2000; // 4-6s
    // after spin ends
    setTimeout(()=>{
      // calculate payouts
      const payouts = bets.reduce((sum,bet)=> sum + payoutForBet(bet,resultNumber),0);
      if(payouts>0) setBalance(b=>b + payouts);

      setLastResult(resultNumber);
      setHistory(h=>[{round, result: resultNumber}, ...h].slice(0,12));
      setRound(r=>r+1);
      setBets([]);
      setSpinning(false);

      // small visual pause then maybe autoplay continues
    }, duration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900 p-6 text-slate-100 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area */}
        <div className="lg:col-span-2 bg-slate-800/60 rounded-2xl p-5 border border-slate-700 shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Roulette Pro — European</h2>
              <p className="text-sm text-slate-300">Single zero wheel • Place straight and outside bets</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Balance</p>
              <p className="text-xl font-semibold">₹{balance.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Wheel */}
            <Wheel wheelRotation={wheelRotation} EURO_NUMBERS={EURO_NUMBERS}setSpinning={setSpinning}
            setAutoPlay={setAutoPlay} autoPlay={autoPlay} lastResult={lastResult} round={round}isRed={isRed}
            />  
     

            {/* Betting board (numbers) */}
            <BettingBoard
            placeOutsideBet={placeOutsideBet} placeBetOnNumber={placeBetOnNumber}bets={bets}setActiveChip={setActiveChip}activeChip={activeChip}totalBet={totalBet}handleSpin={handleSpin}spinning={spinning}isRed={isRed}
            />
          </div>

          {/* Bet slip */}
          <BetSlip
          bets={bets}removeBet={removeBet}totalBet={totalBet}clearBets={clearBets}handleSpin={handleSpin}spinning={spinning}
          />
        </div>

        {/* Sidebar */}
        <History
        round={round}lastResult={lastResult}history={history}
        />
      </div>
    </div>
  );
}

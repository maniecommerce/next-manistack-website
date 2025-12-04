"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/*
  CasinoGamesLibrary
  - A single-file scaffold exporting placeholder components for many casino games
  - Fully implemented: VideoSlots component (5-reel slot) with Tailwind + Framer Motion
  - Other games are provided as lightweight placeholder components that you can fill later.

  Usage:
    import { VideoSlots, RoulettePlaceholder, KenoPlaceholder, ... } from './CasinoGamesLibrary'

  Requirements: Tailwind CSS + Framer Motion
*/

// ----------------------
// 1) Fully implemented: VideoSlots (5-reel slot)
// ----------------------

const SYMBOLS = ['🍒','🍋','🍊','🔔','⭐','🍉','7️⃣'];

function randSymbol(){ return SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]; }

export function VideoSlots(){
  const reelsCount = 5;
  const rows = 3;
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(() => Array.from({length:reelsCount}, ()=> Array.from({length:rows}, randSymbol)));
  const [lastWin, setLastWin] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const paytable = useMemo(()=> ({
    '7️⃣': {3:50,4:200,5:1000},
    '⭐': {3:20,4:100,5:400},
    '🔔': {3:10,4:50,5:200},
    '🍉': {3:8,4:30,5:150},
    '🍊': {3:5,4:20,5:80},
    '🍋': {3:4,4:15,5:60},
    '🍒': {3:2,4:8,5:40},
  }),[]);

  useEffect(()=>{ if(autoplay){ const t=setTimeout(()=> handleSpin(), 1200); return ()=>clearTimeout(t);} }, [autoplay, spinning]);

  function handleSpin(){
    if(spinning) return;
    if(bet>balance) { alert('Insufficient balance'); return; }
    setSpinning(true);
    setBalance(b=>b-bet);
    setLastWin(0);

    // create animated reel results with slight delays
    const results = Array.from({length:reelsCount}, ()=> Array.from({length:rows}, randSymbol));
    // simulate progressive stopping
    for(let r=0;r<reelsCount;r++){
      setTimeout(()=>{
        setReels(prev=> {
          const next = [...prev]; next[r] = results[r]; return next;
        });
        // last reel stops -> evaluate
        if(r===reelsCount-1){
          setTimeout(()=>{
            const win = evaluate(results, bet, paytable);
            if(win>0) setBalance(b=>b+win);
            setLastWin(win);
            setSpinning(false);
            if(autoplay) {
              // small delay then continue
              const t = setTimeout(()=> handleSpin(), 800);
              return () => clearTimeout(t);
            }
          },400);
        }
      }, 400 + r*350);
    }
  }

  function evaluate(results, betAmount, paytable){
    // Simple evaluation: only center row payline, 3+ matching from left
    const center = results.map(col=> col[1]);
    // count consecutive from left
    let symbol = center[0];
    let count = 1;
    for(let i=1;i<center.length;i++){
      if(center[i]===symbol) count++; else break;
    }
    if(count>=3){
      const mult = paytable[symbol]?.[count] || 0;
      return mult * (betAmount/10);
    }
    return 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-6 text-white flex items-start justify-center">
      <div className="w-full max-w-4xl bg-slate-800/60 rounded-2xl p-6 shadow-lg border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Video Slots — 5-Reel</h2>
            <p className="text-sm text-slate-300">Polished demo slot with paytable and autoplay</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Balance</div>
            <div className="text-lg font-semibold">₹{balance}</div>
          </div>
        </div>

        {/* Reels */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {reels.map((col,ci)=> (
            <div key={ci} className="bg-slate-900/40 rounded-lg p-2 flex flex-col gap-2 items-center justify-center h-48">
              {col.map((s, i)=> (
                <motion.div key={i} animate={{ y: 0 }} transition={{ duration: 0.4 }} className={`w-14 h-12 flex items-center justify-center text-2xl font-bold ${i===1? 'text-3xl':''}`}>
                  {s}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Controls and payline */}
        <div className=" items-center ">
          <div className="flex items-center gap-3">
            <button onClick={() => setBet(10)} className={`px-3 py-2 rounded ${bet===10? 'bg-amber-400 text-slate-900':''}`}>₹10</button>
            <button onClick={() => setBet(20)} className={`px-3 py-2 rounded ${bet===20? 'bg-amber-400 text-slate-900':''}`}>₹20</button>
            <button onClick={() => setBet(50)} className={`px-3 py-2 rounded ${bet===50? 'bg-amber-400 text-slate-900':''}`}>₹50</button>
            <button onClick={() => setBet(100)} className={`px-3 py-2 rounded ${bet===100? 'bg-amber-400 text-slate-900':''}`}>₹100</button>
            <div className="text-sm text-slate-400">Bet: ₹{bet}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm">Last Win: <span className="font-semibold text-amber-300">₹{lastWin}</span></div>
            <button onClick={handleSpin} disabled={spinning} className={`px-6 py-3 rounded-xl font-bold ${spinning? 'bg-slate-600':'bg-green-500 text-slate-900'}`}>{spinning? 'Spinning...':'SPIN'}</button>
            <button onClick={() => setAutoplay(a=>!a)} className={`px-4 py-2 rounded ${autoplay? 'bg-amber-400 text-slate-900':'bg-slate-700/40'}`}>Auto</button>
          </div>
        </div>

        {/* Paytable */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-sm text-slate-300">
          {Object.keys(paytable).map(s => (
            <div key={s} className="p-2 bg-slate-900/30 rounded">
              <div className="font-semibold text-lg">{s}</div>
              <div className="text-xs">3: {paytable[s][3]} | 4: {paytable[s][4]} | 5: {paytable[s][5]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------
// 2) Placeholder components for ALL requested games
//    Each placeholder is a lightweight visual component with TODO notes and props to customize.
// ----------------------

function Placeholder({title, children}:{title:string, children?:React.ReactNode}){
  return (
    <div className="w-full max-w-3xl bg-slate-800/60 rounded-2xl p-6 shadow-lg border border-slate-700 m-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-sm text-slate-300">{children}</div>
    </div>
  );
}

export const ClassicSlot3Reel = ()=> <Placeholder title="Classic Slot (3-reel)">UI scaffold — implement reels, spin speed, symbols, small paytable.</Placeholder>;
export const ProgressiveJackpotSlot = ()=> <Placeholder title="Progressive Jackpot Slot">UI scaffold — jackpot meter, progressive pool, contributor animation.</Placeholder>;
export const MegawaysSlot = ()=> <Placeholder title="Megaways Slot">UI scaffold — variable reel heights, cascading wins, bonus buy UI.</Placeholder>;
export const ClusterPaysSlot = ()=> <Placeholder title="Cluster Pays Slot">UI scaffold — grid cluster, cascade animations.</Placeholder>;
export const FruitMachine = ()=> <Placeholder title="Fruit Machine">UI scaffold — mechanical lever animation, payout lines.</Placeholder>;
export const BonusBuySlot = ()=> <Placeholder title="Bonus Buy Slot">UI scaffold — buy bonus modal, RTP display.</Placeholder>;
export const HoldSpinSlot = ()=> <Placeholder title="Hold & Spin / Lock & Win">UI scaffold — locked symbol mechanic UI.</Placeholder>;

// Table games placeholders
export const BlackjackTable = ()=> <Placeholder title="Blackjack">UI scaffold — player seats, dealer, chips, hit/stand, dealer animation.</Placeholder>;
export const BaccaratTable = ()=> <Placeholder title="Baccarat">UI scaffold — shoe, player/banker/tie bets, scoreboard.</Placeholder>;
export const PokerTable = ()=> <Placeholder title="Poker (Texas/Omaha)">UI scaffold — table, seats, community cards, betting rounds.</Placeholder>;
export const TeenPatti = ()=> <Placeholder title="Teen Patti">UI scaffold — Indian poker UI, chips, side bets.</Placeholder>;
export const AndarBahar = ()=> <Placeholder title="Andar Bahar">UI scaffold — single-card reveal, round timer.</Placeholder>;
export const Rummy = ()=> <Placeholder title="Rummy">UI scaffold — draggable cards, sets, discard pile.</Placeholder>;

// Dice games
export const Craps = ()=> <Placeholder title="Craps">UI scaffold — layout, bets area, dice roll animation.</Placeholder>;
export const SicBo = ()=> <Placeholder title="Sic Bo">UI scaffold — three-dice bets, payout table UI.</Placeholder>;

// Roulette placeholders
export const EuropeanRoulette = ()=> <Placeholder title="European Roulette">UI scaffold — wheel, betting table, last results.</Placeholder>;
export const AmericanRoulette = ()=> <Placeholder title="American Roulette">UI scaffold — double zero wheel variant.</Placeholder>;
export const FrenchRoulette = ()=> <Placeholder title="French Roulette">UI scaffold — special rules UI.</Placeholder>;

// Live casino placeholders
export const LiveBlackjack = ()=> <Placeholder title="Live Blackjack">UI scaffold — video feed slot, dealer overlay, chat.</Placeholder>;
export const LiveRoulette = ()=> <Placeholder title="Live Roulette">UI scaffold — video feed + wheel overlay.</Placeholder>;
export const CrazyTime = ()=> <Placeholder title="Crazy Time">UI scaffold — money wheel UI, bonus rounds.</Placeholder>;

// Crash games
export const Aviator = ()=> <Placeholder title="Aviator / Crash">UI scaffold — multiplier curve, cashout button, live rounds.</Placeholder>;
export const JetX = ()=> <Placeholder title="JetX">UI scaffold — rocket curve, cashout, autopilot.</Placeholder>;

// Number & Lottery
export const Keno = ()=> <Placeholder title="Keno">UI scaffold — 1-80 grid, select spots, draw animation.</Placeholder>;
export const Bingo = ()=> <Placeholder title="Bingo">UI scaffold — card grid, bingo caller UI.</Placeholder>;

// Betting games
export const SportsBetting = ()=> <Placeholder title="Sports Betting">UI scaffold — market list, odds, bet slip.</Placeholder>;
export const MatkaUI = ()=> <Placeholder title="Matka (UI only)">UI scaffold — number panels, round header.</Placeholder>;
export const FatafatUI = ()=> <Placeholder title="Fatafat">UI scaffold — 0-9 quick pick grid.</Placeholder>;

// Arcade / instant games
export const SlotMachinePlaceholder = ()=> <Placeholder title="Slot Machine Series">Generic slot machine family placeholder.</Placeholder>;
export const ScratchCard = ()=> <Placeholder title="Scratch Card">UI scaffold — scratch mask using canvas.</Placeholder>;
export const SpinWheel = ()=> <Placeholder title="Spin Wheel">Wheel UI scaffold — segments, pointer, spin animation.</Placeholder>;
export const FlipCard = ()=> <Placeholder title="Flip Card">Flip card UI scaffold — reveal animations.</Placeholder>;

// Export default overview component
export default function CasinoGamesLibrary(){
  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <VideoSlots />
        </div>
        <div>
          <ClassicSlot3Reel />
          <ProgressiveJackpotSlot />
          <RoulettePlaceholder />
        </div>
      </div>
    </div>
  );
}

// Small alias used above (avoid too many components in initial render)
function RoulettePlaceholder(){ return <Placeholder title="Roulette (overview)">Multiple roulette variants placeholder.</Placeholder>; }


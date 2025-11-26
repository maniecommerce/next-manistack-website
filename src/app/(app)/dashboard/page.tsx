"use client"
import FatafatLive from "@/components/Fatafat/FatafatLive"
import Keno from "@/components/Keno/Keno"
import RouletteEuropean from "@/components/Roulette/RouletteEuropean"

export default function Dashboard(){
    return (
        <div>
            <FatafatLive/>
            <Keno/>
            <RouletteEuropean/>
        </div>
    )
}
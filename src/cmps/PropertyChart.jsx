import React from 'react'
import { YieldChart } from './YieldChart'
import { utilService } from '../services/util.service'
import iconChartOn from '../assets/images/icon_chart_on.png'
import { useSplash } from '../contexts/SplashContext'

export function PropertyChart({data}) {   
    
    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    return (
        <section className="chart">
            <h2 className="title"><img src={iconChartOn} />{utilService.getPhrase('property_actions_menu_graph_label', phrases)}</h2>  
            <div>
                {data && <YieldChart rawData={JSON.parse(data)} />}
            </div>
        </section>
    )
}

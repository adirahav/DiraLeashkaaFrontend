import React from 'react'
import { YieldChart } from './YieldChart'
import { utilService } from '../services/util.service'
import { useSplash } from '../contexts/SplashContext'

export function PropertyChart({data}) {   
    
    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    return (<>
        <h2 className="title">{utilService.getPhrase('property_actions_menu_graph_label', phrases)}</h2>  
        <section className="chart">
            <div>
                {data && <YieldChart rawData={JSON.parse(data)} />}
            </div>
        </section>
    </>)
}

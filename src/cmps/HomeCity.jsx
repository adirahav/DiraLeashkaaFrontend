import React from 'react'

export function HomeCity({ city, selected, onCityPress }) {   

    const handleCityPress = (ev, city) => {
        onCityPress(city)
    }

    const divClass = selected ? "selected" : ""

    return (
        <article className={divClass} onClick={() => handleCityPress(this, {city})}>
            <div><img src={`/src/assets/images/icon_city_${city.name}.png`} /></div>
            <span>{city.label}</span>
        </article>
    )
}

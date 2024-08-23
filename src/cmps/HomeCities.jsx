import React from 'react'
import { HomeCity } from './HomeCity';

export function HomeCities({ cities, onCityPress }) {   

    return (
        <section className="my-cities">
            {cities.map((city, index) => (
                <HomeCity key={index} city={city} selected={index===0} onCityPress={onCityPress} />
            ))}
        </section>
    );
}

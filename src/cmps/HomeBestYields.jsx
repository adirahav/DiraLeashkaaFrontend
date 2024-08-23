import React from 'react'
import { HomeBestYield } from './HomeBestYield';

export function HomeBestYields({ properties }) {   
    return (
        <section className="best-yields">
            {properties.map((property, index) => (
                <HomeBestYield key={index} property={property} />
            ))}
        </section>
    )
}

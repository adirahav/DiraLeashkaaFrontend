import React from 'react'
import { HomeProperty } from './HomeProperty';

export function HomeProperties({ properties, onPropertyPress }) {   
    return (
        <section className="my-properties">
            {properties.map((property, index) => (
                <HomeProperty key={index} property={property} onPropertyPress={onPropertyPress} />
            ))}
        </section>
    );
}

import React from 'react'

export function HomeProperty({ property, onPropertyPress }) {   

    const handlePropertyPress = (ev, property) => {
        onPropertyPress(property)
    };

    return (
        <div onClick={() => handlePropertyPress(this, {property})}>
            <h3>{property.address}</h3>
            <span>{property.price}</span>
        </div>
    );
}

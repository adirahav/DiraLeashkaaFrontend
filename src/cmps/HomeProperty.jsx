import React from 'react'
import { utilService } from '../services/util.service'
import { IconSizes, MedaltIcon, MissDataIcon } from '../assets/icons'
import propertyImage from '../assets/images/property.jpg'

export function HomeProperty({ property, onPropertyPress }) {   

    const handlePropertyPress = (ev, property) => {
        onPropertyPress(property)
    }

    return (
        <article onClick={() => handlePropertyPress(this, {property})}>
            <div>
                <div>
                    <MedaltIcon sx={IconSizes.Small} />
                    <MissDataIcon sx={IconSizes.Small} />
                    {property.address}
                </div>
                <img src={propertyImage} />
            </div>
            
            <span>{utilService.priceFormat(property.price)}</span>
        </article>
    );
}

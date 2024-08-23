import React from 'react'
import { HomeCity } from './HomeCity_old';

export function HomeCities({ cities, onCityPress }) {   

    return (
        <section className="my-cities">
            <article>
                <HomeCity city={{name:'elad', label:'אלעד'}} selected={true} onCityPress={onCityPress} />
                <HomeCity city={{name:'elad', label:'אלעד'}} selected={false} onCityPress={onCityPress} />
                <HomeCity city={{name:'elad', label:'אלעד'}} selected={false} onCityPress={onCityPress} />
                <HomeCity city={{name:'elad', label:'אלעד'}} selected={false} onCityPress={onCityPress} />
                <HomeCity city={{name:'elad', label:'אלעד'}} selected={false} onCityPress={onCityPress} />
                <HomeCity city={{name:'elad', label:'אלעד'}} selected={false} onCityPress={onCityPress} />
                <HomeCity city={{name:'elad', label:'אלעד'}} selected={false} onCityPress={onCityPress} />
                <HomeCity city={{name:'elad', label:'אלעד'}} selected={false} onCityPress={onCityPress} />
            </article>
        </section>
    );
}

import React from 'react'
import { HomeProperty } from './HomeProperty_old';

export function HomeProperties({ properties, onPropertyPress }) {   

    return (
        <section className="my-properties">
            <article>
                <HomeProperty property={{name:'elad', label:'אלעד'}} onPropertyPress={onPropertyPress} />
                <HomeProperty property={{name:'elad', label:'אלעד'}} onPropertyPress={onPropertyPress} />
                <HomeProperty property={{name:'elad', label:'אלעד'}} onPropertyPress={onPropertyPress} />
                <HomeProperty property={{name:'elad', label:'אלעד'}} onPropertyPress={onPropertyPress} />
                <HomeProperty property={{name:'elad', label:'אלעד'}} onPropertyPress={onPropertyPress} />
                <HomeProperty property={{name:'elad', label:'אלעד'}} onPropertyPress={onPropertyPress} />
                <HomeProperty property={{name:'elad', label:'אלעד'}} onPropertyPress={onPropertyPress} />
                <HomeProperty property={{name:'elad', label:'אלעד'}} onPropertyPress={onPropertyPress} />
            </article>
        </section>
    );
}

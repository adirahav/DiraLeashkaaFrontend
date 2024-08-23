import React from 'react';
import { useEffect } from "react";
import { Header } from '../cmps/Header';
import { showErrorAlert } from '../cmps/Alert';
import { HomeCities } from '../cmps/HomeCities';
import { HomeProperties } from '../cmps/HomeProperties';

export function Home() {

    useEffect(() => {
       /* setTimeout(() => {
            showErrorAlert({
                message: 'Error alert example',
                closeButton: { show: true, autoClose: false }, 
                positiveButton: { show: true, text: "Yes", onPress: null, closeAfterPress: true }, 
                negativeButton: { show: true, text: "No", onPress: null, closeAfterPress: true }, 
            });
        }, 1000);*/

        
    },[]);

    // my cities
    function onCityPress(city) {
        console.log(`onCityPress: ${city}`);
    }

    // city properties
    function onPropertyPress(property) {
        console.log(`onPropertyPress: ${property}`);
    }

    return (<>
        <Header />
        <main className="home container">
            <h1>הערים/ישובים שלי</h1>
            <HomeCities city={[{name:'elad', label:'אלעד'},{name:'elad', label:'אלעד'}]} onCityPress={onCityPress} />
            
            <h2>הנכסים שלי <span>באלעד</span></h2>
            <HomeProperties property={[{name:'elad', label:'אלעד'},{name:'elad', label:'אלעד'}]} onPropertyPress={onPropertyPress} />

            <p>
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
            </p>
            <section className='cards'>
                <div>AAA</div>
                <div>BBB</div>
                <div>CCC</div>
                <div>DDD</div>
                <div>EEE</div>
                <div>FFF</div>
                <div>GGG</div>
            </section>
            <p>
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
                text text text text text text text text text text text text text text text text text
            </p>
        </main>
        <footer className='full'>
            <div>Footer</div>
        </footer>
    </>);
}

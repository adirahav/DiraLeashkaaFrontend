import React, { useEffect } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { HomeCities } from '../cmps/HomeCities';
import { HomeProperties } from '../cmps/HomeProperties';
import { HomeBestYields } from '../cmps/HomeBestYields';

export function HomePage() {

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
            <HomeCities cities={[{name:'elad', label:'אלעד'},{name:'elad', label:'אלעד'}]} onCityPress={onCityPress} />
            
            <h2>הנכסים שלי <span>באלעד</span></h2>
            <HomeProperties properties={[{address:'ארבע העונות 102', price:'595000'}, {address:'ארבע העונות 102', price:'595000'}, {address:'ארבע העונות 102', price:'595000'}, {address:'ארבע העונות 102', price:'595000'}, {address:'ארבע העונות 102', price:'595000'}]} onPropertyPress={onPropertyPress} />

            <h1>הנכס המוביל בתשואה לאחר 10 שנים</h1>
            <HomeBestYields properties={[{"address":"בן גוריון 9, רמלה", "profit": 709863.0162499993,
                "profitNpv": 554543.8537387034,
                "averageReturn": 6.316679182690188,
                "averageReturnOnEquity": 5.645307964657875,}]} />
        </main>
        <Footer />
    </>)
}

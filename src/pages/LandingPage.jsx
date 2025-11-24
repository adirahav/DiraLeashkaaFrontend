import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FormField } from '../cmps/FormField'
import { hex, motion } from "framer-motion"
import useEmblaCarousel from 'embla-carousel-react'
import { Footer } from '../cmps/Footer'

import imgLogo from '../assets/images/icon_web.png'
import imgBanner from '../assets/images/landing-banner-1.png'
import imgHowDoesItWorks1 from '../assets/images/landing-how-does-it-works-1.png'
import imgHowDoesItWorks2 from '../assets/images/landing-how-does-it-works-2.png'
import imgHowDoesItWorks3 from '../assets/images/landing-how-does-it-works-3.png'
import imgHowDoesItWorks4 from '../assets/images/landing-how-does-it-works-4.png'
import imgInvestmentBudget1 from '../assets/images/landing-investment-budget-1.png'
import imgInvestmentBudget2 from '../assets/images/landing-investment-budget-2.png'
import imgInvestmentBudget3 from '../assets/images/landing-investment-budget-3.png'
import imgInvestmentBudget4 from '../assets/images/landing-investment-budget-4.png'
import imgInvestmentBudget5 from '../assets/images/landing-investment-budget-5.png'
import imgCard1 from '../assets/images/landing-card-1.png'
import imgCard2 from '../assets/images/landing-card-2.png'
import imgCard3 from '../assets/images/landing-card-3.png'
import imgCard4 from '../assets/images/landing-card-4.png'
import imgTargetAudience1 from '../assets/images/landing-target-audience-1.svg'
import imgTargetAudience2 from '../assets/images/landing-target-audience-2.svg'
import imgTargetAudience3 from '../assets/images/landing-target-audience-3.svg'
import { LazyLoadMedia } from '../cmps/LazyLoadMedia'
import WebAdBanner from '../cmps/WebAdBanner'
import { useSplash } from '../contexts/SplashContext'
import { utilService } from '../services/util.service'
import { onLoadingDone, onLoadingStart } from '../store/actions/app.actions'
import { LoadingIcon } from '../cmps/LoadingIcon'
import { useSelector } from 'react-redux'

export function LandingPage() {

    const { splash } = useSplash()
    const phrases = splash?.phrases

    /*const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)

    useEffect(() => {
        if (!phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone() 
        }
    }, [splash])*/

    // banner
    const bannerRatio = 4.107
    const [banner, setBanner] = useState({
        width: window.innerWidth,
        height: window.innerWidth / bannerRatio,
        url: imgBanner
    })

    useEffect(() => {
        const handleResize = () => setBanner(prevBanner => ({
            ...prevBanner,
            width: window.innerWidth,
            height: parseInt(window.innerWidth / bannerRatio),
        }))
    
        window.addEventListener("resize", handleResize)
    
        return () => window.removeEventListener("resize", handleResize)
      }, [])

    // title
    //const title = "שמים סוף לניחושים, מתחילים לחשב תשואה"

    // subtitle
    const subtitle = [
        "משווים דירות.",    //utilService.getPhrase("landing_subtitle1", phrases)
        "מחשבים תשואות.",   //utilService.getPhrase("landing_subtitle2", phrases)
        "קונים חכם."        //utilService.getPhrase("landing_subtitle3", phrases)
    ]

    // investment budget
    const investmentBudget = {
        title: "המערכת גם מחשבת את תקרת התקציב האישית שלך לדירה הבאה, כך שתוכל להחליט בביטחון.",    //utilService.getPhrase("landing_investmentBudget_title", phrases)
        items: [{
            text: "חיזוי תשואה לפי הנתונים שלך – לא לפי תחושת בטן",                 //utilService.getPhrase("landing_investmentBudget_text1", phrases)
            image: imgInvestmentBudget1
        },{
            text: "חישוב דירה מקסימלית בהתאם ליכולת המימון שלך",                    //utilService.getPhrase("landing_investmentBudget_text2", phrases)
            image: imgInvestmentBudget2
        },{
            text: "השוואה חכמה בין מספר דירות – ומציאת הדירה המנצחת",               //utilService.getPhrase("landing_investmentBudget_text3", phrases)
            image: imgInvestmentBudget3
        },{
            text: "תמונת מצב מזוקקת: תזרים חודשי, החזר משכנתא, תשואה נטו/ברוטו",   //utilService.getPhrase("landing_investmentBudget_text4", phrases)
            image: imgInvestmentBudget4
        },{
            text: "מתאים למשקיעים בתחילת הדרך וגם למנוסים",                         //utilService.getPhrase("landing_investmentBudget_text5", phrases)
            image: imgInvestmentBudget5
        }]
    }

    const investmentBudgetRefs = useRef(null)
    const [investmentBudgetVisible, setInvestmentBudgetVisible] = useState(false)

    useEffect(() => {
        if (!investmentBudgetRefs.current) return;
      
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setInvestmentBudgetVisible(true)
                observer.disconnect() // play once only
              }
            })
          },
          {
            root: null,
            threshold: 0,
            rootMargin: "0px 0px -100px 0px" 
          }
        )
      
        observer.observe(investmentBudgetRefs.current)
      
        return () => observer.disconnect()
      }, [])
      

    // how doesI it Works
    const howDoesItWorksBulletRefs = useRef([])
    const [howDoesItWorksVisibleStates, setHowDoesItWorksVisibleStates] = useState([false, false, false, false])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const index = howDoesItWorksBulletRefs.current.indexOf(entry.target)
                  if (index !== -1) {
                    setHowDoesItWorksVisibleStates((prev) => {
                      const updated = [...prev]
                      updated[index] = true
                      return updated
                    })
                  }
                }
              })
            },
          {
            root: null,
            rootMargin: "0px 0px -100px 0px", 
            threshold: 0,
          }
        )
        howDoesItWorksBulletRefs.current.forEach((el) => {
            if (el) observer.observe(el)
          })
      
          return () => observer.disconnect()
    }, [])

    const howDoesItWorks = {
        title: "איך זה עובד",
        items: [{
            label: "מזינים:",
            text: "כתובת/עיר, מחיר דירה, הון עצמי, אחוז מימון, ריבית, תקופת ההלוואה, גובה שכירות והוצאות שוטפות.",
            image: imgHowDoesItWorks1
        },{
            label: "המערכת מחשבת עבורך:",
            text: "תזרים חודשי, החזר משכנתא, תשואה ברוטו/נטו והערכת תשואה עתידית.",
            image: imgHowDoesItWorks2
        },{
            label: "משווים בין כל הדירות שהזנת:",
            text: "ובוחרים את הדירה עם התשואה הגבוהה ביותר.",
            image: imgHowDoesItWorks3
        },{
            label: "איזו דירה אוכל להרשות לעצמי:",
            text: "בודקים מהו המחיר המקסימלי שמתאים ליכולת המימון שלך",
            image: imgHowDoesItWorks4
        }]
    }

    // advantages
    const advantages = {
        title: "יתרונות",                                                   //utilService.getPhrase("landing_advantages_title", phrases)
        items: [{
            label: "החלטות מבוססות נתונים:",                                //utilService.getPhrase("landing_advantages_label1", phrases)
            text: "סוף להתלבטויות אינסופיות.",                              //utilService.getPhrase("landing_advantages_text1", phrases)
            icon: imgHowDoesItWorks1
        },{
            label: "פחות סיכון, יותר ודאות:",                               //utilService.getPhrase("landing_advantages_label2", phrases)
            text: "רואה מראש איך המספרים מתנהגים בתנאי ריבית וזמן.",        //utilService.getPhrase("landing_advantages_text2", phrases)
            icon: imgHowDoesItWorks2
        },{
            label: "תמונה מלאה, במקום אלף טאבים וגיליונות:",                 //utilService.getPhrase("landing_advantages_label3", phrases)   
            text: "כל המידע במקום אחד.",                                      //utilService.getPhrase("landing_advantages_text3", phrases)
            icon: imgHowDoesItWorks3
        },{
            label: "בוסט לביטחון בקנייה:",                                     //utilService.getPhrase("landing_advantages_label4", phrases) 
            text: "מגיעים לראות דירה כשכבר יודעים מה הגבולות והפוטנציאל.",  //utilService.getPhrase("landing_advantages_text4", phrases)
            icon: imgHowDoesItWorks4
        }]
    }

    const advantagesRefs = useRef(null)
    const [advantagesVisible, setAdvantagesVisible] = useState(false)

    useEffect(() => {
        if (!advantagesRefs.current) return

        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setAdvantagesVisible(true)
                    observer.disconnect() // מפעילים פעם אחת
                }
            })
        },
        {
            root: null,
            threshold: 0.3, // לפחות 30% מהסקשן על המסך
        }
        )

        observer.observe(advantagesRefs.current)

        return () => observer.disconnect()
    }, [])

    // signup
    const signup = {
        title: "הצעד הראשון לדירה משלך",        //utilService.getPhrase("landing_signup_title", phrases)
        text: "קבל גישה חינם לכלי שמחשב עבורך איזו דירה באמת מתאימה לך – בלי ניחושים ובלי טעויות."  //utilService.getPhrase("landing_signup_text", phrases)
    }

    const signupButton = {
        text: "הירשם עכשיו ללא עלות",   //utilService.getPhrase("landing_signup_button", phrases)
        isDisabled: false,
        isLoading: false
    }

    const signupRef = useRef(null)
    const [signupVisible, setSignupVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setSignupVisible(true)
                    observer.disconnect() // only once
                }
            })
        },
        {
            root: null,
            rootMargin: "0px 0px -150px 0px", 
            threshold: 0,
            }
        )

        if (signupRef.current) observer.observe(signupRef.current)

        return () => observer.disconnect()
    }, [])

    // cards
    const OPTIONS = { direction: "rtl", loop: true }
    //const SLIDE_COUNT = 4
    //const SLIDES = Array.from({ length: SLIDE_COUNT }, (_, i) => i)

    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS)

    const cards = {
        items: [{
            label: "המערכת מדרגת בשבילך",                       //utilService.getPhrase("landing_cards_label1", phrases)
            text: "סוף להתלבטויות אינסופיות.",                  //utilService.getPhrase("landing_cards_text1", phrases)
            image: imgCard1
        },{
            label: "איזו דירה תוכל להרשות לעצמך?",              //utilService.getPhrase("landing_cards_label2", phrases)
            text: "בדיקה מיידית לפי הכנסה פנויה והון עצמי",    //utilService.getPhrase("landing_cards_text2", phrases)
            image: imgCard2
        },{
            label: "כמה ישאר לך כל חודש?",                      //utilService.getPhrase("landing_cards_label3", phrases)
            text: "תזרים נטו אחרי כל ההוצאות",                  //utilService.getPhrase("landing_cards_text3", phrases)
            image: imgCard3
        },{
            label: "ומה אם הריבית תעלה?",                       //utilService.getPhrase("landing_cards_label4", phrases)
            text: "סימולציה בלחיצת כפתור",                      //utilService.getPhrase("landing_cards_text4", phrases)
            image: imgCard4
        }]
    }
    

    const cardsAutoplay = useCallback(() => {
        if (!emblaApi) return
        const interval = setInterval(() => {
            emblaApi.scrollNext()
        }, 2000)
        return () => clearInterval(interval)
    }, [emblaApi])

    useEffect(() => {
        const cleanup = cardsAutoplay()
        return cleanup
    }, [cardsAutoplay])
     
    // target audience
    const targetAudienceRefs = useRef(null)
    const targetAudience = {
        title: "למי זה מתאים",          //utilService.getPhrase("landing_target_audience_title", phrases)
        items: [{
            title: "התחלה חכמה",        //utilService.getPhrase("landing_target_audience_title1", phrases)
            text: "למי ששוקל לרכוש דירה ראשונה להשקעה ורוצה מספרים ברורים", //utilService.getPhrase("landing_target_audience_text1", phrases)
            icon: imgTargetAudience1
        },{
            title: "ROI מקסימלי",       //utilService.getPhrase("landing_target_audience_title2", phrases)
            text: "למשקיעים שמשווים בין כמה אפשרויות ומחפשים את ה-ROI (תשואה על ההשקעה) הכי טוב",   //utilService.getPhrase("landing_target_audience_text2", phrases)
            icon: imgTargetAudience2
        },{
            title: "כדאיות ברורה",      //utilService.getPhrase("landing_target_audience_title3", phrases)
            text: "לכל מי שרוצה להבין אם העסקה באמת “עובדת” לפני שמתקדמים", //utilService.getPhrase("landing_target_audience_text3", phrases)    
            icon: imgTargetAudience3
        }]
    }

    // guidance
    const guidance = {
        title: "עצות לדרך",     //utilService.getPhrase("landing_guidance_title", phrases)
        items: [{
            text: "דירה אחת יכולה לשמש כהשקעה ראשונה ולבנות עבורך בסיס יציב להמשך.",        //utilService.getPhrase("landing_guidance_text1", phrases)
            icon: imgTargetAudience1
        },{
            text: "לא צריך להיות גאון אקסל – אנחנו עושים את הכביסה המלוכלכת של המספרים.",   //utilService.getPhrase("landing_guidance_text2", phrases)
            icon: imgTargetAudience2
        },{
            text: "הנתונים כאן הם הערכה – ההחלטה שלך חכמה יותר כשיש לך תמונה מלאה.",        //utilService.getPhrase("landing_guidance_text3", phrases)
            icon: imgTargetAudience3
        }]
    }

    return (<>
        <main className="landing narrow container full">

            <section className='banner'>
                {banner.width && banner.height && <LazyLoadMedia mediaUrl={banner.url} mediaWidth={banner.width} mediaHeight={banner.height} isVideo={false} alt={''} />}
            </section>
                
            <section className='logo'>
                <img src={imgLogo} alt='' />
            </section>
            
            <section className='subtitle'>
                <h2>
                    {subtitle.map((text, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "0px 0px -100px 0px" }} 
                            transition={{ delay: index * 1.2, duration: 0.5 }}>   {text}
                        </motion.span>
                    ))}
                </h2>
            </section>
    
            <section className="investment-budget">
                <h2>{investmentBudget.title}</h2>

                <motion.ul
                    ref={investmentBudgetRefs}
                    initial="hidden"
                    animate={investmentBudgetVisible ? "visible" : "hidden"}
                    variants={{
                    visible: {
                        transition: { staggerChildren: 0.3 } // animate each <li> with a delay
                    },
                    hidden: {}
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                >
                    {investmentBudget.items.map((item, index) => (
                    <motion.li
                        key={index}
                        className="p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition-transform duration-300"
                        variants={{
                        hidden: { opacity: 0, y: 50, scale: 0.9 }, 
                        visible: { 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: { type: "spring", stiffness: 80 }
                        }
                        }}
                        whileHover={{ scale: 1.05, rotate: 1 }} // still works after reveal
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.img
                        src={item.image}
                        className="mx-auto mb-4"
                        initial={false}
                        whileHover={{ scale: 1.1 }}
                        />
                        <hr className="my-3 border-gray-200" />
                        <p>{item.text}</p>
                    </motion.li>
                    ))}
                </motion.ul>
            </section>

            <section className='how-does-it-works'>
                <h2>{howDoesItWorks.title}</h2>
                <ul>
                    {howDoesItWorks.items.map((item, index) => (   
                        <li key={index}>
                            <img src={item.image} alt='' />
                            <div><hr /><span ref={(el) => (howDoesItWorksBulletRefs.current[index] = el)} className={`bullet ${howDoesItWorksVisibleStates[index] ? "visible" : ""}`}></span></div>
                            <p><span>{item.label}</span> {item.text}</p>
                        </li> 
                    ))}
                </ul>
            </section>

            <section className='advantages' ref={advantagesRefs}>
                <h2>{advantages.title}</h2>
                <ul>
                    {advantages.items.map((item, index) => ( 
                    <li key={index}>
                        <span
                        className={`bullet ${advantagesVisible ? "visible" : ""}`}
                        style={{ transitionDelay: `${index * 0.2}s` }} // סטאגר
                        >
                        {index + 1}
                        </span>
                        <p>
                        <b>{item.label}</b>
                        <br />
                        {item.text}
                        </p>
                    </li>  
                    
                ))}
                </ul>
            </section>

            <section className={`signup ${signupVisible ? "visible" : ""}`} ref={signupRef}>
                <h3>{signup.title}</h3>
                <p>{signup.text}</p>
                <NavLink to="/signup" className="signup-btn"><FormField type={"BUTTON"} params={signupButton} /></NavLink>
            </section>

            <section className="cards-carousel" dir="rtl">
                <div className="viewport" ref={emblaRef}>
                    <section className="container">
                        {cards.items.map((item, index) => ( 
                            <article className="slide" key={index}>
                                <div className="card">
                                    <div style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <h3>{item.label}</h3>
                                    <p>{item.text}</p>
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </section>

            <section className='target-audience' ref={targetAudienceRefs}>
                <h2>{targetAudience.title}</h2>
                <ul>
                    {targetAudience.items.map((item, index) => ( 
                        <li key={index}>
                            <h3><span>{item.title}</span></h3>
                            <div>
                                <img src={item.icon} alt='' />
                                <p>{item.text}</p>
                            </div>
                        </li>  
                    ))}
                </ul>
            </section>     

            <section className="guidance">
                <h2>{guidance.title}</h2>
                <motion.ul
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }} 
                    variants={{
                    visible: {
                        transition: {
                        staggerChildren: 0.3
                        }
                    }
                    }}
                >
                    {guidance.items.map((item, index) => (
                    <motion.li
                        key={index}
                        variants={{
                        hidden: { opacity: 0, y: 72 },
                        visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ type: "spring", stiffness: 50 }}
                    >
                        <div>
                        <p>{item.text}</p>
                        </div>
                    </motion.li>
                    ))}
                </motion.ul>
            </section>

            <section className='ad'>
                <WebAdBanner />
            </section>

            <Footer className="full" showForAnonimous={true} />
            
        </main>
        
    </>)
}

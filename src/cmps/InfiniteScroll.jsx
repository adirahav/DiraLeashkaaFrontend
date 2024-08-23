import { useState, useEffect, useRef } from 'react'

function ListItem({ text }) { return <li>{text}</li> }


export function InfiniteScroll() {
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const loadingRef = useRef(null)

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            if (entry.isIntersecting) {
                loadItems()
            }
        }, { root: null, margin: '30px' })

        if (observer) {
            observer.observe(loadingRef.current)
        }

        return () => {
            if (observer) {
                observer.disconnect()
            }
        }
    }, [])



    function loadItems() {
        if (isLoading) return
        setIsLoading(true)
        // Simulate an API call to fetch more items (e.g., paginated data)
        setTimeout(() => {
            setItems((prevItems) => {
                const newItems = [...prevItems]
                for (let i = 0; i < 20; i++) {
                    newItems.push(`Item ${prevItems.length + i + 1}`)
                }
                return newItems
            })
            setIsLoading(false)
        }, 1000)
    }


    return (
        <div className="infinite-scroll">
            <ul>
                {items.map((item, index) => (
                    <ListItem key={index} text={item} />
                ))}
            </ul>
            {isLoading && <p>Loading more items...</p>}
            <div id="loading" style={{ height: '0px' }} ref={loadingRef}></div>
        </div>
    )
}


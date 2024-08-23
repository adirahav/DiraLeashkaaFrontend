import { memo } from "react"

export const ReactOptimizationList = memo(({ items, onRemove }) => {

    console.log('ReactOptimizationList Rendered')
    
    return (
        <ul>
            {
                items.map(item =>
                    <li key={item.id}>{item.name} <div onClick={() => onRemove(item)}>remove</div></li>
                )
            }
        </ul>
    )
})
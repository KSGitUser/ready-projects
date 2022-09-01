//useCallback

import { useCallback, useState, memo } from 'react'

const Item = memo(({item , onClick}) => {
    const { name } = item;
    console.log(`> render ${name}`)

    return <div onClick={() => onClick(item)}>{name}</div>
})


function List({ items }) {
    const onItemClick = useCallback((item) => {
        console.log(`clicked item with id ${item.id}`)
    }, [])

    const [, setTrigger] = useState({})

    const rerender = () => {
        setTrigger({})
    }

    console.log('render list')

    return (
        <>
            <p>
                <button onClick={rerender}>RERENDER</button>
            </p>
            {items.map(item => (
                <Item item={item} key={item.id} onClick={onItemClick}/>
            ))}
        </>
    )
}

const items = [
    { id: '1', name: 'First'},
    { id: '2', name: 'Second'},
    { id: '3', name: 'Third'},
]

export function Chapter11() {
    const onClick = useCallback(() => {
        console.log('clicked')
    }, [])

    return <List items={items} />
}

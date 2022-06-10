import { useState, useEffect } from 'react';

const Search = (props) => {
    const [searched, setSearched] = useState(null)

    const filterList = (e) => {
        setSearched(e.target.value)
    }
    const handleClear = () => {
        setSearched(null)
    }

    useEffect(() => {
        props.sendSearched(searched)
    }, [searched])
    return <>
            <form onSelect={filterList}>
                <input id={props.id === undefined ? null : props.id} list={props.placeholder} placeholder={props.placeholder} type="text" />
                <datalist id={props.placeholder}>
                    {props.list.sort((a, b) => a > b ? 1 : -1).map((i, index) =>
                        <option key={index}>{i}</option>
                    )}
                </datalist>
                <button onClick={handleClear} type="reset">Clear</button>
            </form>
    </>
}

export default Search;
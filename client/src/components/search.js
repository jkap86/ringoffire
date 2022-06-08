import { useState, useEffect } from 'react';

const Search = (props) => {
    const [searched, setSearched] = useState(null)
    
    const filterList = (e) => {
        const leaguemate = props.list.find(x => x === e.target.value)
        setSearched(leaguemate)
    }
    const handleClear = () => {
        const leaguemate = null
        setSearched(leaguemate)
    }

    useEffect(() => {
        props.sendSearched(searched)
    }, [searched])
    return <>
        <h5>
            <form onSelect={filterList}>
                <input list={props.placeholder} placeholder={props.placeholder} type="text" />
                <datalist id={props.placeholder}>
                    {props.list.sort((a, b) => a > b ? 1 : -1).map((i, index) =>
                        <option key={index}>{i}</option>
                    )}
                </datalist>
                <button onClick={handleClear} type="reset">Clear</button>
            </form>
        </h5>
    </>
}

export default Search;
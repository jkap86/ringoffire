import axios from 'axios';
import { useState, useEffect } from 'react';
import volcano from '../volcano.png';

const Homepage = () => {
    const [leagues, setLeagues] = useState([])
    const [season, setSeason] = useState('2022')


    useEffect(() => {
        const fetchData = async () => {
            const getLeagues = async () => {
                const l = await axios.get('/leagues', {
                    params: {
                        season: season
                    }
                })
                return l.data
            }
            const l = await getLeagues()
            setLeagues(l)
        }
        fetchData()
    }, [season])

    console.log(leagues)
    return <>
        <h1>Ring of Fire {season}</h1>
        <div className='nav_container'>
            <button className={season === '2022' ? 'active_nav nav' : 'nav'} onClick={() => setSeason('2022')}>2022</button>
            <button className={season === '2021' ? 'active_nav nav' : 'nav'} onClick={() => setSeason('2021')}>2021</button>
        </div>
        <table className='main'>
            <tbody>
                <tr>
                    <th></th>
                    <th colSpan={1}>Username</th>
                    <th></th>
                    <th colSpan={2}>League</th>
                    <th>Record</th>
                    <th>Fantasy Points</th>
                    <th>Fantasy Points Against</th>
                </tr>
                {leagues.sort((a, b) => b.wins - a.wins || b.fpts - a.fpts || b.fpts_against - a.fpts_against).map(league =>
                    <tr key={league.owner_id}>
                        <td><img className='thumbnail' alt={league.username} src={league.user_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.user_avatar}`} /></td>
                        <td colSpan={1}>{league.username}</td>
                        <td><img className='thumbnail' alt={league.league_name} src={`https://sleepercdn.com/avatars/${league.league_avatar}`} /></td>
                        <td colSpan={2}>{league.league_name}</td>
                        <td>{league.wins}-{league.losses}</td>
                        <td>{league.fpts.toLocaleString("en-US")}</td>
                        <td>{league.fpts_against.toLocaleString("en-US")}</td>
                    </tr>
                )}
            </tbody>
        </table>
    </>
}

export default Homepage;
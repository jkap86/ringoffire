import axios from 'axios';
import { useState, useEffect } from 'react';

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
        <div>
            <button onClick={() => setSeason('2022')}>2022</button>
            <button onClick={() => setSeason('2021')}>2021</button>
        </div>
        <table>
            <tbody>
                <tr>
                    <th>Username</th>
                    <th>League</th>
                    <th>Record</th>
                    <th>Fantasy Points</th>
                    <th>Fantasy Points Against</th>
                </tr>
                {leagues.sort((a, b) => b.wins - a.wins || b.fpts - a.fpts || b.fpts_against - a.fpts_against).map(league =>
                    <tr>
                        <td>{league.username}</td>
                        <td>{league.league}</td>
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
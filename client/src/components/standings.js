import { useState } from "react";
import Roster from "./roster";
import volcano from '../volcano.png';
import Search from "./search";
import { motion } from "framer-motion";

const Standings = (props) => {
    const [leagues, setLeagues] = useState([])
    if (props.leagues !== leagues) setLeagues(props.leagues)
    
    const getSearched = (data) => {
        const l = leagues
        if (data) {
            l.map(league => {
                return league.isLeagueHidden = true
            })
            l.filter(x => x.username === data).map(league => {
                return league.isLeagueHidden = false
            })
        } else {
            l.map(league => {
                return league.isLeagueHidden = false
            })
        }
        setLeagues([...l])
    }

    return <>
        <Search
            list={props.leagues.map(league => league.username)}
            placeholder="Search Managers"
            sendSearched={getSearched} 
        />
        <table className='main'>
            <tbody>
                <tr>
                    <th></th>
                    <th colSpan={3}>Username</th>
                    <th></th>
                    <th colSpan={4}>League</th>
                    <th colSpan={2}>Record</th>
                    <th colSpan={2}>FP</th>
                    <th colSpan={2}>FPA</th>
                </tr>
            </tbody>
            {leagues.filter(x => x.isLeagueHidden === false).sort((a, b) => b.wins - a.wins || b.fpts - a.fpts || b.fpts_against - a.fpts_against || b.owner_id - a.owner_id).map(league =>
                <tbody key={league.owner_id}>
                    <motion.tr 
                        key={league.username}
                        initial={{ y: 900 }}
                        animate={{ y: 0 }}
                        exit={{ y: 900 }}
                        transition={{ duration: 1, type: "spring" }}
                        className={league.isRosterHidden === true ? 'hover clickable' : 'active clickable'} 
                        onClick={() => props.showRoster(league.owner_id)}
                    >
                        <td>
                            <motion.img 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: Math.random() * 10 + 2}}
                                className='thumbnail' 
                                alt={league.username} 
                                src={league.user_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.user_avatar}`} 
                            />
                        </td>
                        <td colSpan={3}>{league.username}</td>
                        <td>
                            <motion.img 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: Math.random() * 10 + 2}}
                                className='thumbnail' 
                                alt={league.league_name} 
                                src={`https://sleepercdn.com/avatars/${league.league_avatar}`} 
                            />
                        </td>
                        <td colSpan={4}>{league.league_name}</td>
                        <td colSpan={2}>{league.wins}-{league.losses}</td>
                        <td colSpan={2}>{league.fpts.toLocaleString("en-US")}</td>
                        <td colSpan={2}>{league.fpts_against.toLocaleString("en-US")}</td>
                    </motion.tr>
                    {league.isRosterHidden === true ? null :
                        <tr className='expanded'>
                            <td colSpan={15}>
                                <Roster roster={league} matchPlayer={props.matchPlayer} matchPick={props.matchPick} />
                            </td>
                        </tr>
                    }
                </tbody>
            )}
        </table>
    </>
}

export default Standings;
import { useState, useEffect } from "react";
import Roster from "./roster";
import volcano from '../volcano.png';
import Search from "./search";
import { motion, AnimatePresence } from "framer-motion";

const Standings = (props) => {
    const [leagues, setLeagues] = useState([])


    useEffect(() => {
        setLeagues(props.leagues.sort((a, b) => b.wins - a.wins || b.fpts - a.fpts))
    }, [props.leagues])

    const sort = (sort_by) => {
        let l = leagues
        switch (sort_by) {
            case 'fpts':
                setLeagues([...l.sort((a, b) => b.fpts - a.fpts)])
                break;
            case 'record':
                setLeagues([...l.sort((a, b) => b.wins - a.wins || a.losses - b.losses || b.fpts - a.fpts)])
                break;
            case 'value':
                setLeagues([...l.sort((a, b) =>
                    b.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0) -
                    a.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0)
                )])
                break;
            case 'fpts_against':
                setLeagues([...l.sort((a, b) => b.fpts_against - a.fpts_against)])
                break;
        }
    }
    
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
                    <th colSpan={2} onClick={() => sort('record')} className="clickable">Record</th>
                    <th colSpan={2} onClick={() => sort('fpts')} className="clickable">FP</th>
                    <th colSpan={2} onClick={() => sort('fpts_against')} className="clickable">FPA</th>
                    <th colSpan={2} onClick={() => sort('value')} className="clickable">Roster Value</th>
                </tr>
            </tbody>
            {leagues.filter(x => x.isLeagueHidden === false).map((league, index) =>
                <AnimatePresence exitBeforeEnter key={index}>
                    <motion.tbody
                        key={league.owner_id}
                        initial={{ y: 900 }}
                        animate={{ y: 0 }}
                        exit={{ y: 900 }}
                        transition={{ duration: 1, type: "spring" }}
                        className={league.isRosterHidden === true ? 'hover clickable' : 'active clickable'}
                    >
                        <tr
                            className={league.isRosterHidden === true ? 'hover clickable' : 'active clickable'}
                            onClick={() => props.showRoster(league.owner_id)}
                        >
                            <td>
                                <motion.img
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: Math.random() * 10 + 2 }}
                                    className='thumbnail'
                                    alt={league.username}
                                    src={league.user_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.user_avatar}`}
                                />
                            </td>
                            <td colSpan={3}>{league.username}</td>
                            <td>
                                <motion.img
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: Math.random() * 10 + 2 }}
                                    className='thumbnail'
                                    alt={league.league_name}
                                    src={`https://sleepercdn.com/avatars/${league.league_avatar}`}
                                />
                            </td>
                            <td colSpan={4}>{league.league_name}</td>
                            <td colSpan={2}>{league.wins}-{league.losses}</td>
                            <td colSpan={2}>{league.fpts.toLocaleString("en-US")}</td>
                            <td colSpan={2}>{league.fpts_against.toLocaleString("en-US")}</td>
                            <td colSpan={2}>{league.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0).toLocaleString("en-US")}</td>
                        </tr>
                        {league.isRosterHidden === true ? null :
                            <AnimatePresence>
                                <motion.tr
                                    key={league.owner_id}
                                    initial={{ y: 900 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: 900 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    className='expanded'
                                >
                                    <td colSpan={17}>
                                        <Roster roster={league} matchPlayer={props.matchPlayer} matchPick={props.matchPick} />
                                    </td>
                                </motion.tr>
                            </AnimatePresence>
                        }
                    </motion.tbody>
                </AnimatePresence>
            )}
        </table>
    </>
}

export default Standings;
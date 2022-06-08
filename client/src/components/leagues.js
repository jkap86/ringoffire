import { useState } from "react";
import volcano from '../volcano.png';
import Roster from "./roster";
import Search from "./search";
import { motion, AnimatePresence } from 'framer-motion';

const Leagues = (props) => {
    const [leagues, setLeagues] = useState([])
    if (props.leagues !== leagues) setLeagues(props.leagues)

    const showLeaguemates = (league_id) => {
        let l = leagues
        l.filter(x => x.league_id === league_id).map(league => {
            league.isRostersHidden = !league.isRostersHidden
        })
        setLeagues([...l])
    }
    const showRoster = (league_id, roster_id) => {
        let l = leagues
        l.filter(x => x.league_id === league_id).map(league => {
            league.rosters.filter(x => x.roster_id === roster_id).map(roster => {
                roster.isRosterHidden = !roster.isRosterHidden
            })
        })
        setLeagues([...l])
    }

    const getSearched = (data) => {
        const l = leagues
        if (data) {
            l.map(league => {
                return league.isLeagueHidden = true
            })
            l.filter(x => x.name === data).map(league => {
                return league.isLeagueHidden = false
            })
        } else {
            l.map(leagues => {
                return leagues.isLeagueHidden = false
            })
        }
        setLeagues([...l])
    }

    return <>
        <Search
            list={leagues.map(league => league.name)}
            placeholder="Search Leagues"
            sendSearched={getSearched}
        />
        <table className="main">
            {leagues.filter(x => x.isLeagueHidden === false).sort((a, b) => a.name > b.name ? 1 : -1).map((league, index) =>
                <AnimatePresence exitBeforeEnter>
                    <motion.tbody
                        key={league.name}
                        initial={{ y: 900 }}
                        animate={{ y: 0 }}
                        exit={{ y: 900 }}
                        transition={{ duration: 1, type: "spring" }}
                    >
                        <motion.tr
                            className={league.isRostersHidden ? 'hover2 clickable' : 'active2 clickable'}
                            onClick={() => showLeaguemates(league.league_id)}>
                            <td></td>
                            <td>
                                <div className="leaguewrapper">
                                    <motion.img
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: Math.random() * 10 + 2 }}
                                        className="thumbnail"
                                        alt={league.name}
                                        src={`https://sleepercdn.com/avatars/${league.avatar}`}
                                    />
                                    <p className="league">{league.name}</p>
                                </div>
                            </td>
                            <td></td>
                        </motion.tr>
                        {league.isRostersHidden === true ? null :
                            <AnimatePresence>
                                <motion.tr
                                    key={index}
                                    initial={{ y: 900 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: 900 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    className="expanded">
                                    <td colSpan={3}>
                                        <table className="leagues_users">
                                            <tbody>
                                                <tr>
                                                    <th></th>
                                                    <th colSpan={2}>Leaguemate</th>
                                                    <th>Record</th>
                                                    <th>FP</th>
                                                    <th>FPA</th>
                                                    <th>Roster Value</th>
                                                </tr>
                                            </tbody>
                                            {league.rosters.sort((a, b) => b.settings.wins - a.settings.wins).map(roster =>
                                                <tbody key={roster.owner_id + '_' + roster.roster_id}>
                                                    <tr className={roster.isRosterHidden === true ? 'hover clickable' : 'active clickable'} onClick={() => showRoster(league.league_id, roster.roster_id)}>
                                                        <td>
                                                            <motion.img
                                                                animate={{ rotate: 360 }}
                                                                transition={{ repeat: Infinity, duration: Math.random() * 10 + 2 }}
                                                                className="thumbnail"
                                                                alt={roster.username}
                                                                src={roster.avatar === null ? volcano : `https://sleepercdn.com/avatars/${roster.avatar}`}
                                                            />
                                                        </td>
                                                        <td colSpan={2}>{roster.username}</td>
                                                        <td>{roster.settings.wins}-{roster.settings.losses}</td>
                                                        <td>{roster.settings.fpts_decimal === undefined ? 0 : roster.settings.fpts + '.' + roster.settings.fpts_decimal}</td>
                                                        <td>{roster.settings.fpts_against_decimal === undefined ? 0 : roster.settings.fpts_against + '.' + roster.settings.fpts_against_decimal}</td>
                                                        <td>{roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0).toLocaleString("en-US")}</td>
                                                    </tr>
                                                    {roster.isRosterHidden === true ? null :
                                                        <tr>
                                                            <td colSpan={7}>
                                                                <Roster
                                                                    roster={roster}
                                                                    matchPlayer={props.matchPlayer}
                                                                    matchPick={props.matchPick}
                                                                />
                                                            </td>
                                                        </tr>

                                                    }
                                                </tbody>
                                            )}
                                        </table>
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
export default Leagues;
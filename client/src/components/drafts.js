import { useState } from "react";
import volcano from '../volcano.png';
import allPlayers from '../allPlayers.json';
import Search from "./search";


const Drafts = (props) => {
    const [drafts, setDrafts] = useState([])
    if (props.drafts !== drafts) setDrafts(props.drafts)

    const showPicks = (e) => {
        let d = drafts
        d.filter(x => x.draft.draft_id === e).map(draft => {
            draft.isPicksHidden = !draft.isPicksHidden
        })
        setDrafts([...d])
    }

    const getSearched = (data) => {
        const d = drafts
        if (data) {
            d.map(draft => {
                return draft.isDraftHidden = true
            })
            d.filter(x => x.league_name === data).map(draft => {
                return draft.isDraftHidden = false
            })
        } else {
            d.map(draft => {
                return draft.isDraftHidden = false
            })
        }
        setDrafts([...d])
    }

    return <>
        <Search
            list={drafts.map(draft => draft.league_name)}
            placeholder="Search Drafts"
            sendSearched={getSearched}
        />
        <table className="main">
            {drafts.filter(x => x.isDraftHidden === false).sort((a, b) => a.league_name > b.league_name ? 1 : -1).map((draft, index) =>
                    <tbody key={index}>
                        <tr className={draft.isPicksHidden ? 'hover2 slide_up' : 'active2 slide_up'}>
                            <td>
                                <div onClick={() => showPicks(draft.draft.draft_id)} className="leaguewrapper clickable">
                                    <img
                                        style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                        className="thumbnail"
                                        alt={draft.league_name}
                                        src={`https://sleepercdn.com/avatars/${draft.league_avatar}`}
                                    />
                                    <p className="league">{draft.league_name}</p>
                                    <p className="draft_status">{draft.draft.status.replace('_', '')}</p>
                                </div>
                            </td>
                        </tr>
                        {draft.isPicksHidden === true ? null :
                            <tr className="draft_picks slide_up">
                                <td>
                                    {Array.from(Array(draft.draft.settings.rounds).keys()).map(n => n + 1).map((round, index) =>
                                        <div className="round_row" key={index}>
                                            <table className="round">
                                                <tbody>
                                                    {draft.picks.filter(x => x.round === round).length > 0 ?
                                                        <tr>
                                                            <th>R</th>
                                                            <th>P</th>
                                                            <th colSpan={2}>Manager</th>
                                                            <th>Pos</th>
                                                            <th colSpan={2}>Player</th>
                                                            <th>Value</th>
                                                        </tr>
                                                        : null
                                                    }
                                                    {draft.picks.filter(x => x.round === round).map((pick, index) =>
                                                        <tr className="hover" key={index}>
                                                            <td>{pick.round}</td>
                                                            <td>{(pick.pick_no % draft.total_rosters) === 0 ? draft.total_rosters : (pick.pick_no % draft.total_rosters)}</td>
                                                            <td><img className="thumbnail_small" alt="avatar" src={pick.picked_by_avatar === null ? volcano : `https://sleepercdn.com/avatars/${pick.picked_by_avatar}`} /></td>
                                                            <td className="left">{pick.picked_by}</td>
                                                            <td>{allPlayers[pick.player_id].position}</td>
                                                            <td><img className="thumbnail_small" alt='headshot' src={`https://sleepercdn.com/content/nfl/players/thumb/${pick.player_id}.jpg`} onError={(e) => { return e.target.src = volcano }} /></td>
                                                            <td className="left">
                                                                {allPlayers[pick.player_id].first_name + " " + allPlayers[pick.player_id].last_name +
                                                                    " " + (allPlayers[pick.player_id].team === null ? 'FA' : allPlayers[pick.player_id].team)}
                                                            </td>
                                                            <td>
                                                                <em>{props.matchPlayer(pick.player_id)}</em>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        }
                    </tbody>
            )}
        </table>
    </>
}

export default Drafts;
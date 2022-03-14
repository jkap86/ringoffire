import Roster from "./roster";
import volcano from '../volcano.png';

const Standings = (props) => {

    return <>
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
            {props.leagues.sort((a, b) => b.wins - a.wins || b.fpts - a.fpts || b.fpts_against - a.fpts_against || b.owner_id - a.owner_id).map(league =>
                <tbody key={league.owner_id}>
                    <tr className={league.isRosterHidden === true ? 'hover clickable' : 'active clickable'} onDoubleClick={() => props.showRoster(league.owner_id)}>
                        <td><img className='thumbnail' alt={league.username} src={league.user_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.user_avatar}`} /></td>
                        <td colSpan={3}>{league.username}</td>
                        <td><img className='thumbnail' alt={league.league_name} src={`https://sleepercdn.com/avatars/${league.league_avatar}`} /></td>
                        <td colSpan={4}>{league.league_name}</td>
                        <td colSpan={2}>{league.wins}-{league.losses}</td>
                        <td colSpan={2}>{league.fpts.toLocaleString("en-US")}</td>
                        <td colSpan={2}>{league.fpts_against.toLocaleString("en-US")}</td>
                    </tr>
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
const workerpool = require('workerpool')
const axios = require('axios')

const getDraftPicks = async (league, rosters, users, traded_picks_current, drafts) => {
    let draft_season;
    if (drafts.find(x => x.status === 'pre_draft' && x.settings.rounds === league.settings.draft_rounds) === undefined) {
        draft_season = parseInt(league.season) + 1
    } else {
        draft_season = parseInt(league.season)
    }

    let traded_picks = traded_picks_current
    let previous_league_id = league.previous_league_id
    let i = draft_season
    while (previous_league_id > 0 && i <= parseInt(league.season) + 2) {
        const [picks, prev_league] = await Promise.all([
            await axios.get(`https://api.sleeper.app/v1/league/${previous_league_id}/traded_picks`),
            await axios.get(`https://api.sleeper.app/v1/league/${previous_league_id}`)
        ])
        traded_picks.push(picks.data.filter(x => parseInt(x.season) >= draft_season))
        previous_league_id = prev_league.data.previous_league_id
        i = i + 1
    }
    traded_picks = traded_picks.flat()

    let original_picks = {}
    for (let i = 1; i <= league.total_rosters; i++) {
        const user_id = rosters.find(x => x.roster_id === i).owner_id
        const username = users.find(x => x.user_id === user_id) === undefined ? 'orphan' : users.find(x => x.user_id === user_id).display_name
        original_picks[i] = {
            username: username,
            picks: {}
        }
        for (let j = draft_season; j <= parseInt(league.season) + 2; j++) {
            original_picks[i]['picks'][j] = {}
            for (let k = 1; k <= league.settings.draft_rounds; k++) {
                let picks = [i]
                let picks_in = traded_picks.filter(x => parseInt(x.season) === j && x.round === k && x.owner_id === i)
                let picks_out = traded_picks.filter(x => parseInt(x.season) === j && x.round === k && x.previous_owner_id === i)

                picks_in.map(pick => {
                    picks.push(pick.roster_id)
                })
                for (let l = 0; l < picks_out.length; l++) {
                    const index = picks.indexOf(picks_out[l].roster_id)
                    if (index !== -1) {
                        picks.splice(index, 1)
                    }

                }
                original_picks[i]['picks'][j][k] = {}
                original_picks[i]['picks'][j][k].picks = Array.from(new Set(picks))
                original_picks[i]['picks'][j][k].picks_in = picks_in
                original_picks[i]['picks'][j][k].picks_out = picks_out
            }
        }
    }

    return original_picks
}

const getStandings = async (season) => {
    const leagues = await axios.get(`https://api.sleeper.app/v1/user/435483482039250944/leagues/nfl/${season}`)
    let leaguesROF = leagues.data.filter(x => x.name.includes('Ring of Fire: '))
    let rostersROF = []
    await Promise.all(leaguesROF.map(async league => {
        const [rosters, users, traded_picks_current, drafts] = await Promise.all([
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/rosters`),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/users`),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/traded_picks`),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/drafts`)
        ])
        let draft_picks = await getDraftPicks(league, rosters.data, users.data, traded_picks_current.data, drafts.data)
        rosters.data.map(roster => {
            rostersROF.push({
                ...roster,
                draft_picks: draft_picks[roster.roster_id],
                league_name: league.name,
                league_avatar: league.avatar,
                username: roster.owner_id > 0 ? users.data.find(x => x.user_id === roster.owner_id).display_name : 'orphan',
                user_avatar: roster.owner_id > 0 ? users.data.find(x => x.user_id === roster.owner_id).avatar : null,
                wins: roster.settings.wins,
                losses: roster.settings.losses,
                ties: roster.settings.ties,
                fpts: parseFloat(roster.settings.fpts + '.' + roster.settings.fpts_decimal),
                fpts_against: roster.settings.fpts_against === undefined ? 0 : parseFloat(roster.settings.fpts_against + '.' + roster.settings.fpts_against_decimal),
                isLeagueHidden: false,
                isRosterHidden: true
            })
        })
    }))
    return rostersROF
}

workerpool.worker({
    getStandings: getStandings
})


export interface ILeaderboardDef {
    leaderboardId: number;
    name: string;
    abbreviation: string;
}

export interface ILeaderboard {
    leaderboardId: number;
    total: number;
    start: number;
    count: number;
    page: number;
    country: string;
    players: ILeaderboardPlayer[];
}

export interface ILeaderboardPlayer {
    leaderboardId: number;
    profileId: number;
    name: string;
    rank: number;
    rankCountry: number;
    rating: number;
    lastMatchTime: string;
    streak: number;
    wins: number;
    losses: number;
    drops: number;
    updatedAt: string;
    games: number;
    country: string;
}

// export interface ILeaderboardPlayer {
//     clan: string;
//     country: string;
//     drops: number;
//     games: number;
//     highest_rating: number;
//     highest_streak: number;
//     icon: any;
//     last_match: Date;
//     last_match_time: Date;
//     losses: number;
//     lowest_streak: number;
//     name: string;
//     previous_rating: number;
//     profile_id: number;
//     rank: number;
//     rating: number;
//     steam_id: string;
//     streak: number;
//     wins: number;
// }
//
// export interface ILeaderboard {
//     count: number;
//     length: number;
//     leaderboard_id?: number;
//     event_leaderboard_id?: number;
//     start: number;
//     total: number;
//     players: ILeaderboardPlayer[];
//     updated?: Date;
// }


export interface IFetchLeaderboardParams {
    leaderboardId: number;
    page?: number;
    search?: string;
    steamId?: string;
    profileId?: number;
    country?: string;

    pageParam?: string;
}



export interface IRatingHistoryEntryRaw {
  drops: number;
  num_losses: number;
  num_wins: number;
  rating: number;
  streak: number;
  timestamp?: any;
}

export interface IRatingHistoryEntry extends IRatingHistoryEntryRaw {
  timestamp?: Date;
}

export interface IPlayer {
  civ: number;
  clan: string;
  color: number;
  country: string;
  drops: number;
  games: number;
  name: string;
  profile_id: number;
  rating: number;
  rating_change: any;
  slot: number;
  slot_type: any;
  steam_id: string;
  streak: any;
  team: number;
  wins: any;
  won: any;
}

export interface IMatchRaw {
  average_rating: any;
  cheats: boolean;
  ending_age: number;
  expansion: any;
  finished?: any;
  checked?: any;
  full_tech_tree: boolean;
  game_type: any;
  has_custom_content: any;
  has_password: boolean;
  leaderboard_id: number;
  lobby_id: any;
  lock_speed: boolean;
  lock_teams: boolean;
  map_size: number;
  map_type: number;
  match_id: string;
  match_uuid: string;
  name: string;
  num_players: number;
  num_slots: number;
  opened?: any;
  players: IPlayer[];
  pop: number;
  ranked: boolean;
  rating_type: any;
  resources: any;
  rms: any;
  scenario: any;
  server: string;
  shared_exploration: boolean;
  speed: number;
  started?: any;
  starting_age: number;
  team_positions: boolean;
  team_together: boolean;
  treaty_length: any;
  turbo: boolean;
  version: string;
  victory: any;
  victory_time: any;
  visibility: any;
}

export interface IMatch extends IMatchRaw {
  started?: Date;
  opened?: Date;
  finished?: Date;
  checked?: Date;
}

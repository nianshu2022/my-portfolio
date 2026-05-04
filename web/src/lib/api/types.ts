export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  description: string;
  iconName: string;
}

export interface HitokotoData {
  id: number;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string | null;
}


export interface GitHubUserData {
  login: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface V2exTopic {
  id: number;
  title: string;
  url: string;
  content: string;
  replies: number;
  created: number;
  node: { name: string; title: string };
  member: { username: string; avatar_mini: string };
}

export interface ITHomeNews {
  title: string;
  url: string;
  pubDate: string;
}

export interface TrendingRepo {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: string;
}

export interface NetEaseTrack {
  id: number;
  name: string;
  artists: { name: string }[];
  album: { name: string; picUrl: string };
  duration: number;
}

export interface GeoLocationData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  cityZh?: string;
  countryZh?: string;
  timezoneZh?: string;
}

export interface PoemData {
  content: string;
  title: string;
  author: string;
  dynasty: string;
}

export interface HistoryEvent {
  year: string;
  title: string;
}

export interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

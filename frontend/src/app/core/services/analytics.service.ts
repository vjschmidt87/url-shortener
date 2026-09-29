import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DayCount {
  date: string;
  count: number;
}

export interface NameCount {
  name: string;
  count: number;
}

export interface RecentClick {
  clickedAt: string;
  browser: string;
  os: string;
  country: string;
}

export interface AnalyticsResponse {
  totalClicks: number;
  clicksByDay: DayCount[];
  clicksByBrowser: NameCount[];
  clicksByOs: NameCount[];
  clicksByCountry: NameCount[];
  recentClicks: RecentClick[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getAnalytics(shortCode: string): Observable<AnalyticsResponse> {
    return this.http.get<AnalyticsResponse>(`/api/analytics/${shortCode}`);
  }
}

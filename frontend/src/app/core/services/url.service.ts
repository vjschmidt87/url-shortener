import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShortUrlResponse {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customAlias: string | null;
  title: string | null;
  totalClicks: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface ShortenRequest {
  url: string;
  customAlias?: string;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class UrlService {
  constructor(private http: HttpClient) {}

  shorten(request: ShortenRequest): Observable<ShortUrlResponse> {
    return this.http.post<ShortUrlResponse>('/api/urls/shorten', request);
  }

  getUserUrls(): Observable<ShortUrlResponse[]> {
    return this.http.get<ShortUrlResponse[]>('/api/urls/my');
  }

  toggleActive(id: number): Observable<ShortUrlResponse> {
    return this.http.put<ShortUrlResponse>(`/api/urls/${id}/toggle`, {});
  }

  deleteUrl(id: number): Observable<void> {
    return this.http.delete<void>(`/api/urls/${id}`);
  }
}

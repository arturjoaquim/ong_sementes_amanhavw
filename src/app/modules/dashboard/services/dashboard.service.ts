import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStatsDTO } from '../types/dashboard-stats.dto';
import { RecentActivityDTO } from '../types/recent-activity.dto';
import { DashboardDistributionDTO } from '../types/dashboard-distribution.dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/dashboard';

  getStats(): Observable<DashboardStatsDTO> {
    return this.http.get<DashboardStatsDTO>(`${this.apiUrl}/stats`);
  }

  getRecentActivities(): Observable<RecentActivityDTO[]> {
    return this.http.get<RecentActivityDTO[]>(`${this.apiUrl}/activities`);
  }

  getDistribution(): Observable<DashboardDistributionDTO> {
    return this.http.get<DashboardDistributionDTO>(`${this.apiUrl}/distribution`);
  }
}

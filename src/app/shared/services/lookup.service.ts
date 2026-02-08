import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LookupTypeEnum } from '../utils/lookup-type.enum';
import { LookupDTO } from '../types/lookup.dto';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/lookups';

  // Cache para armazenar os resultados das requisições
  private listCache = new Map<LookupTypeEnum, LookupDTO[]>();
  private mapCache = new Map<LookupTypeEnum, Record<number, LookupDTO>>();

  /**
   * Obtém uma lista de Lookups para um determinado tipo.
   * Utiliza cache para evitar requisições repetidas.
   */
  getLookupAsList(type: LookupTypeEnum): Observable<LookupDTO[]> {
    if (this.listCache.has(type)) {
      return of(this.listCache.get(type)!);
    }

    return this.http.get<LookupDTO[]>(`${this.apiUrl}/${type}/list`).pipe(
      tap((data) => {
        this.listCache.set(type, data);
      }),
    );
  }

  /**
   * Obtém um mapa de Lookups (ID -> DTO) para um determinado tipo.
   * Utiliza cache para evitar requisições repetidas.
   */
  getLookupAsMap(type: LookupTypeEnum): Observable<Record<number, LookupDTO>> {
    if (this.mapCache.has(type)) {
      return of(this.mapCache.get(type)!);
    }

    return this.http.get<Record<number, LookupDTO>>(`${this.apiUrl}/${type}/map`).pipe(
      tap((data) => {
        this.mapCache.set(type, data);
      }),
    );
  }

  /**
   * Limpa o cache de um tipo específico ou todo o cache se nenhum tipo for fornecido.
   */
  clearCache(type?: LookupTypeEnum): void {
    if (type) {
      this.listCache.delete(type);
      this.mapCache.delete(type);
    } else {
      this.listCache.clear();
      this.mapCache.clear();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  enviar(mensagemId: string, conteudoMensagem: string) {
    return this.http.post(`${this.apiUrl}/notificar`, { mensagemId, conteudoMensagem });
  }

  obterStatus(id: string) {
    return this.http.get(`${this.apiUrl}/notificacao/status/${id}`);
  }
}

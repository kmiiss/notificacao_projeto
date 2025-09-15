import { Component } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { NotificacaoService } from './notificacao.service';

@Component({
  selector: 'app-notificacao',
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.scss']
})
export class NotificacaoComponent {
  conteudoMensagem = '';
  mensagens: { id: string, conteudo: string, status: string }[] = [];

  constructor(private service: NotificacaoService) {}

  enviar() {
    if (!this.conteudoMensagem || !this.conteudoMensagem.trim()) return;
    const mensagemId = uuid();
    const conteudo = this.conteudoMensagem.trim();

    this.service.enviar(mensagemId, conteudo).subscribe({
      next: (resp: any) => {
        this.mensagens.unshift({ id: mensagemId, conteudo, status: 'AGUARDANDO_PROCESSAMENTO' });
        this.conteudoMensagem = '';

        const interval = setInterval(() => {
          this.service.obterStatus(mensagemId).subscribe({
            next: (r: any) => {
              const msg = this.mensagens.find(m => m.id === mensagemId);
              if (msg) msg.status = r.status;

              if (r.status !== 'AGUARDANDO_PROCESSAMENTO') {
                clearInterval(interval);
              }
            },
            error: () => {
              // continua polling, possivelmente ainda não processado
            }
          });
        }, 3000);
      },
      error: (err) => {
        console.error('Erro ao enviar', err);
      }
    });
  }
}

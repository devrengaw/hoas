'use client';

import React, { useState } from 'react';
import { Send, Paperclip, MoreVertical, Search, Phone, Video, Info, User, Check, CheckCheck, MessageSquare } from 'lucide-react';
import styles from './page.module.css';
import MeetingRoom from '@/components/MeetingRoom';

export default function MessagesPage() {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const contacts = [
    { id: 1, name: "Mariana Silva", company: "Agência Global", lastMsg: "Podemos fechar o valor de R$ 450k?", time: "10:24", unread: 2, online: true, project: "Caminhos do Sol - Verão 2026", price: "R$ 450.000,00" },
    { id: 2, name: "David Chen", company: "TV Alpha", lastMsg: "Briefing recebido, vou analisar.", time: "15:30", unread: 0, online: false, project: "Patrocínio Tech X", price: "R$ 120.000,00" },
    { id: 3, name: "Pedro Santos", company: "XYZ Media", lastMsg: "O projeto foi aprovado pelo cliente.", time: "Terça", unread: 0, online: true, project: "Podcast Alpha Night", price: "R$ 80.000,00" },
  ];

  const histories: Record<number, any[]> = {
    1: [
      { id: 1, sender: 'them', text: "Bom dia! Gostamos muito do projeto 'Caminhos do Sol'.", time: "09:15" },
      { id: 2, sender: 'me', text: "Bom dia, Mariana! Fico feliz que tenham gostado. É um projeto com muita força para o verão.", time: "09:20" },
      { id: 3, sender: 'them', text: "Estávamos analisando o budget. Conseguimos chegar em R$ 450k para o patrocínio master?", time: "10:24" },
    ],
    2: [
      { id: 1, sender: 'me', text: "Oi David, acabei de subir o briefing do novo projeto Tech X.", time: "14:00" },
      { id: 2, sender: 'them', text: "Briefing recebido, vou analisar com a equipe comercial.", time: "15:30" },
    ],
    3: [
      { id: 1, sender: 'them', text: "Fala Pedro! Alguma novidade sobre o Podcast?", time: "Segunda" },
      { id: 2, sender: 'me', text: "Aguardando a confirmação do cliente sobre as inserções.", time: "Segunda" },
      { id: 3, sender: 'them', text: "O projeto foi aprovado pelo cliente. Podemos avançar com o termo!", time: "Terça" },
    ]
  };

  const activeChat = contacts.find(c => c.id === activeChatId);
  const chatHistory = activeChatId ? histories[activeChatId] || [] : [];

  const startCall = () => setIsCalling(true);
  const endCall = () => setIsCalling(false);

  return (
    <div className={styles.container}>
      {isCalling && activeChat && (
        <MeetingRoom 
          partnerName={activeChat.name} 
          company={activeChat.company} 
          onEndCall={endCall} 
        />
      )}

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Conversas</h2>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Buscar contatos..." />
          </div>
        </div>
        
        <div className={styles.contactList}>
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className={`${styles.contactItem} ${activeChatId === contact.id ? styles.activeContact : ''}`}
              onClick={() => setActiveChatId(contact.id)}
            >
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  <User size={20} />
                </div>
                {contact.online && <div className={styles.onlineBadge} />}
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactTop}>
                  <span className={styles.contactName}>{contact.name}</span>
                  <span className={styles.contactTime}>{contact.time}</span>
                </div>
                <div className={styles.contactBottom}>
                  <p className={styles.lastMsg}>{contact.lastMsg}</p>
                  {contact.unread > 0 && <span className={styles.unreadCount}>{contact.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.chatArea}>
        {activeChat ? (
          <>
            <header className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <div className={styles.avatar}>
                  <User size={20} />
                </div>
                <div>
                  <h3>{activeChat.name}</h3>
                  <p>{activeChat.company} • {activeChat.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.iconBtn} onClick={startCall}><Phone size={20} /></button>
                <button className={styles.iconBtn} onClick={startCall}><Video size={20} /></button>
                <button className={styles.iconBtn}><Info size={20} /></button>
                <button className={styles.iconBtn}><MoreVertical size={20} /></button>
              </div>
            </header>

            <div className={styles.messages}>
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'me' ? styles.me : styles.them}`}>
                  <div className={styles.messageBubble}>
                    <p>{msg.text}</p>
                    <div className={styles.msgFooter}>
                      <span>{msg.time}</span>
                      {msg.sender === 'me' && <CheckCheck size={14} className={styles.checkIcon} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.inputArea}>
              <button className={styles.attachBtn}><Paperclip size={20} /></button>
              <input 
                type="text" 
                placeholder="Escreva sua mensagem ou envie uma nova proposta..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className={styles.sendBtn}>
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyChat}>
            <div className={styles.emptyIcon}>
              <MessageSquare size={64} />
            </div>
            <h2>Sua Central de Negociações</h2>
            <p>Selecione uma conversa para começar a negociar seus projetos e briefings.</p>
          </div>
        )}
      </main>

      {activeChat && (
        <aside className={styles.contextSidebar}>
          <div className={styles.contextHeader}>
            <h3>Contexto do Negócio</h3>
          </div>
          <div className={styles.contextContent}>
            <div className={styles.contextCard}>
              <label>Projeto Relacionado</label>
              <h4>{activeChat.project}</h4>
              <span className={styles.badge}>Status: Em Negociação</span>
            </div>
            
            <div className={styles.contextCard}>
              <label>Valor em Discussão</label>
              <h4 className={styles.price}>{activeChat.price}</h4>
              <p>Proposta atualizada via IA</p>
            </div>

            <div className={styles.contextActions}>
              <button className={styles.primaryAction}>Gerar Novo Termo</button>
              <button className={styles.secondaryAction} onClick={startCall}>Agendar / Iniciar Chamada</button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

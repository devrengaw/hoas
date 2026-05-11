'use client';

import React, { useState } from 'react';
import { Send, Paperclip, MoreVertical, Search, Phone, Video, Info, User, Check, CheckCheck, MessageSquare, X, XCircle } from 'lucide-react';
import styles from './page.module.css';
import MeetingRoom from '@/components/MeetingRoom';
import { mockProposals, Proposal } from '@/lib/mockData';

export default function MessagesPage() {
  const [activeChatId, setActiveChatId] = useState<number | string | null>(1);
  const [message, setMessage] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  // Map proposals to contacts
  const contacts = mockProposals.map(p => ({
    id: p.id,
    name: p.contact,
    company: p.agency,
    lastMsg: p.id === 1 ? "Podemos fechar o valor de R$ 450k?" : "Proposta enviada.",
    time: "10:24",
    unread: p.id === 1 ? 2 : 0,
    online: true,
    project: p.project,
    price: p.budget,
    status: p.status,
    proposal: p
  }));

  const [histories, setHistories] = useState<Record<string | number, any[]>>({
    1: [
      { id: 1, sender: 'them', text: "Bom dia! Gostamos muito do projeto 'Caminhos do Sol'.", time: "09:15" },
      { id: 2, sender: 'me', text: "Bom dia, Mariana! Fico feliz que tenham gostado. É um projeto com muita força para o verão.", time: "09:20" },
      { id: 3, sender: 'them', text: "Estávamos analisando o budget. Conseguimos chegar em R$ 450k para o patrocínio master?", time: "10:24" },
    ],
    2: [
      { id: 1, sender: 'them', text: "Olá! Alguma dúvida sobre nossa proposta estratégica?", time: "Ontem" },
    ]
  });

  const activeChat = contacts.find(c => c.id === activeChatId);
  const chatHistory = activeChatId ? histories[activeChatId] || [] : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChatId) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistories(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
    setMessage('');

    // Simulated Auto-Reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'them',
        text: "Entendido, vou verificar isso com minha equipe e te retorno em breve!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistories(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), reply]
      }));
    }, 2000);
  };

  const [showPIModal, setShowPIModal] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMediaKitModal, setShowMediaKitModal] = useState(false);

  const startCall = () => setIsCalling(true);
  const endCall = () => setIsCalling(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });

  const handleBlockContact = () => {
    if (activeChat) {
      setConfirmConfig({
        title: 'Bloquear Contato',
        message: `Deseja realmente bloquear ${activeChat.company}? Você não poderá mais trocar mensagens com este contato.`,
        onConfirm: () => {
          alert(`${activeChat.company} foi bloqueado.`);
          setShowMoreMenu(false);
          setShowConfirmModal(false);
        }
      });
      setShowConfirmModal(true);
    }
  };

  const handleClearHistory = () => {
    if (activeChatId) {
      setConfirmConfig({
        title: 'Limpar Histórico',
        message: "Deseja limpar todo o histórico desta conversa? Esta ação não pode ser desfeita.",
        onConfirm: () => {
          setHistories({ ...histories, [activeChatId]: [] });
          setShowMoreMenu(false);
          setShowConfirmModal(false);
        }
      });
      setShowConfirmModal(true);
    }
  };

  return (
    <div className={styles.container}>
      {isCalling && activeChat && (
        <MeetingRoom 
          partnerName={activeChat.name} 
          company={activeChat.company} 
          onEndCall={endCall} 
        />
      )}

      {/* Agency Profile Modal */}
      {showProfileModal && activeChat && (
        <div className={styles.modalOverlay}>
          <div className={styles.profileModal}>
            <button className={styles.closeModalBtn} onClick={() => setShowProfileModal(false)}><X size={24} /></button>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>{activeChat.company[0]}</div>
              <h2>{activeChat.company}</h2>
              <p>Parceiro HOAS desde 2024</p>
            </div>
            <div className={styles.profileBody}>
              <div className={styles.profileInfo}>
                <label>Responsável</label>
                <p>{activeChat.name}</p>
              </div>
              <div className={styles.profileInfo}>
                <label>Especialidades</label>
                <div className={styles.tagCloud}>
                  <span className={styles.tag}>Marketing Digital</span>
                  <span className={styles.tag}>OOH</span>
                  <span className={styles.tag}>Performance</span>
                </div>
              </div>
              <div className={styles.profileInfo}>
                <label>Sobre a Agência</label>
                <p>Uma das maiores agências de performance do país, focada em resultados reais e parcerias estratégicas com grandes veículos.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Kit Modal */}
      {showMediaKitModal && activeChat && (
        <div className={styles.modalOverlay}>
          <div className={styles.mediaKitModal}>
            <button className={styles.closeModalBtn} onClick={() => setShowMediaKitModal(false)}><X size={24} /></button>
            <div className={styles.mediaKitHeader}>
              <h3>Media Kit - {activeChat.company}</h3>
            </div>
            <div className={styles.mediaKitGrid}>
              <div className={styles.mediaStat}>
                <span>Alcance</span>
                <h4>2.4M</h4>
              </div>
              <div className={styles.mediaStat}>
                <span>Engajamento</span>
                <h4>15.2%</h4>
              </div>
              <div className={styles.mediaStat}>
                <span>Projetos Ativos</span>
                <h4>12</h4>
              </div>
            </div>
            <div className={styles.mediaContent}>
              <p>Visualizando apresentações comerciais e cases de sucesso da agência...</p>
              <div className={styles.placeholderGallery}>
                <div className={styles.galleryItem}>Case Verão</div>
                <div className={styles.galleryItem}>Case Tech</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PI Modal and others ... */}
      {showPIModal && activeChat && (
        <div className={styles.modalOverlay}>
          {/* ... Modal content ... */}
          <div className={styles.piModal}>
            <div className={styles.piHeader}>
              <div className={styles.piBrand}>
                <div className={styles.piLogo}>H</div>
                <div>
                  <h2>HOAS</h2>
                  <p>Marketplace de Mídia</p>
                </div>
              </div>
              <div className={styles.piDocInfo}>
                <h3>PEDIDO DE INSERÇÃO (PI)</h3>
                <p>Nº 2026-{activeChat.id}092</p>
                <span>Data: {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className={styles.piBody}>
              <div className={styles.piSection}>
                <h4>1. DADOS DO ANUNCIANTE / AGÊNCIA</h4>
                <div className={styles.piGrid}>
                  <div>
                    <label>Agência:</label>
                    <p>{activeChat.company}</p>
                  </div>
                  <div>
                    <label>Contato:</label>
                    <p>{activeChat.name}</p>
                  </div>
                  <div>
                    <label>CNPJ:</label>
                    <p>00.000.000/0001-00</p>
                  </div>
                </div>
              </div>

              <div className={styles.piSection}>
                <h4>2. DETALHES DA VEICULAÇÃO</h4>
                <div className={styles.piGrid}>
                  <div>
                    <label>Projeto:</label>
                    <p>{activeChat.project}</p>
                  </div>
                  <div>
                    <label>Veículo:</label>
                    <p>Antena 1 / TV Alpha (Marketplace HOAS)</p>
                  </div>
                  <div>
                    <label>Período:</label>
                    <p>{activeChat.proposal.fullBriefing.period}</p>
                  </div>
                </div>
              </div>

              <div className={styles.piSection}>
                <h4>3. VALORES E CONDIÇÕES</h4>
                <div className={styles.piTable}>
                  <div className={styles.piRowHeader}>
                    <span>Descrição</span>
                    <span>Qtd</span>
                    <span>Valor Unit.</span>
                    <span>Total</span>
                  </div>
                  <div className={styles.piRow}>
                    <span>Cota Master - {activeChat.project}</span>
                    <span>1</span>
                    <span>{activeChat.price}</span>
                    <span>{activeChat.price}</span>
                  </div>
                </div>
                <div className={styles.piTotal}>
                  <div className={styles.piTotalRow}>
                    <label>Valor Bruto:</label>
                    <span>{activeChat.price}</span>
                  </div>
                  <div className={styles.piTotalRow}>
                    <label>Comissão Agência (20%):</label>
                    <span>R$ { (parseFloat(activeChat.price.replace(/[^\d,]/g, '').replace(',', '.')) * 0.2).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</span>
                  </div>
                  <div className={`${styles.piTotalRow} ${styles.grandTotal}`}>
                    <label>Valor Líquido:</label>
                    <span>R$ { (parseFloat(activeChat.price.replace(/[^\d,]/g, '').replace(',', '.')) * 0.8).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</span>
                  </div>
                </div>
              </div>

              <div className={styles.piFooter}>
                <div className={styles.piSign}>
                  <div className={styles.piSignLine}></div>
                  <p>Assinatura do Veículo</p>
                </div>
                <div className={styles.piSign}>
                  <div className={styles.piSignLine}></div>
                  <p>Assinatura da Agência</p>
                </div>
              </div>
            </div>

            <div className={styles.piActions}>
              <button className={styles.printBtn} onClick={() => window.print()}>
                Exportar PDF / Imprimir
              </button>
              <button className={styles.closePIBtn} onClick={() => setShowPIModal(false)}>
                Fechar Documento
              </button>
            </div>
          </div>
        </div>
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
                  {contact.company[0]}
                </div>
                {contact.online && <div className={styles.onlineBadge} />}
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactTop}>
                  <span className={styles.contactName}>{contact.name}</span>
                  <span className={styles.contactTime}>{contact.time}</span>
                </div>
                <div className={styles.contactBottom}>
                  <p className={styles.lastMsg}>
                    {histories[contact.id]?.length > 0 
                      ? histories[contact.id][histories[contact.id].length - 1].text 
                      : contact.lastMsg}
                  </p>
                  {contact.unread > 0 && activeChatId !== contact.id && (
                    <span className={styles.unreadCount}>{contact.unread}</span>
                  )}
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
                  {activeChat.company[0]}
                </div>
                <div>
                  <h3>{activeChat.name}</h3>
                  <p>{activeChat.company} • {activeChat.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button className={`${styles.iconBtn} ${showContext ? styles.activeIcon : ''}`} onClick={() => setShowContext(!showContext)} title="Informações"><Info size={20} /></button>
                <div className={styles.moreWrapper}>
                  <button className={styles.iconBtn} onClick={() => setShowMoreMenu(!showMoreMenu)}><MoreVertical size={20} /></button>
                  {showMoreMenu && (
                    <div className={styles.moreMenu}>
                      <button onClick={() => {
                        setShowProfileModal(true);
                        setShowMoreMenu(false);
                      }}>Ver Perfil da Agência</button>
                      <button onClick={() => {
                        setShowMediaKitModal(true);
                        setShowMoreMenu(false);
                      }}>Ver Media Kit</button>
                      <button onClick={handleClearHistory}>Limpar Conversa</button>
                      <button className={styles.danger} onClick={handleBlockContact}>Bloquear Contato</button>
                    </div>
                  )}
                </div>
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

            <form className={styles.inputArea} onSubmit={handleSendMessage}>
              <button type="button" className={styles.attachBtn}><Paperclip size={20} /></button>
              <input 
                type="text" 
                placeholder="Escreva sua mensagem ou envie uma nova proposta..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className={styles.sendBtn}>
                <Send size={20} />
              </button>
            </form>
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

      {activeChat && showContext && (
        <aside className={styles.contextSidebar}>
          <div className={styles.contextHeader}>
            <h3>Contexto do Negócio</h3>
          </div>
          <div className={styles.contextContent}>
            <div className={styles.contextCard}>
              <label>Projeto Relacionado</label>
              <h4>{activeChat.project}</h4>
              <span className={`
                ${styles.badge} 
                ${activeChat.status === 'Pendente' ? styles.pendingBadge : styles.negotiatingBadge}
                ${activeChat.status === 'Recusada' ? styles.rejectedBadge : ''}
              `}>
                Status: {activeChat.status}
              </span>
            </div>
            
            <div className={styles.contextCard}>
              <label>Valor em Discussão</label>
              <h4 className={styles.price}>{activeChat.price}</h4>
              <p>Proposta atualizada via IA</p>
            </div>

            <div className={styles.contextActions}>
              <button className={styles.primaryAction} onClick={() => setShowPIModal(true)}>Gerar Pedido de Inserção</button>
            </div>
          </div>
        </aside>
      )}

      {/* Custom Confirm Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmHeader}>
              <XCircle size={40} color="#ef4444" />
              <h2>{confirmConfig.title}</h2>
            </div>
            <p>{confirmConfig.message}</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              <button className={styles.confirmBtn} onClick={confirmConfig.onConfirm}>Confirmar Ação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

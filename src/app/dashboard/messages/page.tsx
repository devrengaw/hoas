'use client';

import React, { useState } from 'react';
import { 
  Send, Paperclip, MoreVertical, Search, Phone, Video, Info, User, 
  Check, CheckCheck, MessageSquare, X, XCircle, Calendar, Zap, Clock, ArrowLeft,
  Globe, Mail, MapPin, Users, Award, TrendingUp, BarChart3, PieChart, ChevronRight
} from 'lucide-react';
import styles from './page.module.css';
import MeetingRoom from '@/components/MeetingRoom';
import { mockProposals, Proposal } from '@/lib/mockData';

export default function MessagesPage() {
  const [activeChatId, setActiveChatId] = useState<number | string | null>(1);
  const [message, setMessage] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '' });
  const [step, setStep] = useState(1); // 1: Title/Date, 2: Time Slots

  // Mock available dates (next 7 days)
  const availableDates = [
    { day: 'Seg', date: '04/05', full: '2026-05-04' },
    { day: 'Ter', date: '05/05', full: '2026-05-05' },
    { day: 'Qua', date: '06/05', full: '2026-05-06' },
    { day: 'Qui', date: '07/05', full: '2026-05-07' },
    { day: 'Sex', date: '08/05', full: '2026-05-08' },
  ];

  // Mock available times for a selected date
  const availableTimes = ['09:00', '10:30', '14:00', '15:30', '17:00'];

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
  };

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !activeChat) return;

    const meetingMsg = {
      id: Date.now(),
      sender: 'me',
      type: 'meeting_request',
      meeting: {
        title: newMeeting.title,
        date: newMeeting.date,
        time: newMeeting.time,
        status: 'pending'
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistories(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), meetingMsg]
    }));
    setIsScheduling(false);
    setStep(1);
    setNewMeeting({ title: '', date: '', time: '' });

    // Simulated reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'them',
        text: "Acabei de receber sua solicitação de reunião. Vou analisar a agenda e te confirmo por aqui!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistories(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), reply]
      }));
    }, 1500);
  };

  const handleMeetingAction = (msgId: number, action: 'approve' | 'reject' | 'reschedule') => {
    if (!activeChatId) return;

    setHistories(prev => ({
      ...prev,
      [activeChatId]: prev[activeChatId].map(msg => {
        if (msg.id === msgId) {
          return {
            ...msg,
            meeting: { ...msg.meeting, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'reschedule_requested' }
          };
        }
        return msg;
      })
    }));

    if (action === 'approve') {
      alert("Reunião aprovada e adicionada ao calendário de ambos!");
    }
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
            <button className={styles.closeModalBtn} onClick={() => setShowProfileModal(false)}><X size={20} /></button>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>{activeChat.company[0]}</div>
              <h2>{activeChat.company}</h2>
              <p>Parceiro Certificado HOAS • Categoria Platinum</p>
            </div>
            <div className={styles.profileBody}>
              <div className={styles.profileGrid}>
                <div className={styles.profileInfo}>
                  <label><User size={14} /> Responsável</label>
                  <p>{activeChat.name}</p>
                </div>
                <div className={styles.profileInfo}>
                  <label><Globe size={14} /> Website</label>
                  <p>www.{activeChat.company.toLowerCase().replace(/\s/g, '')}.com.br</p>
                </div>
                <div className={styles.profileInfo}>
                  <label><Mail size={14} /> E-mail Comercial</label>
                  <p>contato@{activeChat.company.toLowerCase().replace(/\s/g, '')}.com.br</p>
                </div>
                <div className={styles.profileInfo}>
                  <label><MapPin size={14} /> Sede</label>
                  <p>São Paulo, SP - Av. Paulista</p>
                </div>
              </div>
              
              <div className={styles.profileInfo}>
                <label><Award size={14} /> Especialidades e Selos</label>
                <div className={styles.tagCloud}>
                  <span className={styles.tag}>Marketing de Influência</span>
                  <span className={styles.tag}>OOH Digital</span>
                  <span className={styles.tag}>Performance Ads</span>
                  <span className={styles.tag}>Branded Content</span>
                </div>
              </div>

              <div className={styles.profileInfo}>
                <label><Users size={14} /> Sobre a Agência</label>
                <p>Especializada em conectar marcas a audiências qualificadas através de projetos inovadores de mídia e conteúdo. Atuamos há mais de 10 anos no mercado nacional, atendendo grandes contas do varejo e serviços.</p>
              </div>

              <div className={styles.clientLogos}>
                <label>Principais Clientes</label>
                <div className={styles.logoRow}>
                  <div className={styles.miniLogo}>Client A</div>
                  <div className={styles.miniLogo}>Client B</div>
                  <div className={styles.miniLogo}>Client C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Kit Modal */}
      {showMediaKitModal && activeChat && (
        <div className={styles.modalOverlay}>
          <div className={styles.mediaKitModal}>
            <button className={styles.closeModalBtn} onClick={() => setShowMediaKitModal(false)}><X size={20} /></button>
            <div className={styles.mediaKitHeader}>
              <h3>Media Kit • {activeChat.company}</h3>
              <p>Dados de audiência atualizados em tempo real via HOAS Intelligence</p>
            </div>
            
            <div className={styles.mediaKitGrid}>
              <div className={styles.mediaStat}>
                <TrendingUp size={20} />
                <span>Alcance Total</span>
                <h4>4.8M</h4>
                <small>+12% vs mês anterior</small>
              </div>
              <div className={styles.mediaStat}>
                <Users size={20} />
                <span>Impressões</span>
                <h4>15.2M</h4>
                <small>Impacto multicanal</small>
              </div>
              <div className={styles.mediaStat}>
                <Award size={20} />
                <span>CTR Médio</span>
                <h4>2.45%</h4>
                <small>Acima da média do mercado</small>
              </div>
            </div>

            <div className={styles.demographicsSection}>
              <div className={styles.demoCard}>
                <label><PieChart size={16} /> Perfil do Público</label>
                <div className={styles.demoBars}>
                  <div className={styles.demoBarRow}>
                    <span>18-24 anos</span>
                    <div className={styles.barContainer}><div className={styles.barFill} style={{width: '25%'}}></div></div>
                    <span>25%</span>
                  </div>
                  <div className={styles.demoBarRow}>
                    <span>25-34 anos</span>
                    <div className={styles.barContainer}><div className={styles.barFill} style={{width: '45%'}}></div></div>
                    <span>45%</span>
                  </div>
                  <div className={styles.demoBarRow}>
                    <span>35-44 anos</span>
                    <div className={styles.barContainer}><div className={styles.barFill} style={{width: '20%'}}></div></div>
                    <span>20%</span>
                  </div>
                </div>
              </div>

              <div className={styles.demoCard}>
                <label><BarChart3 size={16} /> Canais de Maior Impacto</label>
                <div className={styles.channelGrid}>
                  <div className={styles.channelItem}><span>Instagram</span><strong>60%</strong></div>
                  <div className={styles.channelItem}><span>LinkedIn</span><strong>15%</strong></div>
                  <div className={styles.channelItem}><span>DOOH</span><strong>25%</strong></div>
                </div>
              </div>
            </div>

            <div className={styles.mediaContent}>
              <label>Cases de Sucesso Recentes</label>
              <div className={styles.placeholderGallery}>
                <div className={styles.galleryItem}>
                  <span>Case Verão 2024</span>
                  <small>Aumento de 30% em ROI</small>
                </div>
                <div className={styles.galleryItem}>
                  <span>Lançamento Tech</span>
                  <small>Reach de 2.1M em 48h</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PI Modal */}
      {showPIModal && activeChat && (
        <div className={styles.modalOverlay}>
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
                      ? histories[contact.id][histories[contact.id].length - 1].text || "Solicitação de Reunião"
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
                <button className={styles.scheduleBtn} onClick={() => { setIsScheduling(true); setShowContext(true); setStep(1); }}>
                  <Calendar size={18} />
                  <span>Marcar Reunião</span>
                </button>
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
                  {msg.type === 'meeting_request' ? (
                    <div className={styles.meetingCard}>
                      <div className={styles.meetingCardHeader}>
                        <Zap size={16} />
                        <span>Convite de Reunião</span>
                      </div>
                      <div className={styles.meetingCardBody}>
                        <h4>{msg.meeting.title}</h4>
                        <div className={styles.meetingMeta}>
                          <div className={styles.metaItem}><Calendar size={14} /> {msg.meeting.date}</div>
                          <div className={styles.metaItem}><Clock size={14} /> {msg.meeting.time}</div>
                        </div>
                        <div className={styles.meetingStatus}>
                          {msg.meeting.status === 'pending' ? (
                            msg.sender === 'them' ? (
                              <div className={styles.meetingActions}>
                                <button className={styles.approveBtn} onClick={() => handleMeetingAction(msg.id, 'approve')}>Aprovar</button>
                                <button className={styles.rejectBtn} onClick={() => handleMeetingAction(msg.id, 'reject')}>Recusar</button>
                                <button className={styles.rescheduleBtn} onClick={() => handleMeetingAction(msg.id, 'reschedule')}>Sugerir Nova Data</button>
                              </div>
                            ) : (
                              <span className={styles.statusLabel}>Aguardando confirmação...</span>
                            )
                          ) : (
                            <span className={`${styles.statusLabel} ${styles[msg.meeting.status]}`}>
                              {msg.meeting.status === 'approved' ? '✓ Reunião Confirmada' : 
                               msg.meeting.status === 'rejected' ? '✕ Reunião Recusada' : 
                               '⟲ Nova data solicitada'}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={styles.msgTime}>{msg.time}</span>
                    </div>
                  ) : (
                    <div className={styles.messageBubble}>
                      <p>{msg.text}</p>
                      <div className={styles.msgFooter}>
                        <span>{msg.time}</span>
                        {msg.sender === 'me' && <CheckCheck size={14} className={styles.checkIcon} />}
                      </div>
                    </div>
                  )}
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
          {isScheduling ? (
            <>
              <div className={styles.contextHeader}>
                <button className={styles.backBtn} onClick={() => step === 1 ? setIsScheduling(false) : setStep(1)}>
                  <ArrowLeft size={16} />
                </button>
                <h3>{step === 1 ? 'Data Disponível' : 'Horários Livres'}</h3>
              </div>
              <div className={styles.contextContent}>
                {step === 1 ? (
                  <div className={styles.schedulingStep}>
                    <div className={styles.inputGroup}>
                      <label>Título da Reunião</label>
                      <input required value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} placeholder="Ex: Fechamento de Proposta" />
                    </div>
                    
                    <label className={styles.sectionLabel}>Selecione um dia disponível:</label>
                    <div className={styles.availableDatesGrid}>
                      {availableDates.map((d) => (
                        <button 
                          key={d.full} 
                          className={`${styles.dateSlot} ${newMeeting.date === d.full ? styles.activeSlot : ''}`}
                          onClick={() => {
                            setNewMeeting({...newMeeting, date: d.full});
                            setStep(2);
                          }}
                        >
                          <span className={styles.slotDay}>{d.day}</span>
                          <span className={styles.slotDate}>{d.date.split('/')[0]}</span>
                        </button>
                      ))}
                    </div>
                    <p className={styles.formHint}>Estes são os dias em que {activeChat.name} liberou a agenda.</p>
                  </div>
                ) : (
                  <div className={styles.schedulingStep}>
                    <div className={styles.selectedDateInfo}>
                      <Calendar size={14} />
                      <span>{newMeeting.date}</span>
                    </div>
                    <label className={styles.sectionLabel}>Escolha um horário:</label>
                    <div className={styles.timeSlotsGrid}>
                      {availableTimes.map((t) => (
                        <button 
                          key={t} 
                          className={`${styles.timeSlot} ${newMeeting.time === t ? styles.activeSlot : ''}`}
                          onClick={() => setNewMeeting({...newMeeting, time: t})}
                        >
                          <Clock size={14} />
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className={styles.stepActions}>
                      <button 
                        className={styles.primaryAction} 
                        disabled={!newMeeting.time}
                        onClick={handleScheduleMeeting}
                      >
                        Enviar Convite
                      </button>
                      <button className={styles.secondaryAction} onClick={() => setStep(1)}>Mudar Data</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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

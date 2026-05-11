'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ShieldCheck, Clock, Plus, 
  CheckCircle2, Circle, Trash2, CalendarDays, MapPin, 
  Users, ChevronRight, Search, CheckSquare, X,
  ChevronLeft, AlertCircle, RefreshCw, Save,
  AlignLeft, Tag, Mail
} from 'lucide-react';
import styles from './page.module.css';

export default function PlatformCalendar() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);

  const [newTodo, setNewTodo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any>(null);
  const [appToDelete, setAppToDelete] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState(7);
  
  const [formData, setFormData] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    participants: '',
    guestEmail: '',
    sendInvite: false,
    type: 'REUNIÃO',
    category: 'GERAL',
    description: ''
  });

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const filteredApps = appointments.filter(app => app.day === selectedDay);

  const handleOpenModal = (app: any = null) => {
    if (app) {
      setEditingApp(app);
      setFormData({
        title: app.title,
        startTime: app.startTime,
        endTime: app.endTime,
        location: app.location,
        participants: app.with,
        guestEmail: app.guestEmail || '',
        sendInvite: false,
        type: app.type,
        category: app.category,
        description: app.description
      });
    } else {
      setEditingApp(null);
      setFormData({
        title: '',
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        participants: '',
        guestEmail: '',
        sendInvite: false,
        type: 'REUNIÃO',
        category: 'GERAL',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const saveAppointment = () => {
    if (!formData.title) return;
    if (editingApp) {
      setAppointments(prev => prev.map(a => a.id === editingApp.id ? { ...a, ...formData, with: formData.participants, day: selectedDay, date: `${selectedDay < 10 ? '0' + selectedDay : selectedDay}/05/2026` } : a));
    } else {
      setAppointments(prev => [...prev, { id: Date.now(), ...formData, with: formData.participants, day: selectedDay, date: `${selectedDay < 10 ? '0' + selectedDay : selectedDay}/05/2026`, status: 'Agendado' }]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number) => {
    setAppToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = () => {
    if (appToDelete) {
      setAppointments(prev => prev.filter(a => a.id !== appToDelete));
      setAppToDelete(null);
      setIsConfirmModalOpen(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.adminBadge}>
            <ShieldCheck size={14} />
            <span>Gestão Operacional</span>
          </div>
          <h1>Agenda & Tarefas</h1>
          <p>Coordene seus compromissos e gerencie sua lista de atividades diárias.</p>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.agendaSection}>
          <div className={styles.topRow}>
            <div className={styles.calendarCard}>
              <div className={styles.calendarHeader}>
                <div className={styles.monthInfo}><CalendarIcon size={16} /><h3>Maio 2026</h3></div>
                <div className={styles.calendarNav}><button><ChevronLeft size={16} /></button><button><ChevronRight size={16} /></button></div>
              </div>
              <div className={styles.calendarGrid}>
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, idx) => <div key={`${d}-${idx}`} className={styles.dayName}>{d}</div>)}
                {Array.from({ length: 5 }).map((_, p) => <div key={`p-${p}`} className={styles.dayEmpty}></div>)}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const hasApp = appointments.some(a => a.day === day);
                  return (
                    <div key={day} className={`${styles.dayCell} ${day === selectedDay ? styles.selectedDay : ''} ${hasApp ? styles.hasApp : ''}`} onClick={() => setSelectedDay(day)}>
                      <span>{day}</span>
                      {hasApp && <div className={styles.appIndicator}></div>}
                    </div>
                  );
                })}
              </div>
              <button className={styles.quickAddBtn} onClick={() => handleOpenModal()}><Plus size={14} /> Agendar p/ dia {selectedDay}</button>
            </div>

            <div className={styles.daySummary}>
              <div className={styles.dayHeader}><h2>Dia {selectedDay}</h2><span>{filteredApps.length} compromissos</span></div>
              <div className={styles.filteredList}>
                {filteredApps.length > 0 ? filteredApps.map(app => (
                  <div key={app.id} className={styles.miniAppCard} onClick={() => handleOpenModal(app)}>
                    <div className={styles.miniTime}>{app.startTime}</div>
                    <div className={styles.miniDetails}><strong>{app.title}</strong><span className={styles.typeBadge}>{app.type}</span></div>
                    <RefreshCw size={14} className={styles.reschedIcon} />
                  </div>
                )) : <div className={styles.emptyDay}>Nenhuma atividade para este dia.</div>}
              </div>
            </div>
          </div>

          <div className={styles.listHeader}><div className={styles.iconBox}><CalendarDays size={20} /></div><h2>Próximos Compromissos</h2></div>
          <div className={styles.appointmentList}>
            {appointments.slice(0, 5).sort((a,b) => a.day - b.day).map(app => (
              <div key={app.id} className={styles.appointmentCard} onClick={() => handleOpenModal(app)}>
                <div className={styles.timeInfo}><strong>{app.startTime} - {app.endTime}</strong><span>{app.date}</span></div>
                <div className={styles.divider}></div>
                <div className={styles.appointmentDetails}>
                  <div className={styles.appTitleRow}><h3>{app.title}</h3><span className={styles.catBadge}>{app.category}</span></div>
                  <div className={styles.metaRow}><span><Users size={14} /> {app.with}</span><span><MapPin size={14} /> {app.location}</span></div>
                </div>
                <button className={styles.viewBtn}><RefreshCw size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.todoSidebar}>
          <div className={styles.sectionHeader}><div className={styles.iconBox}><CheckSquare size={20} /></div><h2>Lista de Tarefas</h2></div>
          <form className={styles.todoForm} onSubmit={(e) => { e.preventDefault(); if (!newTodo) return; setTodos([...todos, { id: Date.now(), task: newTodo, completed: false }]); setNewTodo(''); }}>
            <input type="text" placeholder="Adicionar nova tarefa..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
            <button type="submit"><Plus size={18} /></button>
          </form>
          <div className={styles.todoList}>
            {todos.map(todo => (
              <div key={todo.id} className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
                <button className={styles.checkBtn} onClick={() => toggleTodo(todo.id)}>{todo.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}</button>
                <span className={styles.todoText}>{todo.task}</span>
                <button className={styles.deleteTodo} onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Advanced Appointment Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrapper}>{editingApp ? <RefreshCw size={24} /> : <CalendarIcon size={24} />}</div>
              <h2>{editingApp ? 'Reagendar Compromisso' : 'Novo Compromisso'}</h2>
              <p>Gerenciando agenda para o dia {selectedDay} de Maio</p>
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label><AlignLeft size={14} /> Título do Compromisso</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Reunião de Alinhamento Estratégico" style={{fontFamily: 'inherit'}} /></div>
              <div className={styles.inputGroup}><label><Clock size={14} /> Início</label><input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{fontFamily: 'inherit'}} /></div>
              <div className={styles.inputGroup}><label><Clock size={14} /> Término</label><input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} style={{fontFamily: 'inherit'}} /></div>
              <div className={styles.inputGroup}><label><Tag size={14} /> Tipo</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{fontFamily: 'inherit'}}><option>REUNIÃO</option><option>WORKSHOP</option><option>EVENTO</option><option>WEBINAR</option><option>OUTRO</option></select></div>
              <div className={styles.inputGroup}><label><ShieldCheck size={14} /> Categoria</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{fontFamily: 'inherit'}}><option>GERAL</option><option>ESTRATÉGICO</option><option>TREINAMENTO</option><option>MARKETING</option><option>FINANCEIRO</option></select></div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label><MapPin size={14} /> Local / Link</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Ex: Sala de Reuniões 02 ou link do Meet" style={{fontFamily: 'inherit'}} /></div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label><Users size={14} /> Participantes Internos</label><input type="text" value={formData.participants} onChange={e => setFormData({...formData, participants: e.target.value})} placeholder="Ex: Equipe de Vendas, João Silva..." style={{fontFamily: 'inherit'}} /></div>
              
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label><Mail size={14} /> Convidar Externo (E-mail)</label>
                <div className={styles.inviteRow}>
                  <input 
                    type="email" 
                    value={formData.guestEmail} 
                    onChange={e => setFormData({...formData, guestEmail: e.target.value})} 
                    placeholder="email@externo.com" 
                    style={{fontFamily: 'inherit'}} 
                  />
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={formData.sendInvite} 
                      onChange={e => setFormData({...formData, sendInvite: e.target.checked})} 
                    />
                    <span>Enviar Convite</span>
                  </label>
                </div>
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label><AlignLeft size={14} /> Descrição / Notas</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Pauta da reunião ou observações importantes..." rows={3} style={{fontFamily: 'inherit'}} /></div>
            </div>
            <div className={styles.modalActions}>
              {editingApp && <button className={styles.cancelBtn} onClick={() => confirmDelete(editingApp.id)}>Remover</button>}
              <button className={styles.primaryActionBtn} onClick={saveAppointment}><Save size={18} /> {editingApp ? 'Salvar Alterações' : 'Criar Compromisso'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsConfirmModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.warningIconWrapper}><AlertCircle size={40} /></div>
            <h2>Confirmar Exclusão</h2>
            <p className={styles.confirmText}>Tem certeza que deseja remover este compromisso? Esta ação não poderá ser desfeita.</p>
            <div className={styles.modalActions}>
              <button className={styles.secondaryBtn} onClick={() => setIsConfirmModalOpen(false)}>Manter</button>
              <button className={styles.dangerBtn} onClick={executeDelete}>Confirmar e Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

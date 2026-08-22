import React, { useState } from 'react';
import { BoardProvider, useBoard } from './context/BoardContext';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { AdminDashboard } from './components/AdminDashboard';
import { CardModal } from './components/CardModal';

const AppContent: React.FC = () => {
  const { activeView } = useBoard();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      <Header onOpenNewCardModal={() => setIsNewTaskOpen(true)} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'board' ? <KanbanBoard /> : <AdminDashboard />}
      </main>

      <CardModal
        isOpen={isNewTaskOpen}
        card={null}
        defaultStatus="Backlog"
        onClose={() => setIsNewTaskOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BoardProvider>
      <AppContent />
    </BoardProvider>
  );
};

export default App;

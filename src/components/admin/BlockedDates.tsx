import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type BlockedDate = {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
};

export default function BlockedDates() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newBlock, setNewBlock] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  async function fetchBlockedDates() {
    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('start_date');

      if (error) throw error;
      setBlockedDates(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der blockierten Termine:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addBlockedDate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('blocked_dates')
        .insert([newBlock]);

      if (error) throw error;
      
      setNewBlock({ start_date: '', end_date: '', reason: '' });
      setShowForm(false);
      fetchBlockedDates();
    } catch (error) {
      console.error('Fehler beim Hinzufügen des blockierten Termins:', error);
    }
  }

  async function deleteBlockedDate(id: string) {
    try {
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchBlockedDates();
    } catch (error) {
      console.error('Fehler beim Löschen des blockierten Termins:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">Blockierte Termine</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          {showForm ? 'Abbrechen' : 'Neuer Block'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addBlockedDate} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start
              </label>
              <input
                type="datetime-local"
                required
                value={newBlock.start_date}
                onChange={(e) => setNewBlock({ ...newBlock, start_date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ende
              </label>
              <input
                type="datetime-local"
                required
                value={newBlock.end_date}
                onChange={(e) => setNewBlock({ ...newBlock, end_date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grund
            </label>
            <input
              type="text"
              required
              value={newBlock.reason}
              onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="z.B. Urlaub, Fortbildung, etc."
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Speichern
          </button>
        </form>
      )}

      <div className="space-y-4">
        {blockedDates.map((block) => (
          <div
            key={block.id}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div>
              <div className="font-medium">
                {format(new Date(block.start_date), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })}
                {' bis '}
                {format(new Date(block.end_date), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })}
              </div>
              <div className="text-sm text-gray-500">{block.reason}</div>
            </div>
            <button
              onClick={() => deleteBlockedDate(block.id)}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

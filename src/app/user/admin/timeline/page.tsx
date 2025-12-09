'use client';

import { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  GripVertical,
  Save,
  X,
  RotateCcw,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: 'heart' | 'sparkles';
  order: number;
  isDefault: boolean;
}

export default function TimelineManagement() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    icon: 'heart' as 'heart' | 'sparkles',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/timeline');
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newEvents = [...events];
    const draggedEvent = newEvents[draggedIndex];
    newEvents.splice(draggedIndex, 1);
    newEvents.splice(index, 0, draggedEvent);

    // Update order property
    const updatedEvents = newEvents.map((event, idx) => ({
      ...event,
      order: idx,
    }));

    setEvents(updatedEvents);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    try {
      setSaving(true);
      const response = await fetch('/api/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: events.map((event) => ({ id: event.id, order: event.order })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Timeline order updated successfully');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update timeline order');
      fetchEvents(); // Reload to reset order
    } finally {
      setSaving(false);
      setDraggedIndex(null);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newEvents = [...events];
    [newEvents[index - 1], newEvents[index]] = [newEvents[index], newEvents[index - 1]];

    // Update order property
    const updatedEvents = newEvents.map((event, idx) => ({
      ...event,
      order: idx,
    }));

    setEvents(updatedEvents);

    try {
      setSaving(true);
      const response = await fetch('/api/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: updatedEvents.map((event) => ({ id: event.id, order: event.order })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Timeline order updated successfully');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update timeline order');
      fetchEvents();
    } finally {
      setSaving(false);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === events.length - 1) return;

    const newEvents = [...events];
    [newEvents[index], newEvents[index + 1]] = [newEvents[index + 1], newEvents[index]];

    // Update order property
    const updatedEvents = newEvents.map((event, idx) => ({
      ...event,
      order: idx,
    }));

    setEvents(updatedEvents);

    try {
      setSaving(true);
      const response = await fetch('/api/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: updatedEvents.map((event) => ({ id: event.id, order: event.order })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Timeline order updated successfully');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update timeline order');
      fetchEvents();
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Event added successfully');
        setShowAddForm(false);
        resetForm();
        fetchEvents();
      } else {
        setError(data.error || 'Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Failed to add event');
    } finally {
      setSaving(false);
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/timeline/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Event updated successfully');
        setEditingEvent(null);
        resetForm();
        fetchEvents();
      } else {
        setError(data.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/timeline/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Event deleted successfully');
        fetchEvents();
      } else {
        setError(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event');
    } finally {
      setSaving(false);
    }
  };

  const handleResetTimeline = async () => {
    if (
      !confirm(
        'Are you sure you want to reset the timeline to default? This will delete all custom events.'
      )
    )
      return;

    try {
      setSaving(true);
      const response = await fetch('/api/timeline', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Timeline reset to default successfully');
        fetchEvents();
      } else {
        setError(data.error || 'Failed to reset timeline');
      }
    } catch (error) {
      console.error('Error resetting timeline:', error);
      setError('Failed to reset timeline');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
      icon: event.icon,
    });
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      date: '',
      title: '',
      description: '',
      icon: 'heart',
    });
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const IconComponent = ({ icon }: { icon: 'heart' | 'sparkles' }) =>
    icon === 'sparkles' ? <Sparkles className="w-5 h-5" /> : <Heart className="w-5 h-5" />;

  if (loading) {
    return (
        <div className="flex items-center justify-center h-svh">
          <div className="text-gray-600">Loading timeline events...</div>
        </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              Love Story Timeline Management
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your timeline events. Drag and drop to reorder.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingEvent(null);
                resetForm();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#9caf88] text-white rounded-md hover:bg-[#8a9d76] transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
            <button
              onClick={handleResetTimeline}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="flex-1 wrap-break-word">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="flex-1 wrap-break-word">{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingEvent) && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 border-b-2 border-[#d4a5a5] ">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          <form onSubmit={editingEvent ? handleEditEvent : handleAddEvent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a5a5] focus:border-transparent"
                  placeholder="e.g., First Met, January 2020"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      icon: e.target.value as 'heart' | 'sparkles',
                    })
                  }
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a5a5] focus:border-transparent"
                >
                  <option value="heart">Heart</option>
                  <option value="sparkles">Sparkles</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a5a5] focus:border-transparent"
                  placeholder="e.g., Where It All Began"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4a5a5] focus:border-transparent"
                  rows={5}
                  placeholder="Describe this moment in your love story..."
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#9caf88] text-white rounded-md hover:bg-[#8a9d76] transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEvent(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline Events List */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
          Timeline Events ({events.length})
        </h3>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-500 text-center py-8">
              No timeline events yet. Add your first event above!
            </p>
          ) : (
            events.map((event, index) => (
              <div
                key={event.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                    flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-gray-200
                    hover:border-[#d4a5a5] transition-all cursor-move
                    ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}
                  `}
              >
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <GripVertical className="hidden md:block w-5 h-5 text-gray-400 shrink-0" />
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-[#9caf88] to-[#d4a5a5] text-white shrink-0">
                    <IconComponent icon={event.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{event.title}</h4>
                      {event.isDefault && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 font-script">{event.date}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 sm:line-clamp-none">{event.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-auto sm:ml-0 shrink-0">
                  {/* Mobile/Tablet reorder buttons */}
                  <div className="flex md:hidden gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0 || saving}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === events.length - 1 || saving}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => startEditing(event)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

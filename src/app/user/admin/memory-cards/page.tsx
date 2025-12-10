'use client';

import { useState, useEffect } from 'react';
import { Trash2, Loader2, Image as ImageIcon, Calendar, User, MessageSquare } from 'lucide-react';

interface MemoryCard {
    id: string;
    serialNumber: number;
    name: string;
    message: string;
    photo?: string;
    timestamp: Date;
    createdAt: Date;
}

export default function AdminMemoryCardsPage() {
    const [cards, setCards] = useState<MemoryCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/memory-cards');
            const data = await response.json();

            if (data.success) {
                const formattedCards = data.cards.map((card: any) => ({
                    ...card,
                    timestamp: new Date(card.timestamp),
                    createdAt: new Date(card.createdAt || card.timestamp),
                }));
                setCards(formattedCards);
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm('Are you sure you want to delete this memory card? This action cannot be undone.')) {
            return;
        }

        setDeletingCardId(cardId);
        try {
            const response = await fetch(`/api/admin/memory-cards/${cardId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                setCards(cards.filter((card) => card.id !== cardId));
            } else {
                alert(data.error || 'Failed to delete memory card');
            }
        } catch (error) {
            console.error('Error deleting card:', error);
            alert('An error occurred while deleting the card');
        } finally {
            setDeletingCardId(null);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#d4a5a5]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Memory Cards Management
                </h2>
                <p className="text-gray-600">
                    Total Cards: <span className="font-semibold">{cards.length}</span>
                </p>
            </div>

            {/* Cards Grid */}
            {cards.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">No memory cards yet</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group"
                        >
                            {/* Delete Button */}
                            <button
                                onClick={() => handleDeleteCard(card.id)}
                                disabled={deletingCardId === card.id}
                                className="absolute right-2 top-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete this card"
                            >
                                {deletingCardId === card.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>

                            {/* Card Content */}
                            {card.photo ? (
                                <>
                                    <div
                                        className="relative h-48 w-full overflow-hidden bg-gray-100 cursor-pointer"
                                        onClick={() => setLightboxImage(card.photo!)}
                                    >
                                        <img
                                            src={card.photo}
                                            alt={card.name}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <p className="font-semibold text-gray-800">{card.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                                {card.createdAt.toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {card.message}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d4a5a5] to-[#b88989] shadow-md">
                                            <span className="text-2xl font-bold text-white">
                                                {getInitials(card.name)}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <p className="font-semibold text-gray-800">{card.name}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm text-gray-500">
                                                    {card.createdAt.toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
                                    <div className="flex gap-2">
                                        <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                                        <p className="text-sm text-gray-700 leading-relaxed italic">
                                            "{card.message}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Serial Number Badge */}
                            <div className="absolute left-2 top-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                                <p className="text-xs font-semibold text-gray-600">
                                    #{card.serialNumber}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="relative max-h-[90vh] max-w-[90vw]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={lightboxImage}
                            alt="Full size"
                            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

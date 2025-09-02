import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from './src/components/Header';
import { Textarea } from '../src/components/ui/textarea';
import { Input } from '../src/components/ui/input';

interface Note {
    id: string;
    title: string;
    content: string;
    link: string;
    lastModified: string;
    isCustom: boolean;
}

const GenericNotePage = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // Load note from localStorage on initial render
    useEffect(() => {
        try {
            const userNotes: Note[] = JSON.parse(localStorage.getItem('userNotes') || '[]');
            const currentNote = userNotes.find(n => n.id === id);
            if (currentNote) {
                setTitle(currentNote.title);
                setContent(currentNote.content);
            }
        } catch (error) {
            console.error("Failed to load note from localStorage:", error);
        }
    }, [id]);

    // Save note to localStorage on change (debounced)
    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (!id) return;
            try {
                const userNotes: Note[] = JSON.parse(localStorage.getItem('userNotes') || '[]');
                const noteIndex = userNotes.findIndex(n => n.id === id);
                if (noteIndex > -1) {
                    userNotes[noteIndex] = { ...userNotes[noteIndex], title, content, lastModified: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) };
                    localStorage.setItem('userNotes', JSON.stringify(userNotes));
                    window.dispatchEvent(new Event('notesChanged'));
                }
            } catch (error) {
                console.error("Failed to save note to localStorage:", error);
            }
        }, 500); // 500ms debounce delay

        return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current) };
    }, [title, content, id]);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <main className="container mx-auto px-6 py-8 flex-grow flex flex-col">
                <div className="space-y-4 flex-grow flex flex-col">
                    <Input
                        placeholder="Note Title..."
                        className="text-2xl lg:text-4xl font-bold p-0 border-none focus-visible:ring-0 h-auto bg-transparent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Start scribbling..."
                        className="flex-grow text-base lg:text-lg p-0 border-none focus-visible:ring-0 bg-transparent resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </main>
        </div>
    );
};

export default GenericNotePage;


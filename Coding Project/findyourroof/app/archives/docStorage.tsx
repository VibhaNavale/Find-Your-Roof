'use client';
import React, { useState, useEffect, useRef } from 'react';
import supabase from '../config/supabaseClient';
import './docStorage.css';

interface Document {
    name: string;
    createdAt: string;
}

interface DocStorageProps {
    userId: String;
}

export const DocStorage: React.FC<DocStorageProps> = ({ userId }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true); // TODO: Implement this to show loader
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getAllDocuments();
    }, []);

    const getAllDocuments = async () => {
        const { data, error } = await supabase.storage
            .from('documents')
            .list(userId + '/', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (data) {
            const docs = data.map((doc: any) => ({
                name: doc.name,
                createdAt: formatDate(doc.created_at),
            }));
            setDocuments(docs);
        } else {
            console.log('Error fetching documents: ', error);
        }
    };

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const bucket = 'documents';

        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(userId + '/' + file.name, file);

            if (data) {
                getAllDocuments();
            }
            if (error) {
                alert('Error uploading file.');
                console.error('Error:', error);
                return;
            }

            alert('File uploaded successfully!'); // TODO: Change this to show toast message
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const formatDate = (utcDateString: string) => {
        const date = new Date(utcDateString);
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        return date.toLocaleString(undefined, options);
    };

    const handleView = (fileName: string) => {
        window.open(
            'https://azuagehbxmcquxsenjtd.supabase.co/storage/v1/object/public/documents/' +
                userId +
                '/' +
                fileName,
            '_blank'
        );
    };

    const handleRemove = async (fileName: string) => {
        try {
            setLoading(true);

            // Remove the document from the storage
            const { data, error } = await supabase.storage
                .from('documents')
                .remove([userId + '/' + fileName]);

            if (error) {
                throw error;
            }

            // Fetch updated list of documents
            await getAllDocuments();
        } catch (error) {
            console.error('Error removing file: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="archives-table-container">
            <h1>Your Documents</h1>
            <table className="archives-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Uploaded At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc, index) => (
                        <tr
                            key={index}
                            className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                        >
                            <td>{doc.name}</td>
                            <td>{doc.createdAt}</td>
                            <td>
                                <button onClick={() => handleView(doc.name)}>
                                    View
                                </button>
                                <button onClick={() => handleRemove(doc.name)}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="upload-container">
                <button className="upload-button" onClick={handleUpload}>
                    + Upload
                </button>
                <input
                    type="file"
                    className="hidden-input"
                    ref={fileInputRef}
                    onChange={uploadFile}
                />
            </div>
        </div>
    );
};

import React from 'react';
import { Button } from './ui/button';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
    text: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ text }) => {
    const handleClick = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Button onClick={handleClick} style={{ backgroundColor: '#25D366', color: 'white', border: 'none', cursor: 'pointer' }}>
            <FaWhatsapp/>
        </Button>
    );
};

export default WhatsAppButton;
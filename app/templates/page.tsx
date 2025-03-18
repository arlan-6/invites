import Navigation from '@/components/navigation';
import { TemplatesList } from '@/components/templates-list';
import React from 'react';

const TemplatesPage: React.FC = () => {
    return (
        <div>
            <Navigation />
            <TemplatesList />
        </div>
    );
};

export default TemplatesPage;
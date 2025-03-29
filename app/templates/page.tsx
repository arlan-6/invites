
import { TemplatesList } from '@/components/templates-list';
import { getAllTemplates } from '@/lib/templateUtils';
import React from 'react';

const TemplatesPage: React.FC = async () => {
    const templates = await getAllTemplates()
    return (
        <div>
            <TemplatesList templates={templates} />
        </div>
    );
};

export default TemplatesPage;
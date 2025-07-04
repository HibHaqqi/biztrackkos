import React from 'react';

type PageHeaderProps = {
  title: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

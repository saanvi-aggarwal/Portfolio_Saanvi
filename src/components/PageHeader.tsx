import React from 'react';

interface PageHeaderProps {
  tag: string;
  title: string;
  accentWord: string;
  description?: string;
}

export function PageHeader({ tag, title, accentWord, description }: PageHeaderProps) {
  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 border-b border-[rgba(13,13,13,0.08)] bg-[#f4f2ee]">
      <div className="site-container">
        {/* Mono Tag */}
        <div className="rv mb-3">
          <span className="mono-tag">{tag}</span>
        </div>

        {/* Heading */}
        <h1 className="heading-primary text-3xl sm:text-5xl lg:text-6xl text-[#0d0d0d] mb-4 max-w-4xl rv stagger-1">
          {title}{' '}
          <span className="heading-accent">{accentWord}.</span>
        </h1>

        {/* Subtitle / Resume Summary excerpt */}
        {description && (
          <p className="text-sm sm:text-base md:text-lg text-[#3a3a3a] max-w-2xl leading-relaxed rv stagger-2 font-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

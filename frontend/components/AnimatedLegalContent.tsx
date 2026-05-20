"use client";

export const LegalSection = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => {
  return (
    <section
      id={id}
      className="py-10 border-b border-[#E2E8F0] last:border-b-0"
    >
      <h2 className="text-2xl font-serif font-semibold text-[#0F172A] mb-6">
        {title}
      </h2>
      <div className="space-y-5 text-[#334155] font-sans leading-relaxed">
        {children}
      </div>
    </section>
  );
};

export const LegalPageLayout = ({ title, children, toc }: { title: string; children: React.ReactNode; toc?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-[120px] pb-24">

      {/* Hero Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 max-w-5xl flex flex-col lg:flex-row gap-16 items-start">

        {/* Table of Contents Wrapper */}
        {toc && (
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-32 shrink-0">
            {toc}
          </aside>
        )}

        {/* Content Wrapper */}
        <div className="w-full flex-1">
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#E2E8F0] shadow-sm">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};




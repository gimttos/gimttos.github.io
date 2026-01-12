import React, { useState } from 'react';
import { Scroll, Terminal, Menu, X, Info, ExternalLink } from 'lucide-react';
import { NAV_ITEMS, GUIDE_CONTENT, SCRIPTS, GUIDE_ID } from './constants';
import CodeBlock from './components/CodeBlock';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>(GUIDE_ID);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const activeScript = SCRIPTS[activeTabId];
  const isGuide = activeTabId === GUIDE_ID;

  const handleCopySuccess = () => {
    setShowToast(true);
  };

  const NavContent = () => (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setActiveTabId(item.id);
            setIsMobileMenuOpen(false);
          }}
          className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3
            ${activeTabId === item.id 
              ? 'bg-black text-white shadow-md' 
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
        >
          {item.type === 'guide' ? <Info size={18} /> : <Terminal size={18} />}
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50">
      <Toast 
        message="클립보드에 복사되었습니다." 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-zinc-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h1 className="text-lg font-bold text-zinc-900">롤20 유저 스크립트 배포</h1>
          <p className="text-xs text-zinc-500 font-medium">team OR</p>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-white z-30 p-4 overflow-y-auto">
          <NavContent />
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-zinc-200 h-screen sticky top-0 overflow-y-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Scroll className="text-zinc-900" size={24} />
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">롤20 스크립트</h1>
          </div>
          <p className="text-sm text-zinc-500 font-semibold pl-8">team OR</p>
        </div>
        <NavContent />
        
        <div className="mt-auto pt-6 border-t border-zinc-100">
          <p className="text-xs text-zinc-400 text-center">
            &copy; {new Date().getFullYear()} Team OR.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        {isGuide ? (
          <div className="animate-[fadeIn_0.4s_ease-out]">
            <header className="mb-8 pb-6 border-b border-zinc-200">
              <h2 className="text-3xl font-bold text-zinc-900 mb-3">{GUIDE_CONTENT.title}</h2>
              <p className="text-zinc-600 text-lg">{GUIDE_CONTENT.description}</p>
            </header>
            
            <div className="space-y-8">
              {GUIDE_CONTENT.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-lg text-zinc-900 mb-2">{step.title}</h3>
                    <p className="text-zinc-600 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          activeScript && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <header className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded text-xs font-mono bg-zinc-200 text-zinc-700">v{activeScript.version}</span>
                    <span className="text-xs text-zinc-400">Updated {activeScript.updatedAt}</span>
                  </div>
                  {activeScript.author && (
                    <span className="text-sm font-semibold text-zinc-400">
                      by {activeScript.author}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">{activeScript.title}</h2>
                {activeScript.subtitle && (
                  <h3 className="text-lg text-zinc-500 font-medium mb-4">{activeScript.subtitle}</h3>
                )}
                <p className="text-zinc-600 text-lg leading-relaxed border-l-4 border-zinc-900 pl-4 py-2 bg-zinc-50 rounded-r-lg">
                  {activeScript.description}
                </p>
              </header>

              <div className="space-y-10">
                {/* Introduction Section */}
                {activeScript.content?.introduction && (
                  <section>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">소개</h3>
                    <div className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
                      {activeScript.content.introduction}
                    </div>
                  </section>
                )}

                {/* Usage Section with Images */}
                {activeScript.content?.usage && (
                  <section>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">사용 예시</h3>
                    <div className="bg-zinc-100 p-6 rounded-xl border border-zinc-200">
                      <div className="text-zinc-700 leading-relaxed whitespace-pre-wrap font-medium mb-6">
                        {activeScript.content.usage.description}
                      </div>
                      
                      {activeScript.content.usage.images && activeScript.content.usage.images.length > 0 && (
                        <div className="grid grid-cols-1 gap-6">
                          {activeScript.content.usage.images.map((img, idx) => (
                            <div key={idx} className="overflow-hidden rounded-lg shadow-sm border border-zinc-300">
                              <img 
                                src={img} 
                                alt={`사용 예시 ${idx + 1}`} 
                                className="w-full h-auto object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Specific Guide Section */}
                {activeScript.content?.guideSteps && (
                  <section>
                    <h3 className="text-xl font-bold text-zinc-900 mb-6">적용 가이드</h3>
                    <div className="space-y-6">
                      {activeScript.content.guideSteps.map((step, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-white rounded-lg border border-zinc-100 shadow-sm">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="pt-1 flex-1">
                            <h4 className="font-bold text-base text-zinc-900 mb-1">{step.title}</h4>
                            <p className="text-zinc-600 text-sm leading-relaxed mb-2">{step.text}</p>
                            {step.link && (
                              <a 
                                href={step.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                              >
                                링크 바로가기 <ExternalLink size={12} className="ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Code Section (Single or Multiple) */}
                <section>
                  {activeScript.additionalCodeBlocks ? (
                    <div className="space-y-8">
                      {activeScript.additionalCodeBlocks.map((block, idx) => (
                         <div key={idx}>
                           <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-zinc-900 text-xl">{block.title}</h3>
                              <span className="text-xs text-zinc-500">Copy the code below</span>
                           </div>
                           <CodeBlock code={block.code} onCopy={handleCopySuccess} />
                         </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-zinc-900 text-xl">스크립트 코드</h3>
                        <span className="text-xs text-zinc-500">Copy the code below</span>
                      </div>
                      <CodeBlock code={activeScript.code} onCopy={handleCopySuccess} />
                    </>
                  )}
                </section>
              </div>

              <div className="mt-12 pt-6 border-t border-zinc-200">
                <h4 className="font-medium text-zinc-900 mb-2">사용 시 주의사항</h4>
                <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
                  <li>이 스크립트는 Roll20의 DOM 구조가 변경되면 작동하지 않을 수 있습니다.</li>
                  <li>다른 확장 프로그램과 충돌이 발생할 수 있습니다.</li>
                  <li>문제 발생 시 트위터로 문의해주세요.</li>
                </ul>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default App;
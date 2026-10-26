"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, MapPin, Clock, DollarSign, MessageSquare, User, Sparkles, Send, 
  CheckCircle2, Bot, RefreshCw, Utensils 
} from 'lucide-react';

export default function LunchMateApp() {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const [activeTab, setActiveTab] = useState('match');
  const [timeSlot, setTimeSlot] = useState('11:30 - 12:00');
  const [purpose, setPurpose] = useState('tam-chuyen');
  const [budget, setBudget] = useState('35k');
  const [selectedCampus, setSelectedCampus] = useState('Cơ sở A');
  
  const [isMatching, setIsMatching] = useState(false);
  const [matchedGroup, setMatchedGroup] = useState<any>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const timeSlots = ['11:00 - 11:30', '11:30 - 12:00', '12:00 - 12:30'];
  const budgets = ['25k', '35k', '50k', '100k+'];

  const campuses = [
    { id: 'A', name: 'Cơ sở A (59C Nguyễn Đình Chiểu, Q.3)' },
    { id: 'B', name: 'Cơ sở B (279 Nguyễn Tri Phương, Q.10)' },
    { id: 'N', name: 'Cơ sở N (N2, Nguyễn Văn Linh, Bình Chánh)' },
    { id: 'H', name: 'Cơ sở H (232/6 Võ Thị Sáu, Q.3)' }
  ];

  const purposes = [
    { id: 'tam-chuyen', label: 'Tám chuyện', sub: 'Kết bạn mới, chia sẻ sở thích', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    { id: 'ngoai-ngu', label: 'Học ngoại ngữ', sub: 'Vừa ăn vừa luyện speaking', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    { id: 'deadline', label: 'Chạy deadline', sub: 'Vừa ăn vừa học, làm bài nhóm', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    { id: 'mon-moi', label: 'Thử món mới', sub: 'Cùng đi săn quán hot', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  ];

  const places = [
    { id: 1, name: 'Cơm Tấm Ba Cường', type: 'Cơm tấm', price: '35k - 50k', rating: 4.8, campus: 'Cơ sở A', address: 'Nguyễn Đình Chiểu, Q.3', tags: ['Sườn nướng', 'Nhanh gọn'] },
    { id: 2, name: 'Bún Rêu Bà Tám', type: 'Bún rêu', price: '30k - 45k', rating: 4.6, campus: 'Cơ sở B', address: 'Nguyễn Tri Phương, Q.10', tags: ['Nóng hổi', 'Chua cay'] },
    { id: 3, name: 'The Coffee House', type: 'Cà phê & Bánh', price: '40k - 65k', rating: 4.7, campus: 'Cơ sở A', address: 'Trần Cao Vân, Q.3', tags: ['Chạy deadline', 'Máy lạnh'] },
    { id: 4, name: 'Trà Sữa ToCoToCo', type: 'Trà sữa', price: '25k - 45k', rating: 4.5, campus: 'Cơ sở B', address: 'Đào Duy Từ, Q.10', tags: ['Tám chuyện', 'Wifi mạnh'] }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim().toLowerCase().endsWith('@st.ueh.edu.vn')) {
      setEmailError('Vui lòng nhập đúng email sinh viên UEH (@st.ueh.edu.vn)');
      return;
    }
    setEmailError('');
    setIsLoggedIn(true);
  };

  const handleStartMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      setMatchedGroup({
        id: 'group_12pm_' + Date.now(),
        time: timeSlot,
        purpose: purposes.find(p => p.id === purpose)?.label,
        budget: budget,
        campus: selectedCampus,
      });
      setIsMatching(false);
      
      setMessages([
        { id: 1, sender: 'System', text: '🎉 Nhóm 3 người của bạn đã kết nối thành công!', isSystem: true },
        { id: 2, sender: 'Minh Hoàng', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', text: 'Chào mọi người nha! Trưa nay ăn gì đâyyy?' },
        { id: 3, sender: 'LunchMate Bot', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100', text: 'Chào team UEH! Mình là LunchMate Bot đây 🤖. Mọi người thích ăn món gì để mình gợi ý nhé!', isAi: true }
      ]);
      setActiveTab('chat');
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = { id: Date.now(), sender: 'Bạn', text: inputMessage, isMe: true };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');

    if (aiEnabled) {
      setIsAiTyping(true);
      setTimeout(() => {
        let aiReply = "Ý kiến hay đó! Quanh khu vực này có nhiều quán ngon lắm nè.";
        const txt = currentInput.toLowerCase();
        if (txt.includes('cơm') || txt.includes('đói')) {
          aiReply = "Đói bụng tầm này ghé Cơm Tấm Ba Cường ngon lắm nha, giá tầm 35k-40k hợp túi tiền sinh viên! 🍛";
        } else if (txt.includes('cà phê') || txt.includes('uống') || txt.includes('deadline')) {
          aiReply = "Vừa uống nước vừa chạy deadline thì ghé The Coffee House hoặc ToCoToCo gần cơ sở nè! ☕🧋";
        } else {
          aiReply = `Trưa nay nhóm mình chốt đi ăn tầm tầm ${budget} nhé, để tớ tìm thêm vài quán hợp gu cả nhóm! ✨`;
        }

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'LunchMate Bot',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
          text: aiReply,
          isAi: true
        }]);
        setIsAiTyping(false);
      }, 1000);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-800">12PM LunchMate</h1>
            <p className="text-sm text-slate-500">Mạng xã hội ghép đôi ăn trưa cho Sinh viên UEH</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Sinh viên UEH
              </label>
              <input
                type="email"
                placeholder="tensinhvien@st.ueh.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 text-sm"
                required
              />
              {emailError && <p className="text-xs text-red-500 mt-1.5">{emailError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition duration-200"
            >
              Đăng nhập bằng Email UEH
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">Dành riêng cho cộng đồng @st.ueh.edu.vn</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-xl relative pb-20">
        
        <header className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
              12PM
            </div>
            <span className="font-bold text-slate-800">LunchMate</span>
          </div>
          <span className="text-xs font-medium bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full border border-orange-100">
            UEH Student
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          
          {activeTab === 'match' && (
            <div className="p-5 space-y-6">
              <div>
                <h1 className="text-xl font-black text-slate-800">Lập kèo ăn trưa hôm nay</h1>
                <p className="text-xs text-slate-500 mt-1">Bụng đối rồi, tìm người cùng tần số thôi!</p>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" /> Khung giờ rảnh
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2.5 px-2 text-xs font-medium rounded-xl border transition-all ${
                        timeSlot === slot 
                          ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-500" /> Bạn tìm người ăn cùng để...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {purposes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPurpose(p.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${p.bg} ${
                        purpose === p.id 
                          ? `${p.border} ring-2 ring-orange-500/20 shadow-sm` 
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className={`font-bold text-sm ${p.text}`}>{p.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-orange-500" /> Ngân sách dự kiến
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        budget === b 
                          ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" /> Khu vực UEH
                </label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {campuses.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleStartMatch}
                disabled={isMatching}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {isMatching ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Đang tìm 2-4 cạ cứng phù hợp...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Tìm nhóm ăn cùng ngay</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'places' && (
            <div className="p-5 space-y-4">
              <div>
                <h1 className="text-xl font-black text-slate-800">Quán hay quanh UEH</h1>
                <p className="text-xs text-slate-500 mt-1">Được đề xuất cho cạ cứng ăn uống & chạy deadline</p>
              </div>

              <div className="space-y-3">
                {places.map((place) => (
                  <div key={place.id} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{place.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{place.address} • <span className="text-orange-500 font-semibold">{place.campus}</span></p>
                      </div>
                      <span className="text-xs font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded-lg">
                        ⭐ {place.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                      <span className="font-bold text-slate-700">{place.price}</span>
                      <span>•</span>
                      <span>{place.type}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {place.tags.map(t => (
                        <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-[calc(100vh-140px)]">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 font-bold rounded-full flex items-center justify-center text-xs">
                    3+
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Nhóm Ăn Trưa UEH</h3>
                    <p className="text-[10px] text-slate-400">3 Thành viên + AI Assistant</p>
                  </div>
                </div>

                <button 
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all ${
                    aiEnabled ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  <Bot className="w-3 h-3" />
                  {aiEnabled ? 'AI Rep: Bật' : 'AI Rep: Tắt'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg) => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                      {!msg.isMe && (
                        <img src={msg.avatar} alt={msg.sender} className="w-7 h-7 rounded-full object-cover mt-0.5" />
                      )}
                      <div className={`max-w-[75%] space-y-1 ${msg.isMe ? 'items-end' : ''}`}>
                        <div className="text-[10px] text-slate-400 px-1">
                          {msg.sender} {msg.isAi && <span className="text-purple-500 font-bold">🤖 AI</span>}
                        </div>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.isMe 
                            ? 'bg-orange-500 text-white rounded-tr-none' 
                            : msg.isAi
                            ? 'bg-purple-50 border border-purple-100 text-purple-900 rounded-tl-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isAiTyping && (
                  <div className="flex items-center gap-2 text-xs text-purple-500 font-medium italic">
                    <Bot className="w-4 h-4 animate-bounce" />
                    <span>LunchMate Bot đang gõ trả lời...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Nhắn gì đó cho nhóm..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-5 space-y-6">
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-orange-500/20"
                  />
                  <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base">{email.split('@')[0]}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{email}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Trạng thái xác thực</span>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sinh viên UEH
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Số buổi ghép nhóm</span>
                  <span className="font-bold text-slate-800">12 buổi</span>
                </div>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl text-xs hover:bg-red-100 transition-all"
              >
                Đăng xuất
              </button>
            </div>
          )}

        </main>

        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 flex justify-between items-center z-10">
          {[
            { id: 'match', label: 'Kết nối', icon: Users },
            { id: 'places', label: 'Địa điểm', icon: MapPin },
            { id: 'chat', label: 'Tin nhắn', icon: MessageSquare, badge: matchedGroup ? true : false },
            { id: 'profile', label: 'Cá nhân', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 relative ${
                  isActive ? 'text-orange-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
                } transition-all`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{tab.label}</span>
                {tab.badge && (
                  <span className="absolute -top-1 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
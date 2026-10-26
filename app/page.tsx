"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Globe, Heart, MessageSquare, User, Clock, MapPin, 
  Send, ArrowLeft, Bot, Search, Utensils, Coffee, Laptop, Smile, Footprints, Bike, Bus, Share2
} from 'lucide-react';

export default function LunchMateApp() {
  const [activeTab, setActiveTab] = useState('match');
  const [matchMode, setMatchMode] = useState<'group' | 'duo'>('group');
  const [timeSlot, setTimeSlot] = useState('11:30 - 12:00');
  const [purpose, setPurpose] = useState('deadline');
  const [budget, setBudget] = useState('35k');
  const [selectedCampus, setSelectedCampus] = useState('Cơ sở A - Nguyễn Đình Chiểu (Q.3)');

  const [chatSubView, setChatSubView] = useState<'menu' | 'group' | 'direct_list' | 'direct_detail'>('menu');
  const [selectedPlaceForNav, setSelectedPlaceForNav] = useState<any>(null);
  const [navMode, setNavMode] = useState<'walk' | 'bike' | 'bus'>('walk');

  const [groupMessages, setGroupMessages] = useState<any[]>([
    { id: 1, text: '🎉 Nhóm 3 thành viên UEH đã được ghép nối thành công!', isSystem: true },
    { id: 2, sender: 'LunchMate Bot', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100', text: '🤖 LunchMate Bot: Chào Khánh Vy & team! Hôm nay tụi mình chọn gặp gỡ/chạy deadline ở đâu quanh Q.3 đây? Tớ gợi ý ghé The Coffee House nha!', isAi: true },
    { id: 3, sender: 'Hoàng Nam (K51)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', text: 'Chào Vy và mọi người! Mình vừa xong ca học ở A101 nè.' }
  ]);
  const [groupInput, setGroupInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const campuses = [
    { id: 'A', name: 'Cơ sở A - Nguyễn Đình Chiểu (Q.3)', district: 'Q.3' },
    { id: 'B', name: 'Cơ sở B - Nguyễn Tri Phương (Q.10)', district: 'Q.10' },
    { id: 'N', name: 'Cơ sở N - Nguyễn Văn Linh (Bình Chánh)', district: 'Bình Chánh' },
    { id: 'C', name: 'Cơ sở C - 3 Tháng 2 (Q.10)', district: 'Q.10' },
    { id: 'E', name: 'Cơ sở E - Nguyễn Văn Thủ (Q.1)', district: 'Q.1' },
    { id: 'V', name: 'Cơ sở V - Võ Thị Sáu (Q.3)', district: 'Q.3' }
  ];

  const allPlaces = [
    { 
      id: 1, 
      name: 'The Coffee House - Trần Cao Vân', 
      type: 'Cà phê & Deadline', 
      district: 'Q.3', 
      price: '35k', 
      desc: 'Không gian rộng rãi, nhiều ổ cắm điện, wifi cực nhanh.',
      walk: 'Rẽ trái cổng CS A 100m, đi thẳng đường Trần Cao Vân 2 phút là tới.',
      bike: 'Chạy thẳng Trần Cao Vân 1 phút, gửi xe ngay bãi trước quán.',
      bus: 'Đón bus 150 dừng trạm Bưu điện Q.3, đi bộ 2 phút.'
    },
    { 
      id: 2, 
      name: 'Cơm Tấm Ba Cường', 
      type: 'Cơm tấm', 
      district: 'Q.3', 
      price: '35k', 
      desc: 'Sườn nướng thơm phức, sát vách Cơ sở A.',
      walk: 'Từ cổng CS A rẽ phải 50m là tới quán.',
      bike: 'Gửi xe tại bãi CS A rồi đi bộ 10 giây.',
      bus: 'Xuống trạm bus CS A đi bộ 1 phút.'
    },
    { 
      id: 3, 
      name: 'Cà Phê Trứng Bưu Điện Q.3', 
      type: 'Cà phê & Luyện nói', 
      district: 'Q.3', 
      price: '35k', 
      desc: 'Góc chill ngắm phố, cực thích hợp luyện Speaking.',
      walk: 'Từ CS V đi bộ về hướng Bưu điện Q.3 tầm 4 phút.',
      bike: 'Gửi xe bãi Bưu điện Q.3 2 phút.',
      bus: 'Xe buýt 03 dừng ngay trạm Võ Thị Sáu.'
    },
    { 
      id: 4, 
      name: 'Highlands Coffee N2TP', 
      type: 'Cà phê & Deadline', 
      district: 'Q.10', 
      price: '35k', 
      desc: 'Đối diện CS B, máy lạnh mát rượi, chỗ ngồi cày bài nhóm.',
      walk: 'Băng qua vạch sang đường đối diện cổng CS B.',
      bike: 'Gửi xe hầm CS B rồi sang đường.',
      bus: 'Các tuyến bus đi qua N2TP dừng ngay trước quán.'
    }
  ];

  const directChats = [
    {
      id: 1,
      name: 'Thảo Nhi (K49)',
      faculty: 'Khoa Ngoại Ngữ UEH',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      lastMessage: 'Chị đặt bàn cày deadline rồi nha Vy!',
      time: '11:15 AM'
    }
  ];

  const chatEndRef = useRef<HTMLDivElement>(null);

  const purposes = [
    { id: 'deadline', label: 'Chạy deadline', sub: 'Cafe yên tĩnh, wifi mạnh', icon: Laptop, bg: 'bg-purple-50', text: 'text-purple-700' },
    { id: 'tam-chuyen', label: 'Cafe & Tám chuyện', sub: 'Góc chill trò chuyện', icon: Coffee, bg: 'bg-pink-50', text: 'text-pink-700' },
    { id: 'ngoai-ngu', label: 'Học ngoại ngữ', sub: 'Ghép cặp luyện Speaking', icon: Smile, bg: 'bg-blue-50', text: 'text-blue-700' },
    { id: 'mon-moi', label: 'Thử món & Quán mới', sub: 'Săn quán hot sinh viên', icon: Utensils, bg: 'bg-amber-50', text: 'text-amber-700' }
  ];

  const getBudgetSuggestions = (b: string) => {
    switch (b) {
      case '25k': return ['Trà sữa kem trứng', 'Cà phê muối', 'Bún riêu bình dân'];
      case '35k': return ['Cơm tấm Ba Cường', 'Americano / Latte', 'Trà trái cây nhiệt đới'];
      case '50k': return ['Matcha Latte đá xay', 'Cơm gà Hải Nam', 'Set bánh ngọt'];
      default: return ['Set Cà phê & Bánh ngọt', 'Buffet lẩu nướng', 'Trà hoa quả cao cấp'];
    }
  };

  const handleSharePlaceToChat = () => {
    if (!selectedPlaceForNav) return;

    const shareMsg = {
      id: Date.now(),
      sender: 'Khánh Vy',
      text: `📍 Mình gợi ý nhóm mình ghé địa điểm này nè:\n📌 ${selectedPlaceForNav.name} (${selectedPlaceForNav.type})\n💰 Tầm giá: ~${selectedPlaceForNav.price}\n📝 Note: ${selectedPlaceForNav.desc}`,
      isMe: true,
      isPlaceCard: true
    };

    setGroupMessages(prev => [...prev, shareMsg]);
    setSelectedPlaceForNav(null);
    setChatSubView('group');
    setActiveTab('chat');
  };

  const handleSendGroupMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupInput.trim()) return;

    const userText = groupInput;
    setGroupMessages(prev => [...prev, { id: Date.now(), sender: 'Khánh Vy', text: userText, isMe: true }]);
    setGroupInput('');

    setIsAiTyping(true);
    setTimeout(() => {
      let aiReply = `🤖 LunchMate Bot: Tớ thấy địa điểm Vy đề xuất hoặc quán The Coffee House sát CS A là siêu chuẩn cho nhóm mình luôn á!`;
      if (userText.toLowerCase().includes('deadline') || userText.toLowerCase().includes('học')) {
        aiReply = `🤖 LunchMate Bot: Cày deadline thì ghé quán nào wifi mạnh có nhiều ổ cắm điện nha cả nhà!`;
      }
      setGroupMessages(prev => [...prev, { id: Date.now() + 1, sender: 'LunchMate Bot', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100', text: aiReply, isAi: true }]);
      setIsAiTyping(false);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages, isAiTyping]);

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative pb-16 overflow-hidden">

        {/* HEADER */}
        <header className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md shadow-orange-500/20">
              12PM
            </div>
            <span className="font-bold text-slate-800 text-sm">LunchMate & Hangout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full border border-orange-100">
              K52 - UEH
            </span>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-7 h-7 rounded-full object-cover border border-orange-400" alt="Avatar" />
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">

          {/* TAB 1: TRANG CHỦ */}
          {activeTab === 'home' && (
            <div className="p-5 space-y-5">
              <div className="text-center py-2 space-y-1">
                <h1 className="text-xl font-black text-slate-800">Trưa nay, bạn chọn kèo gì?</h1>
                <p className="text-xs text-slate-500">Mạng xã hội đi ăn, cafe & cày deadline Sinh viên UEH</p>
              </div>

              <div 
                onClick={() => { setMatchMode('duo'); setActiveTab('match'); }}
                className="p-5 rounded-3xl bg-red-50/60 border border-red-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
              >
                <h2 className="text-center font-black text-slate-800 text-sm tracking-wide uppercase">TÌM BẠN ĐI CAFE & CÀY DEADLINE (1-1)</h2>
                <div className="flex items-center gap-4 bg-white/80 p-3.5 rounded-2xl">
                  <div className="w-10 h-10 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 font-medium">
                    <li>• Bắt cặp 1-1 ghép đôi cực nhanh</li>
                    <li>• Cùng nhau đi cafe, chia sẻ kinh nghiệm</li>
                  </ul>
                </div>
              </div>

              <div 
                onClick={() => { setMatchMode('group'); setActiveTab('match'); }}
                className="p-5 rounded-3xl bg-blue-50/60 border border-blue-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
              >
                <h2 className="text-center font-black text-slate-800 text-sm tracking-wide uppercase">TẠO & THAM GIA NHÓM (3-4 NGƯỜI)</h2>
                <div className="flex items-center gap-4 bg-white/80 p-3.5 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center font-bold">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 font-medium">
                    <li>• Ghép nhóm vui vẻ, đông đúc</li>
                    <li>• Tìm quán cafe bàn rộng hoặc quán ăn gần campus</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KẾT NỐI */}
          {activeTab === 'match' && (
            <div className="p-5 space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-black text-slate-800">Lập kèo ngay hôm nay</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Tìm cạ cứng cùng gu quanh UEH</p>
                </div>
                <div className="flex bg-slate-200 p-1 rounded-xl text-[10px] font-bold">
                  <button onClick={() => setMatchMode('group')} className={`px-2.5 py-1 rounded-lg transition ${matchMode === 'group' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'}`}>Nhóm 3-4</button>
                  <button onClick={() => setMatchMode('duo')} className={`px-2.5 py-1 rounded-lg transition ${matchMode === 'duo' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'}`}>Ghép 1-1</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase">Bạn tìm người đi cùng để...</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {purposes.map((p) => {
                    const IconComp = p.icon;
                    return (
                      <button key={p.id} onClick={() => setPurpose(p.id)} className={`p-3 rounded-2xl text-left border transition ${p.bg} ${purpose === p.id ? 'border-slate-800 ring-2 ring-slate-800/10 shadow-sm' : 'border-transparent opacity-80'}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <IconComp className="w-4 h-4 text-slate-700" />
                          <span className={`font-black text-xs ${p.text}`}>{p.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{p.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase">Ngân sách dự kiến</label>
                <div className="grid grid-cols-4 gap-2">
                  {['25k', '35k', '50k', '100k+'].map((b) => (
                    <button key={b} onClick={() => setBudget(b)} className={`py-2 text-xs font-black rounded-xl border transition ${budget === b ? 'border-orange-500 bg-orange-500 text-white shadow-md' : 'border-slate-200 bg-white text-slate-600'}`}>{b}</button>
                  ))}
                </div>
                <div className="bg-orange-50/70 p-3 rounded-2xl border border-orange-100 text-[11px] text-slate-600">
                  <span className="font-bold text-orange-700">💡 Gợi ý tầm giá {budget}:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {getBudgetSuggestions(budget).map((item, i) => (
                      <span key={i} className="bg-white px-2 py-0.5 rounded-lg border border-orange-200 text-orange-900 font-medium">• {item}</span>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => { setChatSubView('group'); setActiveTab('chat'); }} className="w-full py-3.5 bg-orange-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition">
                {matchMode === 'duo' ? 'Tìm bạn ghép đôi 1-1 ngay 🚀' : 'Tạo & Kết nối nhóm ngay 🚀'}
              </button>
            </div>
          )}

          {/* TAB 3: KHÁM PHÁ */}
          {activeTab === 'explore' && (
            <div className="p-5 space-y-4">
              <div>
                <h1 className="text-xl font-black text-slate-800">Cà phê & Quán ăn hot gần bạn</h1>
                <p className="text-xs text-slate-500">Chạm vào địa điểm để xem chỉ đường & gửi vào nhóm Chat</p>
              </div>

              <div className="space-y-3">
                {allPlaces.map((place) => (
                  <div 
                    key={place.id} 
                    onClick={() => setSelectedPlaceForNav(place)}
                    className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1.5 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">{place.name}</h3>
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">{place.type}</span>
                    </div>
                    <p className="text-xs text-slate-500">{place.desc}</p>
                    <div className="flex justify-between items-center text-[10px] pt-1">
                      <span className="font-bold text-orange-600">Khu vực: {place.district}</span>
                      <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Xem đường đi ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TIN NHẮN */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full min-h-[520px]">
              {chatSubView === 'menu' && (
                <div className="p-5 space-y-6">
                  <div className="text-center py-2">
                    <h1 className="text-lg font-black text-slate-800">Xin chào Khánh Vy! Chọn cuộc trò chuyện:</h1>
                  </div>

                  <div onClick={() => setChatSubView('group')} className="p-6 rounded-3xl bg-pink-100/60 border border-pink-200 text-center space-y-3 cursor-pointer hover:shadow-md transition">
                    <h2 className="font-black text-pink-600 text-base uppercase">HỘI THOẠI NHÓM & BOT AI</h2>
                    <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center text-pink-500 shadow-sm">
                      <Utensils className="w-6 h-6" />
                    </div>
                  </div>

                  <div onClick={() => setChatSubView('direct_list')} className="p-6 rounded-3xl bg-sky-100/60 border border-sky-200 text-center space-y-3 cursor-pointer hover:shadow-md transition">
                    <h2 className="font-black text-sky-800 text-base uppercase">TRÒ CHUYỆN CÁ NHÂN (1-1)</h2>
                    <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center text-sky-600 shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              )}

              {chatSubView === 'group' && (
                <div className="flex flex-col h-[500px] bg-white">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setChatSubView('menu')} className="p-1 hover:bg-slate-200 rounded-lg">
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <h3 className="text-xs font-bold text-slate-800">Nhóm Ăn Trưa & Cafe UEH</h3>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">AI Active 🤖</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                    {groupMessages.map((msg) => (
                      <div key={msg.id} className={`flex items-start gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                        <div className={`max-w-[82%] space-y-0.5 ${msg.isMe ? 'items-end' : ''}`}>
                          <div className="text-[10px] text-slate-400 px-1 font-semibold">{msg.sender}</div>
                          <div className={`p-3 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                            msg.isMe 
                              ? msg.isPlaceCard 
                                ? 'bg-orange-600 text-white font-semibold border-2 border-orange-300 shadow-md' 
                                : 'bg-orange-500 text-white rounded-tr-none' 
                              : msg.isAi 
                              ? 'bg-purple-100 text-purple-900 border border-purple-200 rounded-tl-none font-medium' 
                              : 'bg-white border text-slate-800 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isAiTyping && <div className="text-xs text-purple-600 italic">LunchMate Bot đang gõ...</div>}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleSendGroupMsg} className="p-3 border-t bg-white flex gap-2">
                    <input type="text" placeholder="Nhập tin nhắn..." value={groupInput} onChange={(e) => setGroupInput(e.target.value)} className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-800 focus:outline-none" />
                    <button type="submit" className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center"><Send className="w-4 h-4" /></button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CÁ NHÂN */}
          {activeTab === 'profile' && (
            <div className="p-5 text-center space-y-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-orange-200" alt="Profile" />
              <h2 className="font-black text-slate-800 text-lg">Khánh Vy</h2>
              <p className="text-xs text-slate-400">K52 - Khoa Kinh tế UEH</p>
            </div>
          )}

        </main>

        {/* MODAL XEM ĐƯỜNG ĐI & GỬI VÀO CHAT */}
        {selectedPlaceForNav && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{selectedPlaceForNav.name}</h3>
                  <p className="text-[11px] text-orange-600 font-bold">{selectedPlaceForNav.type} ({selectedPlaceForNav.district})</p>
                </div>
                <button onClick={() => setSelectedPlaceForNav(null)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">✕</button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setNavMode('walk')} className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${navMode === 'walk' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-600'}`}>
                  <Footprints className="w-4 h-4" /> Đi bộ
                </button>
                <button onClick={() => setNavMode('bike')} className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${navMode === 'bike' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-600'}`}>
                  <Bike className="w-4 h-4" /> Xe máy
                </button>
                <button onClick={() => setNavMode('bus')} className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${navMode === 'bus' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-600'}`}>
                  <Bus className="w-4 h-4" /> Xe buýt
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <p className="font-bold text-slate-700">📍 Hướng dẫn di chuyển từ CS A:</p>
                <p className="text-slate-600 leading-relaxed">
                  {navMode === 'walk' && selectedPlaceForNav.walk}
                  {navMode === 'bike' && selectedPlaceForNav.bike}
                  {navMode === 'bus' && selectedPlaceForNav.bus}
                </p>
              </div>

              <button 
                onClick={handleSharePlaceToChat} 
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Gửi địa điểm này vào nhóm Chat 🚀
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="bg-slate-900 px-3 py-2 flex justify-between items-center text-white sticky bottom-0 z-20">
          {[
            { id: 'home', label: 'Trang chủ', icon: Home },
            { id: 'match', label: 'Kết nối', icon: Globe },
            { id: 'explore', label: 'Khám phá', icon: Heart },
            { id: 'chat', label: 'Tin nhắn', icon: MessageSquare },
            { id: 'profile', label: 'Cá nhân', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'chat') setChatSubView('menu');
                }}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
                  isActive ? 'bg-sky-200 text-slate-900 font-bold scale-105' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}